$(function(){
  module.extend({
    mergeTable: function(field, selecttor) {
      $table=$(selecttor)
      let obj = this.getObjFromTable($table,field)
      for(let item in obj){  
        $(selecttor).bootstrapTable('mergeCells',{
        index:obj[item].index,
        field:field,
        colspan:1,
        rowspan:obj[item].row
        })
      }
    },
    getObjFromTable: function($table,field) {
      let obj=[], maxV=$table.find("th").length, columnIndex=0, filedVar;
      for(columnIndex=0;columnIndex<maxV;columnIndex++){
        filedVar=$table.find("th").eq(columnIndex).attr("data-field");
        if(filedVar==field) break;
      }
      let $trs=$table.find("tbody > tr"), $tr, index=0, content="", row=1
      for (let i = 0; i <$trs.length;i++) {   
        $tr=$trs.eq(i);
        let contentItem=$tr.find("td").eq(columnIndex).html();
        //exist
        if(contentItem.length>0 && content==contentItem ){
          row++
        }else{
          //save
          if(row>1){
            obj.push({"index":index,"row":row})
          }
          index=i
          content=contentItem
          row=1
        }
      }
      if(row>1)obj.push({"index":index,"row":row})
      return obj
    }
  })
})