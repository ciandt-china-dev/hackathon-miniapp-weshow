Page({
    data: {
        toView: 'red',
        backgroundImage: '',
        categorys: [{
            id: '1',
            optionkey: 'glass',
            name: '眼镜'
        }, {
            id: '2',
            optionkey: 'hat',
            name: '帽子'
        }, {
            id: '3',
            optionkey: 'coat',
            name: '上衣'
        }, {
            id: '4',
            optionkey: 'pants',
            name: '裤子'
        }, {
            id: '5',
            optionkey: 'dress',
            name: '连衣裙'
        }],
    },
    onLoad: function(options) {
        this.changeBackGroundImage()
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
        var category = e.currentTarget.id,
            categorys = this.data.categorys;
        //console.log(categorys);
        for (var i = 0, len = categorys.length; i < len; ++i) {
            if (categorys[i].id == category) {
                if (categorys[i].active == 'active') {
                    categorys[i].active = '';
                } else {
                    categorys[i].active = 'active';
                }
                break;
            }
        }
        this.setData({
            categorys: categorys,
        });
    },
    // toggleRightBar: function(e) {
    //   var showRightBar = (this.data.showRightBar ? '' : 'show');
    //   this.setData({
    //     showRightBar: showRightBar
    //   });
    // },
    changeBackGroundImage: function() {
        var that = this;
        wx.showModal({
            title: '微秀',
            content: that.backgroundImage ? '换一张图片？' : '请选择一张照片，一起微秀',
            success: function(res) {
                if (res.confirm)
                    wx.chooseImage({
                        count: 1, // 最多可以选择的图片张数，默认9
                        sizeType: ['compressed'],
                        sourceType: ['album', 'camera'],
                        complete: function(e) {
                            if (!e.tempFilePaths) {
                                return;
                            }
                            that.setData({
                                backgroundImage: e.tempFilePaths[0],
                            })
                        }
                    })
            }
        });
    },
    chooseImage: function(e) {
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function success(res) {
                wx.showToast({
                    title: '图片上传中',
                    icon: 'loading',
                    duration: 10000
                })

                setTimeout(function() {
                    wx.hideToast()
                }, 10000)
                wx.uploadFile({
                    url: 'https://weshow.nbhanyi.com/glass,hat', //仅为示例，非真实的接口地址
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    formData: {},
                    success: function(res) {
                        var filePath = 'https://weshow.nbhanyi.com/' + res.data
                            // that.setData({
                            //   tempFilePath: filePath
                            // })
                        console.log(filePath)
                        wx.previewImage({
                            current: filePath, // 当前显示图片的http链接
                            urls: [filePath] // 需要预览的图片http链接列表
                        })
                        wx.hideToast()
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