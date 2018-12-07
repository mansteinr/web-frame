/* ! 定义API配置 */
(function(){
	var mode = 'dev',apiConfig = {
		protocols: {
			http: 'http://',
			https: 'https://'
		},
		/*生产环境*/
		prod: {
			base: '172.16.9.183:5010/agw/',	/* ! 当前系统api服务器地址 */
			rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
			rbacapi: '172.16.6.83:58080/',	/* ! 系统权限管理api服务器地址 */
		},
		/*上线环境*/
		dev: {
			base: '172.16.9.183:5010/agw/',	/* ! 当前系统api服务器地址 */
			rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
			rbacapi: '172.16.6.83:58080/',	/* ! 系统权限管理api服务器地址 */
		},
		/*测试环境*/
		test: {
			base: '172.16.9.183:5010/agw/',	/* ! 当前系统api服务器地址 */
			rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
			rbacapi: '172.16.6.83:58080/',	/* ! 系统权限管理api服务器地址 */
		},
		apiFormat: function(api) {
			return apiConfig.protocols.http + apiConfig[mode] + api;
		}
	};
	/*定义所有api*/
	apiConfig.apis =  {
		base: {
			login: apiConfig.protocols.http + apiConfig.hosts.rbacweb + 'boss2-0-web/rbac-web/login.html',
			loginout: apiConfig.protocols.http + apiConfig.hosts.rbacapi + 'logout/ajaxLogout',
			querymenus: apiConfig.protocols.http + apiConfig.hosts.rbacapi + 'sys/resource/querySubSystemMenuList',
			projectchoose: apiConfig.protocols.http + apiConfig.hosts.rbacweb + 'boss2-0-web/rbac-web/choose.html',
			loginchannel: apiConfig.protocols.http + apiConfig.hosts.rbacweb + 'boss2-0-web/rbac-web/loginChannel.html',
		},
		/*定义功能名称或者api分组名称*/
		demoApi: {
			/*！能力域api*/
			demo: apiConfig.apiFormat('demo/demo')
		}
	};
	/* ！ 挂载到window全家变量 */
	window.API = apiConfig.apis;
})()
