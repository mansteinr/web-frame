$(function() {
  module.extend({
    paintCustomer: function (data) {
      let lis = ''
        lis = '<li class="dropdown-input"><input type="text" placeholder="输入搜索" class="search-input m-input"/></li><li class="dropdown-item  text-warp" data-value = "" >全部</li>'
      if (data.length) {
        data.forEach((v, k) => {
          lis += '<li class="dropdown-item  text-warp"  title ="' + v.customerNamezh + '" data-value = "' + v.customerId + '" >' + v.customerNamezh + " (" + v.customerName + ")"+ '</li>'
        })
      } else {
        lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据" >暂无数据</li>'
      }
      $('.card-container').find('[name="customerId"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
      $(document).trigger(EVENT.INIT.DOTREE,$('.card-container').find('[name="customerId"]').closest('.search-item'))
      $('.card-container').find('[name="customerId"]').closest('.select-dropdown').find('ul li.text-warp').eq(0).trigger('click')
    },
    paintService: function (data) {
      let lis = ''
        lis = '<li class="dropdown-input"><input type="text" placeholder="输入搜索" class="search-input m-input"/></li><li class="dropdown-item  text-warp" data-value = "" >全部</li>'
      if (data.length) {
        data.forEach((v, k) => {
          lis += '<li class="dropdown-item  text-warp"  title ="' + v.serviceNamezh + '" data-value = "' + v.serviceId + '" >' + v.serviceNamezh + " (" + v.serviceName + ")"+ '</li>'
        })
      } else {
        lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据" >暂无数据</li>'
      }
      $('.card-container').find('[name="serviceId"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
      $(document).trigger(EVENT.INIT.DOTREE,$('.card-container').find('[name="serviceId"]').closest('.search-item'))
      $('.card-container').find('[name="serviceId"]').closest('.select-dropdown').find('ul li.text-warp').eq(0).trigger('click')
    }
  })
})