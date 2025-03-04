# 豆瓣高分书籍榜单 (Douban Top Books List)

一个展示豆瓣评分8.0以上且评价人数超过1000的优质书籍的应用程序。使用 Tauri + HTML/CSS/JavaScript 构建。

![应用主界面](docs/images/main.png)

## 功能特点

- 展示豆瓣高分书籍（评分≥8.0，评价人数≥1000）
- 支持按书名、作者、出版社、简介、标签等多维度搜索
- 支持按评分和评价人数排序
- 支持按标签分类筛选
- 响应式设计，支持多种设备尺寸
- 支持图片懒加载
- 支持自动更新

## 环境要求

- Node.js (v14.0.0 或更高版本)
- Python 3.x (用于开发服务器)
- Rust (最新稳定版)
- Tauri CLI

### 系统要求

- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+ 或其他主流发行版)

## 安装步骤

1. 安装 Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. 安装 Node.js 依赖
```bash
npm install
```

3. 安装 Tauri CLI
```bash
cargo install tauri-cli
```

## 开发

1. 启动开发服务器
```bash
cargo tauri dev
```

## 构建

### 构建可执行文件

```bash
cargo tauri build
```

构建完成后，可执行文件将位于以下目录：

- Windows: `src-tauri/target/release/doubantopbooks.exe`
- macOS: `src-tauri/target/release/doubantopbooks.app`
- Linux: `src-tauri/target/release/doubantopbooks`

### 构建安装包

```bash
cargo tauri build --target msi     # Windows
cargo tauri build --target dmg     # macOS
cargo tauri build --target deb     # Linux (Debian/Ubuntu)
cargo tauri build --target appimage # Linux (通用)
```

## 使用说明

1. 搜索：在搜索框中输入关键词，支持多个关键词（用空格分隔）
2. 排序：使用排序下拉菜单选择排序方式
   - 评价人数（多到少）
   - 评价人数（少到多）
   - 评分（高到低）
   - 评分（低到高）
3. 标签筛选：
   - 点击标签进行筛选
   - 使用"全选"/"取消全选"按钮批量操作
   - 使用"重置所有筛选"清除所有筛选条件

## 项目结构

```
doubantopbookslist/
├── src-tauri/           # Tauri 应用配置和构建文件
├── index.html           # 主页面
├── script.js           # 主要的 JavaScript 代码
├── styles.css          # 样式表
├── books.json          # 书籍数据
├── csv_to_json.py      # 数据转换脚本
└── README.md           # 项目说明文档
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
