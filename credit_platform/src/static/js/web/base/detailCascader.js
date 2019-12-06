$(function () {
  let FN = {
    // 去除children为空的 防止干扰
    IterationChildren: function(arr) {
      let custTypeNameCnArr = []
      if (arr.length) {
        arr.forEach((v, k) => {
          if( k === 0 ) {
            custTypeNameCnArr.push(v.custTypeNameCn)
            if (v.children && v.children.length) {
              FN.IterationChildren(v.children)
            }
          }
        })
      }
      return custTypeNameCnArr
    },
    businessTypes: function() {
      module.$http(API.commomApi.businessTypes, {}, function () {
        let data = [...[{
          custTypeId: '',
          custTypeNameCn: '其他',
          custTypeNameEn: 'other'
        }],...this.resData]
        new Cascader({
          elem: "#cascader",
          data: data,
          triggerType: "change",
          // 初始值
          value: FN.IterationChildren(data)
        })
      })
    }
  }
  FN.businessTypes()
})