$(function() {

    let FN = {
        wechatLog: function(op) {
            module.$http(API.wechat.wechatLog, op, function() {
                let data = this.resData;
                if (!module.empty(data)) {
                    data = {}
                }
                $('#guidResult').empty();
                module.hasDataFunction("#guidResult")
                let jsonContainer = document.getElementById("guidResult")
                let editor = new JSONEditor(jsonContainer, {
                    mode: 'view'
                });
                editor.set(data)
                $('.jsoneditor-expand-all').click()
            });
        },
        initFun() {
            FN.wechatLog()
                /*查看图片*/
            module.viewImage()
        }
    };

    /*查詢*/
    module.clickTree.queryFun = function() {
        let form = $(this).closest('form');
        if (module.checkForm(form)) {
            let params = form.serializeArray(),
                options = {};
            $(params).each(function(k, v) {
                if (v.value) {
                    options[v.name] = v.value.trim();
                }
            });
            if (!module.empty(options)) {
                module.alert("请输入trackId");
                return;
            }
            FN.wechatLog(options);
        }
    }
})