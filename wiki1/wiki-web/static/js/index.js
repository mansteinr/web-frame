$(function() {
	/* ! 初始化 tab */
	module.tabManage.init();
	//菜单显示隐藏
	$('#menuControll').on('click',function(){
		var activeMenu = $('.menu-item-1.active[data-click="collapse"]'),time = 800;
		if(activeMenu.length){
			activeMenu.trigger('click');
			setTimeout(function(){
				$('body').toggleClass('menu-hide');
			},600);
			time = 1500;
		} else {
			$('body').toggleClass('menu-hide');
		}
		setTimeout(function(){
			module.tabManage.tabReset();
		},time);
	});
	var FN = {
		init: function() {
			var iframeEl = null;
			/*注册获取消息列表*/
			module.messageCallBack.loginChannel = function() {
				iframeEl.remove();
				console.log(this);
				var data = this.data;
				module.localData.setData('username',data.username);
				module.localData.setData('usermtk',data.usermtk);
				module.localData.setData('userInfo',data.userInfo);
				$(".username").text(module.localData.getData('username'));
				module.$http(API.base.querymenus,{"systemName":"Boss"}, function() {
		        	FN.paintMenu(this.resData);
		        });
			}
			iframeEl = $('<iframe src="'+ API.base.loginchannel + '" style="width: 0;height:0;overflow:hidden;"></iframe>');
			$('body').append(iframeEl);
		},paintMenu: function(data) {
			var html = '';
	     	$.each(data, function(k1,v1) {
	     		if(v1.childResource.length > 0) {
	     			html += '<div class="menu-item-1 has-collapse" data-click="collapse" data-target="#menu'+k1+'" data-parent="#mainMenus"><span class="iconfont '+v1.icon+'"></span><span class="menu-item-title">'+v1.name+'</span></div>';
	     			html += '<div id="menu'+k1+'" class="menus-space">';
	     			$.each(v1.childResource, function(k2,v2) {
	     				if(v2.childResource.length > 0) {
	     					html += '<div class="menu-item-2 has-collapse" data-click="collapse" data-target="#menu'+k1+'_'+k2+'" data-parent="#menu'+k1+'"><span class="iconfont '+v2.icon+'"></span>'+v2.name+'</div>';
	     					html += '<div id="menu'+k1+'_'+k2+'" class="menus-space">';
	     					$.each(v2.childResource, function(k3,v3) {
			     				html += '<div class="menu-item-3" data-click="loadtab" data-url="'+v3.resourceUrl+'" data-title="'+ v3.name+'">'+ v3.name+'</div>';
			     			});
			     			html += '</div>';
	     				} else {
	     					html +='<div class="menu-item-2" data-click="loadtab" data-url="'+v2.resourceUrl+'" data-title="'+v2.name+'"><span class="iconfont '+v2.icon+'"></span>'+ v2.name+'</div>';
	     				}
	     			});
	     			html += '</div>';
	     		} else {
	     			html += '<div class="menu-item-1 no-collapse" data-click="loadtab" data-url="'+v1.resourceUrl+'" data-title="'+
	     			v1.name+'"><span class="iconfont '+v1.icon+'"></span><span class="menu-item-title">'+ v1.name+'</span></div>'
	     		}
	     	});
	    	$('#mainMenus').append(html);
		}
	};
	//FN.init();
	/* 退出功能 */
	module.clickTree.loginOut = function() {
		module.$http(API.base.loginout,{}, function() {
        	module.urlToLocation(API.base.login);
        });
	}
	/* 项目选择 */
	module.clickTree.pChoose = function() {
		module.urlToLocation(API.base.projectchoose);
	}
	/* 刷新当前tab */
	module.clickTree.reloadTab = function() {
		var tabid = $('#tab-space .tab-item.active').data('tabid');
		$(document).trigger(EVENT.TAB.RELOAD,tabid);
	}
	/* 删除所有tab */
	module.clickTree.dAllTab = function() {
		$(document).trigger(EVENT.TAB.CLEAR);
	}
});
