# wiki-web-help

> 前端基础框架

## 安装步骤

### 安装项目依赖文件
> npm install

### 开发环境，允许server，运行端口 8001，可以在 config index.js文件中修改 dev.port变量来更改版本号
> npm run dev

### 建立测试环境文件
> npm run test

### 建立生产环境
> npm run build

### 建立生产环境 和 查看分析
> npm run build --report

## 代码检查

### 通过运行命令来检查代码，检查目录是src 下面所有的js文件
> npm run lint 或者 npm run lint-fix

### Eslint 禁用和启用代码检查，在一块内不想启用代码检查时可以使用 eslint-disable + 禁用规则，重新启用使用 eslint-enable，例如：
#### /* eslint-disable no-new */
#### new Swiper(options)
#### /* eslint-enable */