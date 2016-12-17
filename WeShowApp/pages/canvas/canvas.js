// pages/canvas/canvas.js
Page({
  data:{

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function(e) {
    var context = wx.createContext()
    context.drawImage(
      "../../images/glass.png",0,0
    );
    wx.drawCanvas({
      canvasId: 1,
      actions: context.getActions()
    });


    // wx.chooseImage({
    //   success: function(res) {
    //     console.log(res.tempFilePaths);
    //     context.drawImage(res.tempFilePaths[0], 0, 0)
    //     wx.drawCanvas({
    //       canvasId: 1,
    //       actions: context.getActions()
    //     })
    //   }
    // })
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})