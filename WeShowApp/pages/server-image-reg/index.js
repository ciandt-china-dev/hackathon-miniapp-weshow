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
