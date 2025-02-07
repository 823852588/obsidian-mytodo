import { App, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

const TODO_REGEX = /^-\s\[ ]\s(.*?📅\s\d{4}-\d{2}-\d{2})/gm;

interface GlobalTodoPluginSettings {
  todoMarkerFile: string;
  startMarker: string;
  endMarker: string;
}

const DEFAULT_SETTINGS: GlobalTodoPluginSettings = {
  todoMarkerFile: '002领域（Area）/工作效率和方法/todo待办.md',
  startMarker: '<!-- TODOS -->',
  endMarker: '<!-- /TODOS -->'
};

export default class GlobalTodoPlugin extends Plugin {
  settings: GlobalTodoPluginSettings;
  private debounceTimer: number;

  async onload() {
    await this.loadSettings();

    console.log('Global Todo Plugin loaded');

    this.addSettingTab(new GlobalTodoSettingTab(this.app, this));

    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        if (file instanceof TFile && file.extension === 'md') {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = window.setTimeout(() => {
            this.processAllTodos();
          }, 500);
        }
      })
    );

    this.processAllTodos();
  }

  private async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }

  public async saveSettings() {
    await this.saveData(this.settings);
  }

  public async processAllTodos() {
    const todoFile = this.app.vault.getAbstractFileByPath(this.settings.todoMarkerFile);
    if (!(todoFile instanceof TFile)) return;

    const allTodos: { text: string; date: Date }[] = [];
    const files = this.app.vault.getMarkdownFiles();

    await Promise.all(
      files.map(async (file) => {
        const content = await this.app.vault.read(file);
        const todos = this.parseTodos(content);
        allTodos.push(...todos);
      })
    );

    const sorted = this.sortTodos(allTodos);
    const markdown = this.generateTodoList(sorted);
    await this.updateTodoFile(todoFile, markdown);
  }

  private parseTodos(content: string) {
    const todos: { text: string; date: Date }[] = [];
    let match;
    while ((match = TODO_REGEX.exec(content)) !== null) {
      const text = match[1];
      const dateStr = text.match(/📅\s(\d{4}-\d{2}-\d{2})/)?.[1];
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          todos.push({ text, date });
        }
      }
    }
    return todos;
  }

  private sortTodos(todos: { text: string; date: Date }[]) {
    return todos.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private generateTodoList(todos: { text: string; date: Date }[]) {
    return todos.map((t) => `- ${t.text}`).join('\n');
  }

  private async updateTodoFile(file: TFile, markdown: string) {
    let content = await this.app.vault.read(file);

    // 如果标记不存在，直接退出（不自动插入）
    if (!content.includes(this.settings.startMarker) || !content.includes(this.settings.endMarker)) {
      return;
    }

    // 精确替换标记间内容
    const regex = new RegExp(
      `${this.settings.startMarker}[\\s\\S]*?${this.settings.endMarker}`,
      'g'
    );
    const newContent = content.replace(
      regex,
      `${this.settings.startMarker}\n${markdown}\n${this.settings.endMarker}`
    );

    if (newContent !== content) {
      await this.app.vault.modify(file, newContent);
    }
  }
}

class GlobalTodoSettingTab extends PluginSettingTab {
  plugin: GlobalTodoPlugin;

  constructor(app: App, plugin: GlobalTodoPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // 汇总文件路径设置
    new Setting(containerEl)
      .setName('待办汇总文件路径')
      .setDesc('示例：路径/文件名.md（需包含文件扩展名）')
      .addText(text => text
        .setValue(this.plugin.settings.todoMarkerFile)
        .onChange(async (value) => {
          this.plugin.settings.todoMarkerFile = value;
          await this.plugin.saveSettings();
          this.plugin.processAllTodos(); // 路径修改后立即更新
        }));

    // 开始标记设置
    new Setting(containerEl)
      .setName('起始标记')
      .setDesc('用于定位待办列表开始的HTML注释')
      .addText(text => text
        .setValue(this.plugin.settings.startMarker)
        .onChange(async (value) => {
          this.plugin.settings.startMarker = value;
          await this.plugin.saveSettings();
          this.plugin.processAllTodos();
        }));

    // 结束标记设置
    new Setting(containerEl)
      .setName('结束标记')
      .setDesc('用于定位待办列表结束的HTML注释')
      .addText(text => text
        .setValue(this.plugin.settings.endMarker)
        .onChange(async (value) => {
          this.plugin.settings.endMarker = value;
          await this.plugin.saveSettings();
          this.plugin.processAllTodos();
        }));
  }
}