$(function () {
    let columns = [{ // 定义列
        field: 'dateTime',
        title: '日期',
        footerFormatter: function () {
            return '总计'
        }
    }, {
        field: 'totalCount',
        title: '总调用量',
        formatter: function (value, row, index) {
            return value || '0'
        },
        footerFormatter: function (data) {
            return eval(module.pluck(data, 'totalCount').join("+")) || '0'
        }
    }, {
        field: 'chargeCount',
        title: '计费用量',
        formatter: function (value, row, index) {
            return value || '0'
        },
        footerFormatter: function (data) {
            return eval(module.pluck(data, 'chargeCount').join("+")) || '0'
        }
    }],
        columns1 = [{ // 定义列
            field: 'loginName',
            title: '客户名称',
            footerFormatter: function () {
                return '总计'
            }
        }, {
            field: 'dataSourceName',
            title: '数据源名称',
            footerFormatter: function () {
                return '-'
            }
        }, {
            field: 'upChargeCount',
            title: '计费用量',
            sortable: true,
            formatter: function (value, row, index) {
                return value || '0'
            },
            footerFormatter: function (data) {
                return eval(module.pluck(data, 'upChargeCount').join("+")) || '0'
            }
        }],
        FN = {
            mergeTable() {
                module.mergeTable('loginName', '#table1')
            },
            /* 客户账单 */
            queryReconciliation: function (op, way) {
                module.$http(API.vehicle[way + 'Count'], op, function () {
                    let data = this.resData
                    $('.chartArea').removeClass('active')
                    if (way === 'margin') { // 利润
                        let columnsData = []
                        if (data.length) {
                            data.forEach((v, k) => {
                                if (v.dataSourceInfo.length) {
                                    v.dataSourceInfo.forEach((v1, k1) => {
                                        columnsData.push({
                                            loginName: v.loginName,
                                            dataSourceName: v1.dataSourceName,
                                            upChargeCount: v1.upChargeCount
                                        })
                                    })
                                }
                            })
                        }
                        module.renderTable({
                            id: "#table1",
                            data: data,
                            columns: columns1,
                            pageNumber: 1,
                            onSort: FN.mergeTable,
                            onPageChange: FN.mergeTable,
                        })
                        module.mergeTable('loginName', '#table1')
                    } else { /** 客户或者数据源 */
                        module.renderTable({
                            id: "#table1",
                            data: data,
                            columns: columns
                        })
                    }
                })
            },
            getCustomers() {
                module.getCustomers().then(res => {
                    $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
                    $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
                    FN.hasServices()
                })
            },
            hasServices() {
                module.hasServices().then(res => {
                    $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
                    $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
                })
            },
            initFun: function () {
                $('.dataSourceName').hide()
                $('.loginName').show()
                // 获取所有的客户名称
                FN.getCustomers()
                module.getAllAbilityInfo('serviceName1')
                laydate.render({
                    elem: '#startTime',
                    type: 'datetime',
                    theme: '#00c2de',
                    min: '2017-03-15',
                    value: module.formaterTime(+new Date() - 60 * 60 * 1000, 'yyyy-mm-dd hh:ii:ss')
                })
                laydate.render({
                    elem: '#endTime',
                    type: 'datetime',
                    theme: '#00c2de',
                    min: '2017-03-15',
                    value: module.formaterTime(+new Date(), 'yyyy-mm-dd hh:ii:ss')
                })
            }
        }

    // 初始化显示
    FN.initFun()

    $('[name="serviceName1"]').off('change').on('change', function () {
        if ($('.quick-search').val() === 'customer') return
        module.$http(API.vehicle.getAbilitySupplilerInfo, { serviceId: $(this).closest('.search-item').find('li.active').data('value') }, function () {
            let data = this.resData.supplierServiceInfos,
                lis = '',
                inputSelector = $('[name="dataSourceName"]')
            if (!data) {
                lis += '<li class="dropdown-item  text-warp" data-value = "暂无数据" >暂无数据</li>'
            } else {
                data.map(v => {
                    lis += '<li class="dropdown-item  text-warp" data-value = "' + v.supplierChannelName.split('.')[0] + '" >' + v.supplierChannelName.split('.')[0] + '</li>'
                })
            }
            inputSelector.closest('.search-item').find('.dropdown-menu').html(lis)
            inputSelector.closest('.search-item').trigger(EVENT.INIT.DOTREE, inputSelector.closest('.search-item'))
            inputSelector.trigger('change')
        })
    })

    $('[name="loginName"]').off('change').on('change', function () {
        FN.hasServices()
    })

    // 条件下拉时 切换搜索条件
    $('.quick-search').off('change').on('change', function () {
        let _this = $(this)
        if (_this.val() === 'customer') {
            $('.loginName').show()
            $('.dataSourceName').hide()
            FN.getCustomers()
        } else if (_this.val() === 'margin') {
            $('.loginName').show()
            $('.dataSourceName').hide()
            $('[name="loginName"]').val('')
            // 获取所有的客户名称
            FN.getCustomers()
        } else {
            $('.dataSourceName').show()
            $('.loginName').hide()
            $('[name="serviceName1"]').trigger('change')
        }
    })
    module.clickTree.queryFun = function () {
        let form = $(this).closest('form'),
            param = form.serializeArray(),
            slelctedValue = form.find('.condition li.active').data('value'),
            options = {}

        $(param).each(function (k, v) {
            options[v.name] = v.value.trim()
        })
        options.startTime = $('[name="startTime"]').val().trim()
        options.endTime = $('[name="endTime"]').val().trim()
        options.serviceName = $('[name="serviceName"]').val().trim()
        if(slelctedValue === 'up') {
            options.serviceName = $('[name="serviceName1"]').closest('.search-item').find('li.active').data('servicename')
        }
        delete options.serviceId
        delete options.serviceName1
        FN.queryReconciliation(options, slelctedValue)
    }

    /** 下载excel */
    module.clickTree.downFile = function () {
        let form = $(this).closest('form'),
            param = form.serializeArray(),
            slelctedValue = form.find('.condition li.active').data('value'),
            options = {}

        $(param).each(function (k, v) {
            options[v.name] = v.value.trim()
        })
        options.startTime = $('[name="startTime"]').val().trim()
        options.endTime = $('[name="endTime"]').val().trim()
        options.serviceName = $('[name="serviceName"]').val().trim()
        if (slelctedValue === 'margin') {
            if (!options.loginName) {
                module.alert('请选择客户名称')
                return
            }
        }
        if(slelctedValue === 'up') {
            options.serviceName = $('[name="serviceName1"]').closest('.search-item').find('li.active').data('servicename')
        }
        delete options.serviceName1
        delete options.serviceId
        module.downFile(API.vehicle[slelctedValue + 'Detail'], options)
    }
})