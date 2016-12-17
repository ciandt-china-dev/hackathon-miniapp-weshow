// pages/canvas/canvas.js

var glass = require("../../models/glass").glass();
Page({
  data:{
    glass:glass
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function(e) {
    glass.setPage(this);
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  
  touchstart:function(e){
    glass.touchTimeStamp = e.timeStamp;
    glass.touchesLength = e.touches.length;

    if(e.touches.length==1){
      var point = e.touches[0];
      glass.isTouched(point);
    }

    glass.update();
  },
  touchmove:function(e){
    var point = e.changedTouches[0];
    if(glass.curStuff){
      if(glass.curStuff.scale){
          glass.scaleTo(point);
      }
      else if(glass.curStuff.touched){
          glass.moveTo(point);
      }
    }

    glass.update();
  },
  touchend:function(e){
    console.log("touchend");
    glass.touchesLength = e.touches.length;
    if(e.timeStamp-glass.touchTimeStamp<500){
      if(glass.curStuff) glass.tabTouched();
      else glass.changeBackGroundImage();
    }
    glass.touchEnd();
    
  },
  touchcancel:function(){
    console.log("touchcancel");
    glass.touchEnd();
  },
  toucherror:function(){
    console.log("toucherror");
    glass.touchEnd();
  }

})