Page({
    data: {
        toView: 'red',
        backgroundImage: '',
        categorys: [{
            id: 'glass',
            name: '眼镜',
            active: 'active'
        }, {
            id: 'hat',
            name: '帽子',
            active: 'active'
        }, {
            id: 'coat',
            name: '上衣'
        }, {
            id: 'pants',
            name: '裤子'
        }, {
            id: 'dress',
            name: '连衣裙'
        }],
    },
    onLoad: function(options) {
        this.changeBackGroundImage()
    },
    selectGoods: function(e) {
        console.log(e)
    },
    selectCategory: function(e) {
        var category = e.currentTarget.id
        var thatCategorys = this.data.categorys
        //console.log(categorys);
        for (var i = 0, len = thatCategorys.length; i < len; ++i) {
            if (thatCategorys[i].id == category) {
                if (thatCategorys[i].active == 'active') {
                    thatCategorys[i].active = '';
                } else {
                    thatCategorys[i].active = 'active';
                }
                break;
            }
        }
        this.setData({
            categorys: thatCategorys,
        });
    },
    changeBackGroundImage: function(e) {
        var that = this;
        wx.showModal({
            title: '微秀',
            content: that.data.backgroundImage ? '换一张图片？' : '请选择一张照片，一起微秀',
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
    uploadImage: function(e) {
        var that = this
        var options = ''
        var categorys = this.data.categorys;
        for (var i = 0, len = categorys.length; i < len; ++i) {
            if (categorys[i].active == 'active') {
                options += categorys[i].id + ',';
            }
        }

        if(options == '' || that.data.backgroundImage == ''){
            wx.showModal({
                title: '提示',
                content: '请选择你的照片和装饰'
            })
            return;
        }

        wx.showToast({
            title: '图片上传中',
            icon: 'loading',
            duration: 10000
        })

        setTimeout(function() {
            wx.hideToast()
        }, 10000)
        wx.uploadFile({
            url: 'https://weshow.nbhanyi.com/' + options, //仅为示例，非真实的接口地址
            filePath: that.data.backgroundImage,
            name: 'file',
            formData: {},
            success: function(res) {
                var filePath = 'https://weshow.nbhanyi.com/' + res.data
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