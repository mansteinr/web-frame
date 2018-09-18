/* ! 定义API配置 */
(function(){
	var apiConfig = {
		protocols: {
			http: 'http://',
			https: 'https://'
		},
		hosts: {
			base: window.localStorage.getItem('baseHost') || '192.168.109.173:9042/mux/',
			upload: window.localStorage.getItem('uploadHost') || '120.55.151.129:17777/'
		},
		apiFormat: function(api,host) {
			return apiConfig.protocols.http + (host?apiConfig.hosts[host]:apiConfig.hosts.base) + api;
		}
	};
	window.localStorage.setItem('baseHost',apiConfig.hosts.base);
	window.localStorage.setItem('uploadHost',apiConfig.hosts.upload);
	/*定义所有api*/
	apiConfig.apis =  {
		base: {
			upload: apiConfig.apiFormat('file/upload','upload'),/* ! 上传文件 */
		}
	};
	/* ！ 挂载到window全家变量 */
	window.API = apiConfig.apis;
})()
