/* ! 定义API配置 */
// 上面有几个相同的ip但是不写在一起 主要是因为开发  测试他们的后台地址不同 
(function () {
  let apiConfig = {
    protocols: ':protocol',
    lable: ':lable',
    upapi: ':upapi',
    rbacweb: ':rbacweb',
    rbacapi: ':rbacapi',
    safaCenterapi: ':newSafaCenterapi',
    qualityanalyzeapi: ':qualityanalyzeapi',
    vehicleapi: ':vehicleapi',
    lightSignInapi: ':lightSignInapi',
    weChatapi: ':weChatapi',
    /*非安全中心*/
    upCtrapi: function (api) {
      return apiConfig.protocols + apiConfig.upapi + api;
    },
    /*安全中心*/
    safaCenterCtrapi: function (api) {
      return apiConfig.protocols + apiConfig.safaCenterapi + api;
    },
    /*安全中心*/
    qualityAnalyzeapi: function (api) {
      return apiConfig.protocols + apiConfig.qualityanalyzeapi + api;
    },
    /*安全中心*/
    vehicleapiapi: function (api) {
      return apiConfig.protocols + apiConfig.vehicleapi + api;
    },
    /** 利润 */
    profitapi: function (api) {
      return apiConfig.protocols + apiConfig.upapi + api;
    },
    /** 一键登陆 */
    lightSignInCtrapi: function (api) {
      return apiConfig.protocols + apiConfig.lightSignInapi + api
    },
    /** 微信公众号 */
    wechatCtrApi: function (api) {
      return apiConfig.protocols + apiConfig.weChatapi + api
    }
  }
  /*定义所有api*/
  apiConfig.apis = {
    lable: apiConfig.lable,
    localMtk: '725cba68-20a7-412c-badc-9fd719dd42e5', // 本地mtk 本地开发时候使用
    base: {
      login: apiConfig.rbacweb + 'login.html',
      loginout: apiConfig.rbacapi + 'logout/ajaxLogout',
      querymenus: apiConfig.rbacapi + 'sys/resource/querySubSystemMenuList',
      projectchoose: apiConfig.rbacweb + 'choose.html',
      loginchannel: apiConfig.rbacweb + 'loginChannel.html',
      imageApi: apiConfig.upCtrapi('file/show')
    },
    /*服务平台公共接口*/
    commomApi: {
      customers: apiConfig.upCtrapi('operator/customers'),
      /*获取客户名称*/
      businessTypes: apiConfig.upCtrapi('operator/businessTypes'),
      /*获取客户名称*/
      services: apiConfig.upCtrapi('operator/services'),
      /*获取接口服务*/
      hasServices: apiConfig.upCtrapi('operator/hasServices'),
      /*客户拥有的服务*/
      getCustomersByWebServiceNames: apiConfig.upCtrapi('operator/getCustomersByWebServiceNames'),
      /* 根据服务名查客户 */
      querySupInfoList: apiConfig.upCtrapi('operator/supplier/querySupInfoList'),
      /* 查询供应商列表 */
      querySupServiceList: apiConfig.upCtrapi('operator/supplier/querySupServiceList'),
      /* 查询供应商服务列表 */
      queryPipeList: apiConfig.upCtrapi('operator/supplier/queryPipeList') /* 根据供应商服务id查询引用该服务的通道列表 */
    },
    /*上游服务平台接口*/
    upServicePlat: {
      getCustomerChargeInfo: apiConfig.upCtrapi('operator/up/getCustomerChargeInfo'),
      /*按客户分析查询调用量*/
      getOutServiceChargeInfo: apiConfig.upCtrapi('operator/up/getOutServiceChargeInfo'),
      /*按服务分析查询调用量*/
      getOutServiceChargeInfoByDay: apiConfig.upCtrapi('operator/up/getOutServiceChargeInfoByDay'),
      /*按日期服务分析查询调用量*/
      getAllOutServiceChargeInfo: apiConfig.upCtrapi('operator/up/getAllOutServiceChargeInfo'),
      /*--获取服务对应上游信息的每天详细统计信息(导出excel表格)*/
      companys: apiConfig.upCtrapi('operator/supplier/companys'),
      /*获取所有上游名称*/
      getOutServiceChargeInfoBySupplier: apiConfig.upCtrapi('operator/up/getOutServiceChargeInfoBySupplier') /*按供应商分析*/
    },
    /*下游服务平台接口*/
    downServicePlat: {
      UsageByDate: apiConfig.upCtrapi('operator/down/UsageByDate'),
      /*获取某一用户的某一服务使用情况：按日期维度*/
      UsageByName: apiConfig.upCtrapi('operator/down/UsageByName'),
      /*获取某一用户的所有服务使用情况：按服务名维度*/
      UsageByResult: apiConfig.upCtrapi('operator/down/UsageByResult'),
      /*获取某一用户的所有服务使用情况：按服务名维度*/
      UsageByResultNew: apiConfig.upCtrapi('operator/down/UsageByResultNew'),
      /*获取某一用户的所有服务使用情况：按服务名维度*/
      byCustomer: apiConfig.upCtrapi('operator/down/UsageByCustomer'),
      /*获取所有使用情况: 按行业维度*/
      getAllCheckParamStatus: apiConfig.upCtrapi('operator/paramCheck/getAllCheckParamStatus'),
      /* 查询所有校验异常类型 */
      getAllCheckRule: apiConfig.upCtrapi('operator/paramCheck/getAllCheckRule'),
      /* 查询所有参数校验类型 */
      saveConfig: apiConfig.upCtrapi('operator/paramCheck/save'),
      /* 服务参数校验关系保存 */
      queryParam: apiConfig.upCtrapi('operator/paramCheck/query'),
      /* 服务参数校验关系查询 */
      queryAllCompleteService: apiConfig.upCtrapi('operator/paramCheck/queryAllCompleteService'),
      /* 查询已配置参数规则服务 */
      getBalanceSnapshot: apiConfig.upCtrapi('operator/accounting/getBalanceSnapshot'),
      /* 这个是获取余额快照 */
      chargeLog: apiConfig.upCtrapi('operator/accounting/chargeLog')
      /* 这个是获取余额快照 */
    },
    /*下游服务平台接口*/
    logsPlat: {
      logs: apiConfig.upCtrapi('operator/logs'),
      /*批量查询日志*/
      logDetail: apiConfig.upCtrapi('operator/logDetail'),
      /*查看日志详情*/
      logByMvTrackId: apiConfig.upCtrapi('operator/logByMvTrackId'),
      /*mvTrackId*/
      upStreamCount: apiConfig.upCtrapi('operator/finance/upStreamCount'),
      /*组合服务上游调用量*/
      mobileOperator: apiConfig.upCtrapi('operator/finance/mobileOperator'),
      /*三网通服务调用量*/
      trackDetail: apiConfig.upCtrapi('operator/finance/trackDetail'),
      /*下游客户调用明细*/
      upStreamDetail: apiConfig.upCtrapi('operator/finance/upStreamDetail') /*下游客户调用明细*/
    },
    operatorPlat: {
      serviceNameParams: apiConfig.upCtrapi('operator/ServiceNameParams/getAll'),
      /*配置管理获取所有的服耳名*/
      deleteByServiceNameAndParamName: apiConfig.upCtrapi('operator/ServiceNameParams/deleteByServiceNameAndParamName'),
      /*配置管理删除的服务名*/
      addServiceNameAndParams: apiConfig.upCtrapi('operator/ServiceNameParams/addServiceNameAndParams'),
      /*配置管理新增的服务名*/
      getParam: apiConfig.upCtrapi('operator/ServiceNameParams/getParam'),
      /*配置管理获取所有的参数*/
      queryParamsByServiceName: apiConfig.upCtrapi('operator/ServiceNameParams/queryParamsByServiceName'),
      /*获取所有的黑名单*/
      getIP: apiConfig.upCtrapi('operator/slb/getIP'), 
      /*增加黑名单*/
      addIPBatch: apiConfig.upCtrapi('operator/slb/addIPBatch'), 
      /*删除黑名单*/
      delIPBatch: apiConfig.upCtrapi('operator/slb/delIPBatch')
    },
    /* 查询中心限量 */
    restrictPlat: {
      getUpServerLimitCount: apiConfig.upCtrapi('operator/limitOfCXZX/getUpServerLimitCount'),
      setUpServerLimitCount: apiConfig.upCtrapi('operator/limitOfCXZX/setUpServerLimitCount'),
      getCustomerLimitCount: apiConfig.upCtrapi('operator/limitOfCXZX/getCustomerLimitCount'),
      setCustomerLimitCount: apiConfig.upCtrapi('operator/limitOfCXZX/setCustomerLimitCount'),
      delCustomerLimitCount: apiConfig.upCtrapi('operator/limitOfCXZX/delCustomerLimitCount'),
      setUpServerLimitFlag: apiConfig.upCtrapi('operator/limitOfCXZX/setUpServerLimitFlag'),
      getUpServerLimitFlag: apiConfig.upCtrapi('operator/limitOfCXZX/getUpServerLimitFlag'),
      getLimitServiceCondition: apiConfig.upCtrapi('operator/limitOfCXZX/getLimitServiceCondition')
    },
    /*安全中心*/
    safePlat: {
      allWords: apiConfig.safaCenterCtrapi('secure/web/word/allWords'),
      /*查询所有的敏感词*/
      insertSensitive: apiConfig.safaCenterCtrapi('secure/web/word/insert'),
      /*新增敏感词*/
      deleteSensitive: apiConfig.safaCenterCtrapi('secure/web/word/delete'),
      /*删除敏感词*/
      updateSensitive: apiConfig.safaCenterCtrapi('secure/web/word/update'),
      /*更新敏感词*/
      insertService: apiConfig.safaCenterCtrapi('secure/web/service/insert'),
      /*新增服务*/
      updateService: apiConfig.safaCenterCtrapi('secure/web/service/update'),
      /*更新服务*/
      deleteService: apiConfig.safaCenterCtrapi('secure/web/service/delete'),
      /*删除服务*/
      allService: apiConfig.safaCenterCtrapi('secure/web/service/allService'),
      /*获取所有的服务*/
      subService: apiConfig.safaCenterCtrapi('secure/web/service/subService'),
      /*获取组合服务所属的子服务*/
      directService: apiConfig.safaCenterCtrapi('secure/web/service/directService'),
      /*获取所有子服务*/
      insertRegular: apiConfig.safaCenterCtrapi('secure/web/regular/insert'),
      /*新增的规则*/
      deleteRegular: apiConfig.safaCenterCtrapi('secure/web/regular/delete'),
      /*删除的规则*/
      updateRegular: apiConfig.safaCenterCtrapi('secure/web/regular/update'),
      /*更新的规则*/
      allRegulars: apiConfig.safaCenterCtrapi('secure/web/regular/allRegulars'),
      /*获取所有规则*/
      updateOrder: apiConfig.safaCenterCtrapi('secure/web/regular/updateOrder'),
      /*更新规则顺序*/
      insertRegIns: apiConfig.safaCenterCtrapi('secure/web/regIns/insert'),
      /* 新增实例 */
      updateRegIns: apiConfig.safaCenterCtrapi('secure/web/regIns/update'),
      /* 更新实例 */
      deleteRegIns: apiConfig.safaCenterCtrapi('secure/web/regIns/delete'),
      /* 删除实例 */
      allRegIns: apiConfig.safaCenterCtrapi('secure/web/regIns/allRegIns'),
      /* 获取所有实例 */
      paramRecord: apiConfig.safaCenterCtrapi('secure/web/record/paramRecord'),
      /* 参数拦截例 */
      recoverUseful: apiConfig.safaCenterCtrapi('secure/web/record/recoverUseful') /* 告警恢复 */
    },
    /*质量分析*/
    qualityAnalyze: {
      getThreshold: apiConfig.qualityAnalyzeapi('qualityanalyze/callDiffNum/getThreshold'),
      /* 供应商（上游）质量分析  实时数据 */
      postThreshold: apiConfig.qualityAnalyzeapi('qualityanalyze/callDiffNum/postThreshold'),
      /* 供应商（上游）质量分析  实时数据 */
      supplierRealTime: apiConfig.qualityAnalyzeapi('qualityanalyze/supplier/realTime'),
      /* 供应商（上游）质量分析  实时数据 */
      supplierHistory: apiConfig.qualityAnalyzeapi('qualityanalyze/supplier/history'),
      /* 供应商（上游）质量分析 历史数据 */
      customerRealTime: apiConfig.qualityAnalyzeapi('qualityanalyze/customer/realTime'),
      /* 客户(下游)质量分析 实时数据 */
      customerHistory: apiConfig.qualityAnalyzeapi('qualityanalyze/customer/history') /* 客户（上游）质量分析 历史数据 */
    },
    /*车辆维保*/
    vehicle: {
      getOrderInfoById: apiConfig.vehicleapiapi('callbackService/operator/getOrderInfoById'),
      /* 订单号查看订单状态 */
      getOrderInfoByVin: apiConfig.vehicleapiapi('callbackService/operator/getOrderInfoByVin'),
      /* vin查询符合条件的订单信息 */
      getDecryptData: apiConfig.vehicleapiapi('callbackService/operator/getDecryptData'),
      /* 订单号查询车保报告 */
      getAbilitySupplilerInfo: apiConfig.vehicleapiapi('callbackService/operator/getAbilitySupplilerInfo'),
      /* 能力供应商通道关联关系展示 */
      alterAbilitySupplilerInfo: apiConfig.vehicleapiapi('callbackService/operator/alterAbilitySupplilerInfo'),
      /* 能力供应商通道关联信息修改 */
      getAllAbilityInfo: apiConfig.vehicleapiapi('callbackService/operator/getAllAbilityInfo'),
      /* 获取所有的能力 */
      customerCount: apiConfig.vehicleapiapi('callbackService/operator/bill/customerCount'),
      /* 客户账单 */
      upCount: apiConfig.vehicleapiapi('callbackService/operator/bill/upCount'),
      /* 数据源账单 */
      marginCount: apiConfig.vehicleapiapi('callbackService/operator/bill/marginCount'),
      /* 利润查询 */
      customerDetail: apiConfig.vehicleapiapi('callbackService/operator/bill/customerDetail'),
      /* 利润查询 */
      upDetail: apiConfig.vehicleapiapi('callbackService/operator/bill/upDetail'),
      /* 利润查询 */
      marginDetail: apiConfig.vehicleapiapi('callbackService/operator/bill/marginDetail') /* 异步利润查询详情 */
    },
    /** 一键登录 */
    lightSignIn: {
      customers: apiConfig.lightSignInCtrapi('operator/lightSignIn/customers'), // 获取一键登录所有的客户
      appInfo: apiConfig.lightSignInCtrapi('operator/lightSignIn/appInfo'), // app信息
      secret: apiConfig.lightSignInCtrapi('operator/lightSignIn/secret') // 查看appKey
    },
    /** 其他板块 */
    others: { /** 利润分析 */
      queryProfit: apiConfig.profitapi('operator/margin/queryByDate')
    },
    wechat: { /** 微信公众号 */
      wechatAdd: apiConfig.wechatCtrApi('wechatService/customerInfo/add'), // 增加客户
      wechatEdit: apiConfig.wechatCtrApi('wechatService/customerInfo/edit'), // 客户信息修改
      wechatDel: apiConfig.wechatCtrApi('wechatService/customerInfo/del'), // 客户信息删除
      wechatQuery: apiConfig.wechatCtrApi('wechatService/customerInfo/query'), // 查询客户信息
      wechatServiceAdd: apiConfig.wechatCtrApi('wechatService/serviceInfo/add'), // 服务信息添加
      wechatServiceEdit: apiConfig.wechatCtrApi('wechatService/serviceInfo/edit'), // 服务信息修改
      wechatServiceDel: apiConfig.wechatCtrApi('wechatService/serviceInfo/del'), // 服务信息删除
      wechatServiceQuery: apiConfig.wechatCtrApi('wechatService/serviceInfo/query'), // 查询服务信息
      wechatAssociationAdd: apiConfig.wechatCtrApi('wechatService/customerServiceInfo/add'), // 新增客户服务关联信息
      wechatAssociationEdit: apiConfig.wechatCtrApi('wechatService/customerServiceInfo/edit'), // 新增客户服务关联信息
      wechatAssociationDel: apiConfig.wechatCtrApi('wechatService/customerServiceInfo/del'), // 新增客户服务关联信息
      wechatAssociationQuery: apiConfig.wechatCtrApi('wechatService/customerServiceInfo/query'), // 新增客户服务关联信息
      wechatLog: apiConfig.wechatCtrApi('wechatService/track/query'), // 新增客户服务关联信息
      alterAuthTotal: apiConfig.wechatCtrApi('wechatService/customerServiceInfo/alterAuthTotal') // 新增客户服务关联信息
    }
  }
  /* ！ 挂载到window全家变量 */
  window.API = apiConfig.apis
})()