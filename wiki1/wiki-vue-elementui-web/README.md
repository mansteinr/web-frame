# 前端公共框架基于Vue和ElementUI

> 前端基础共用框架，不断完善中。。。


## Environment

`Node >= 6`

## 开始使用

 - 下载该代码
 - 进入下载目录，执行npm install

``` bash
npm install
```

## 开发环境
> 运行npm run dev，服务启动在 localhost:8010，可通过在webpack.config.js devServer配置port配置服务启动端口
``` bash
# 服务启动在 localhost:8010
npm run dev
```

## 测试环境或生产环境
> 在运行build前，请先配置api服务地址，配置请在config目录中apiConfig.js中配置mode变量（dev|test|prod）
``` bash
# build
npm run build
```