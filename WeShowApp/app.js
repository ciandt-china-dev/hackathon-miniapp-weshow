//app.js
App({
  onLaunch: function () {
    var that = this;
    wx.getSystemInfo({
      success:function(res){
        console.log(res);
        that.globalData.window = {
          pixelRatio:res.pixelRatio,
          width:res.windowWidth,
          height:res.windowHeight,
        }
      }
    });
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    window:{
      width:375,
      height:627,
      pixelRatio:2,
    }
  }
})