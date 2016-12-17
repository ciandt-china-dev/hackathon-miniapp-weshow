var glass = require("../../models/glass").glass();
var data = require("../../models/datas");
var app = getApp();
console.log(data);

Page({
  data: {
    glass:glass,
    toView: 'red',
    categorys: data.category,
    showRightBar: '',
    sidebar: data.glasses,
    selectedCategory: data.category[0]
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
    glass.addStuff(dt.imgsrc,200,100,100,this.data.selectedCategory.height);
  },
  selectCategory: function(e) {
    var categorys = this.data.categorys;
    var category = categorys[e.currentTarget.dataset.index];

    this.setData({
        sidebar: data[category.id],
        selectedCategory: category,
        showRightBar:'show',
    });
  },
  toggleRightBar: function(e) {
      var showRightBar = (this.data.showRightBar ? '' : 'show');
      this.setData({
        showRightBar: showRightBar
      });
      glass.toggleCanvasWidth(!showRightBar);
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
    console.log("touchend",e);
    var point = e.changedTouches[0];
    if(e.timeStamp-glass.touchTimeStamp<500){
      if(!glass.curStuff){
        var dis = glass.canvasWidth-750*point.x/app.globalData.window.width;
        console.log(dis);
        if(dis<80&&
        dis>=0){
          this.toggleRightBar();
        }else{
          glass.changeBackGroundImage();
        }
      } 
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
