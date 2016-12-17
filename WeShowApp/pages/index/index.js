// var order = ['green', 'red', 'yellow', 'blue', 'green']
Page({
  data: {
    toView: 'red',
    category:[{
      id:'1',
      name:'眼镜'
    },{
      id:'1',
      name:'帽子'
    },{
      id:'1',
      name:'上衣'
    },{
      id:'1',
      name:'裤子'
    },{
      id:'1',
      name:'连衣裙'
    }],
    glasses: [{
      id: 'red',
      name: '红色',
      src: '../../images/glasses/glass01.png'
    }, {
      id: 'black',
      name: '黑色',
      src: '../../images/glasses/glass04.png'
    },{
      id: 'red',
      name: '红色',
      src: '../../images/glasses/glass01.png'
    }, {
      id: 'black',
      name: '黑色',
      src: '../../images/glasses/glass04.png'
    },{
      id: 'red',
      name: '红色',
      src: '../../images/glasses/glass01.png'
    }, {
      id: 'black',
      name: '黑色',
      src: '../../images/glasses/glass04.png'
    },{
      id: 'red',
      name: '红色',
      src: '../../images/glasses/glass01.png'
    }, {
      id: 'black',
      name: '黑色',
      src: '../../images/glasses/glass04.png'
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
  selectCategory: function(e){
    console.log(e);
  },
  toggleRightBar: function(e){
    var showRightBar = this.data.showRightBar ? '':'show';
    this.setData({
      showRightBar: showRightBar
    });
  }
  // tap: function(e) {
  //   for (var i = 0; i < order.length; ++i) {
  //     if (order[i] === this.data.toView) {
  //       this.setData({
  //         toView: order[i + 1],
  //         scrollTop: (i + 1) * 200
  //       })
  //       break
  //     }
  //   }
  // },
  // tapMove: function(e) {
  //   this.setData({
  //     scrollTop: this.data.scrollTop + 10
  //   })
  // }
})
