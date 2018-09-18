/**
 * 定义API配置
 */
(function(){
  var apiConfig = {
    // 协议
    protocol: ':protocol',
    // 服务地址
    hosts: {
      // 系统权限管理web页面地址
      rbacWeb: ':hostRbacWeb',
      // 系统权限管理api服务器地址
      rbacApi: ':hostRbacApi',
      // 某个项目
      project: ':hostProject',
    },
    apiFormat: function(host, api) {
      return apiConfig.protocol + apiConfig.hosts[host] + api;
    }
  };
  /*定义所有api*/
  apiConfig.apis =  {
    base: {
      login: apiConfig.apiFormat('rbacApi', ''),
      loginurl: apiConfig.apiFormat('rbacWeb', 'login.html'),
      loginout: apiConfig.apiFormat('rbacApi', 'logout/ajaxLogout'),
      querymenus: apiConfig.apiFormat('rbacApi', 'sys/resource/querySubSystemMenuList')
    },
    project: {
      url: apiConfig.apiFormat('project',''),
      org: apiConfig.apiFormat('rbacApi', 'sys')
    }
  };
  // 挂载到window全局变量
  window.API = apiConfig.apis;
})();
