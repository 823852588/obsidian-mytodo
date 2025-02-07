# GlobalTodoPlugin

一个强大的 Obsidian 插件，允许你管理 TODO 任务，并支持自定义标记。你可以轻松设置自己喜欢的 TODO 标记文件以及开始/结束标记，以便高效地组织和跟踪任务。

## 功能

- **自定义标记**：定义你希望使用的 TODO 文件和标记。
- **保存设置**：允许用户保存自定义设置，方便以后使用。
- **处理所有 TODO**：根据定义的标记自动处理和更新所有 TODO 任务。

## 安装

1. 从 [Releases 页面](https://github.com/yourusername/obsidian-global-todo-plugin/releases) 下载最新版本。
2. 将内容解压到 Obsidian Vault 的 `.obsidian/plugins` 文件夹中。
3. 在 Obsidian 设置中启用该插件：**设置** > **社区插件**。

或者，你也可以通过 Git 安装该插件：

git clone https://github.com/823852588/obsidian-Mtodo.git

## 配置

### 设置标记

你可以通过插件设置来自定义 TODO 任务的标记。

1. **TODO_MARKER_FILE**：指定 TODO 任务所在的文件。
2. **START_MARKER**：设置标记，表示 TODO 列表的开始。
3. **END_MARKER**：设置标记，表示 TODO 列表的结束。

要修改这些设置，请前往 **设置** > **GlobalTodoPlugin 设置**。

### 默认设置

如果未设置自定义标记，插件将使用以下默认设置：

- `TODO_MARKER_FILE`：`default-todo.md`
- `START_MARKER`：`## TODO Start`
- `END_MARKER`：`## TODO End`

### 示例

```markdown
## TODO Start
- [ ] 任务 1
- [ ] 任务 2
## TODO End

