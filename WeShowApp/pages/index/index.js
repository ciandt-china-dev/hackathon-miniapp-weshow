var glass = require("../../models/glass").glass();
var data = require("../../models/datas");
console.log(data);

Page({
  data: {
    glass:glass,
    toView: 'red',
    categorys: data.category,
    showRightBar: '',
    sidebar: data.glasses,
    selectedCategory: 'glasses'
  },
  onReady:function(){
    glass.setPage(this);
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
    var dt = e.currentTarget.dataset;
    glass.addStuff(dt.imgsrc,200,100,100,50);
  },
  selectCategory: function(e) {
    var category = e.currentTarget.id,
      categorys = this.data.categorys;

    for (var i = 0, len = categorys.length; i < len; ++i) {
      if (categorys[i].id == category) {
        if(categorys[i].active == 'active'){
          break;
        }
        categorys[i].active = 'active';
      } else {
        categorys[i].active = '';
      }
    }

    this.setData({
        sidebar: data[category],
        selectedCategory: category,
        showRightBar:'show',
        categorys:categorys
    });
  },
  toggleRightBar: function(e) {
      var showRightBar = (this.data.showRightBar ? '' : 'show');
      this.setData({
        showRightBar: showRightBar
      });
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
      if(!glass.curStuff) glass.changeBackGroundImage();
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
