/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var p=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var w=(n,i)=>{for(var t in i)p(n,t,{get:i[t],enumerable:!0})},M=(n,i,t,e)=>{if(i&&typeof i=="object"||typeof i=="function")for(let s of T(i))!m.call(n,s)&&s!==t&&p(n,s,{get:()=>i[s],enumerable:!(e=u(i,s))||e.enumerable});return n};var k=n=>M(p({},"__esModule",{value:!0}),n);var x={};w(x,{default:()=>g});module.exports=k(x);var a=require("obsidian"),v=/^-\s\[ ]\s(.*?📅\s\d{4}-\d{2}-\d{2})/gm,S={todoMarkerFile:"002\u9886\u57DF\uFF08Area\uFF09/\u5DE5\u4F5C\u6548\u7387\u548C\u65B9\u6CD5/todo\u5F85\u529E.md",startMarker:"<!-- TODOS -->",endMarker:"<!-- /TODOS -->"},g=class extends a.Plugin{async onload(){await this.loadSettings(),console.log("Global Todo Plugin loaded"),this.addSettingTab(new c(this.app,this)),this.registerEvent(this.app.vault.on("modify",t=>{t instanceof a.TFile&&t.extension==="md"&&(clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.processAllTodos()},500))})),this.processAllTodos()}async loadSettings(){this.settings=Object.assign({},S,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}async processAllTodos(){let t=this.app.vault.getAbstractFileByPath(this.settings.todoMarkerFile);if(!(t instanceof a.TFile))return;let e=[],s=this.app.vault.getMarkdownFiles();await Promise.all(s.map(async l=>{let d=await this.app.vault.read(l),h=this.parseTodos(d);e.push(...h)}));let r=this.sortTodos(e),o=this.generateTodoList(r);await this.updateTodoFile(t,o)}parseTodos(t){var r;let e=[],s;for(;(s=v.exec(t))!==null;){let o=s[1],l=(r=o.match(/📅\s(\d{4}-\d{2}-\d{2})/))==null?void 0:r[1];if(l){let d=new Date(l);isNaN(d.getTime())||e.push({text:o,date:d})}}return e}sortTodos(t){return t.sort((e,s)=>e.date.getTime()-s.date.getTime())}generateTodoList(t){return t.map(e=>`- ${e.text}`).join(`
`)}async updateTodoFile(t,e){let s=await this.app.vault.read(t);if(!s.includes(this.settings.startMarker)||!s.includes(this.settings.endMarker))return;let r=new RegExp(`${this.settings.startMarker}[\\s\\S]*?${this.settings.endMarker}`,"g"),o=s.replace(r,`${this.settings.startMarker}
${e}
${this.settings.endMarker}`);o!==s&&await this.app.vault.modify(t,o)}},c=class extends a.PluginSettingTab{constructor(t,e){super(t,e);this.plugin=e}display(){let{containerEl:t}=this;t.empty(),new a.Setting(t).setName("\u5F85\u529E\u6C47\u603B\u6587\u4EF6\u8DEF\u5F84").setDesc("\u793A\u4F8B\uFF1A\u8DEF\u5F84/\u6587\u4EF6\u540D.md\uFF08\u9700\u5305\u542B\u6587\u4EF6\u6269\u5C55\u540D\uFF09").addText(e=>e.setValue(this.plugin.settings.todoMarkerFile).onChange(async s=>{this.plugin.settings.todoMarkerFile=s,await this.plugin.saveSettings(),this.plugin.processAllTodos()})),new a.Setting(t).setName("\u8D77\u59CB\u6807\u8BB0").setDesc("\u7528\u4E8E\u5B9A\u4F4D\u5F85\u529E\u5217\u8868\u5F00\u59CB\u7684HTML\u6CE8\u91CA").addText(e=>e.setValue(this.plugin.settings.startMarker).onChange(async s=>{this.plugin.settings.startMarker=s,await this.plugin.saveSettings(),this.plugin.processAllTodos()})),new a.Setting(t).setName("\u7ED3\u675F\u6807\u8BB0").setDesc("\u7528\u4E8E\u5B9A\u4F4D\u5F85\u529E\u5217\u8868\u7ED3\u675F\u7684HTML\u6CE8\u91CA").addText(e=>e.setValue(this.plugin.settings.endMarker).onChange(async s=>{this.plugin.settings.endMarker=s,await this.plugin.saveSettings(),this.plugin.processAllTodos()}))}};
