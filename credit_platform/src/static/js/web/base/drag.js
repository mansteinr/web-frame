$(function () {
  module.extend({
    tableDnD: function (el, callback) {
      let startY = 0, endY = 0
      if (typeof (el) == "string") {
        el = document.getElementsByClassName(el);
      }
      if (el == undefined || el == null) {
        return;
      }
      //绑定事件    
      let addEvent = document.addEventListener ? function (el, type, callback) {
        el.addEventListener(type, callback, !1);
      } : function (el, type, callback) {
        el.attachEvent("on" + type, callback);
      }
      //移除事件    
      let removeEvent = document.removeEventListener ? function (el, type, callback) {
        el.removeEventListener(type, callback);
      } : function (el, type, callback) {
        el.detachEvent("on" + type, callback);
      }
      //精确获取样式    
      let getStyle = document.defaultView ? function (el, style) {
        return document.defaultView.getComputedStyle(el, null).getPropertyValue(style)
      } : function (el, style) {
        style = style.replace(/\-(\w)/g, function ($, $1) {
          return $1.toUpperCase();
        });
        return el.currentStyle[style];
      }
      let dragManager = {
        clientY: 0,
        draging: function (e) {//mousemove时拖动行    
          let dragObj = dragManager.dragObj;
          if (dragObj) {
            e = e || event; //清除选区    
            if (window.getSelection) {//w3c    
              window.getSelection().removeAllRanges();
            } else if (document.selection) {
              document.selection.empty(); //IE    
            }
            let y = e.clientY, down = y > dragManager.clientY, tr = document.elementFromPoint(e.clientX, e.clientY);
            if (tr && tr.nodeName == "TD") {
              tr = tr.parentNode
              dragManager.clientY = y;
              if (dragObj !== tr && dragObj.parentNode === tr.parentNode) {
                tr.parentNode.insertBefore(dragObj, (down ? tr.nextSibling : tr));
              }
            };
          }
        },

        dragStart: function (e) {
          e = e || event
          startY = e.clientY
          let target = e.target || e.srcElement;
          if (target.nodeName === "TD") {
            target = target.parentNode;
            dragManager.dragObj = target;
            if (!target.getAttribute("data-background")) {
              let background = getStyle(target, "background-color");
              target.setAttribute("data-background", background)
            }
            //显示为可移动的状态    
            target.style.backgroundColor = "#ccc";
            target.style.cursor = "move";
            dragManager.clientY = e.clientY;
            addEvent(document, "mousemove", dragManager.draging);
            addEvent(document, "mouseup", dragManager.dragEnd);
          }
        },
        
        dragEnd: function (e) {
          e.stopPropagation()
          endY = e.clientY
          if (Math.abs(startY - endY) < 10) { // 拖拽距离过小 禁止刷新
            return
          }
          let dragObj = dragManager.dragObj
          if (dragObj) {
            e = e || event;
            let target = e.target || e.srcElement;
            if (target.nodeName === "TD") {
              target = target.parentNode;
              dragObj.style.backgroundColor = dragObj.getAttribute("data-background");
              dragObj.style.cursor = "default";
              dragManager.dragObj = null;
              removeEvent(document, "mousemove", dragManager.draging);
              removeEvent(document, "mouseup", dragManager.dragEnd);
              if (typeof (callback) == 'function') {
                callback(target);
              }
              //获取当前的优先级
              let nowIndex = $(target).find('td[name="useOrder"]').html(), dragIndex = $(target).find('td[name="useOrder"]')
              indexChannel = $(target).closest('.channelList').attr('index')

              dragIndex.each(function (k, v) {
                if ($(this).html() == nowIndex) {
                  if (k == nowIndex) {
                    arr[indexChannel].splice(parseInt(k) + 1, 0, arr[indexChannel][nowIndex - 1])
                    arr[indexChannel].splice(nowIndex - 1, 1)
                  } else if (k > nowIndex) {
                    arr[indexChannel].splice(parseInt(k) + 1, 0, arr[indexChannel][nowIndex - 1])
                    arr[indexChannel].splice(nowIndex - 1, 1)
                  } else {
                    arr[indexChannel].splice(parseInt(k), 0, arr[indexChannel][nowIndex - 1])
                    arr[indexChannel].splice(nowIndex, 1)
                  }
                  return false
                }
              })
              dragIndex.each(function (k, v) {
                $(this).html(k + 1)
              })
            }
          }
        },
        main: function (el) {
          addEvent(el, "mousedown", dragManager.dragStart);
        }
      }
      dragManager.main(el)
    }
  })
})