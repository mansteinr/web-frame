/*默认环境模式是开发模式*/
//跳过下一行检查
// eslint-disable-next-line
const mode = process.env.NODE_ENV == 'production' ? 'prod' : (process.env.NODE_ENV == 'test' ? 'test' : 'dev')

/*默认使用协议*/
const protocol = 'http'
const baseConfig = {
  protocols: {
    http: 'http://',
    https: 'https://'
  },
  /*生产环境*/
  prod: {
    base: '172.16.9.181:5010/agw/',	/* ! 当前系统api服务器地址 */
    rbacweb: '172.16.9.211:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '172.16.6.81:58080/'	/* ! 系统权限管理api服务器地址 */
  },
  /*开发环境*/
  dev: {
    base: '172.16.9.182:5010/agw/',	/* ! 当前系统api服务器地址 */
    rbacweb: '172.16.9.212:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '172.16.6.82:58080/'	/* ! 系统权限管理api服务器地址 */
  },
  /*测试环境*/
  test: {
    base: '172.16.9.183:5010/agw/',	/* ! 当前系统api服务器地址 */
    rbacweb: '172.16.9.213:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '172.16.6.83:58080/'	/* ! 系统权限管理api服务器地址 */
  }
}
/*设置api转换*/
let apiFormat = (api = '',hostkey = 'base',pt = protocol) => baseConfig.protocols[pt] + baseConfig[mode][hostkey] + api
const api = {
  base: {
    login: apiFormat('boss2-0-web/rbac-web/login.html','rbacweb'),
    loginout: apiFormat('logout/ajaxLogout','rbacapi'),
    querymenus: apiFormat('sys/resource/querySubSystemMenuList','rbacapi'),
    projectchoose: apiFormat('boss2-0-web/rbac-web/choose.html','rbacweb'),
    loginchannel: apiFormat('boss2-0-web/rbac-web/loginChannel.html','rbacweb')
  },
  /*定义功能名称或者api分组名称*/
  demoApi: {
    /*！能力域api*/
    demo: apiFormat('demo/demo')
  }
}

export default api
