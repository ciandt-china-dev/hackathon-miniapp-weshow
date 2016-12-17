Page({
  data: {
    toView: 'red',
    category: [{
      id: '1',
      name: '眼镜'
    }, {
      id: '2',
      name: '帽子'
    }, {
      id: '3',
      name: '上衣'
    }, {
      id: '4',
      name: '裤子'
    }, {
      id: '5',
      name: '连衣裙'
    }],
    glasses: [{
      id: '0101',
      src: '../../images/glasses/glasses0101.png'
    }, {
      id: '0201',
      src: '../../images/glasses/glasses0201.png'
    }, {
      id: '0202',
      src: '../../images/glasses/glasses0202.png'
    }, {
      id: '0203',
      src: '../../images/glasses/glasses0203.png'
    }, {
      id: '0204',
      src: '../../images/glasses/glasses0204.png'
    }, {
      id: '0205',
      src: '../../images/glasses/glasses0205.png'
    }, {
      id: '0206',
      src: '../../images/glasses/glasses0206.png'
    }],
    showRightBar: ''
  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
  scrollToTop: function(e) {
    this.setAction({
      scrollTop: 0
    })
  },
  selectGoods: function(e) {
    console.log(e)
  },
  selectCategory: function(e) {
    console.log(e);
  },
  toggleRightBar: function(e) {
    var showRightBar = (this.data.showRightBar ? '' : 'show');
    this.setData({
      showRightBar: showRightBar
    });
  },
  chooseImage: function(e){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function success(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // that.setData({
        //   tempFilePath: res.tempFilePaths
        // })
      wx.uploadFile({
          url: 'https://weshow.nbhanyi.com/image/automatic/glass', //仅为示例，非真实的接口地址
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData:{
        },
        success: function(res){
          var data = res.data
          that.setData({
            tempFilePath: res.tempFilePaths
          })
        }
    })
      }
    })
  }
})

// //index.js
// //获取应用实例
// var app = getApp()
// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {}
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     console.log('onLoad')
//     var that = this
//     //调用应用实例的方法获取全局数据
//     app.getUserInfo(function(userInfo){
//       //更新数据
//       that.setData({
//         userInfo:userInfo
//       })
//     })
//   }
// })
