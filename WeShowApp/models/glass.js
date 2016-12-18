var app = getApp();

module.exports = {
    glass:function(){
        return {
            canvasId:1,
            canvasWidth:750,
            canvasHeight:app.globalData.window.height,
            backgroundImage:"",
            lastUpdate:0,
            page:null,
            touchMoved:false,

            stuffs:[
            // {
            //     curX:150,
            //     curY:75,
            //     centerX:200,
            //     centerY:100,
            //     width:100,
            //     height:50,
            //     touched:false,
            //     scale:false,
            //     imgsrc:'',
            //     degree:0,
            // }

            ],
            stuffIdSeed:0,
            curStuff:false,
            setPage:function(page){
                this.page = page;
                
                this.changeBackGroundImage();
                this.update();
            },
            toggleCanvasWidth:function(full){
                this.canvasWidth = full?750:510;
                this.update();
            },
            saveFile:function(){
                console.log("saveFile");
                var that = this;
                that.toggleCanvasWidth(true);
                
                wx.canvasToTempFilePath({
                    canvasId: that.canvasId,
                    success: function(res){
                        console.log(res);
                        var filePath = res.tempFilePath;
                        wx.previewImage({
                            current: filePath, // 当前显示图片的http链接
                            urls: [filePath] // 需要预览的图片http链接列表
                        })
                    },
                    fail: function() {
                        wx.showToast("保存图片失败");
                    }
                })
            
            },
            tryDelCurStuff:function(point){
                var that = this;
                var stuff = that.curStuff;
                console.log(point);
                console.log(this.curStuff);
                console.log(this.inCircle(point,{x:this.curStuff.curX,y:this.curStuff.curY}));
                if(this.curStuff&&this.inCircle(point,{x:this.curStuff.curX,y:this.curStuff.curY})){
                    wx.showActionSheet({
                        itemList: ['删除当前装扮'],
                        success: function(res) {
                            if (!res.cancel) {
                                var index = that.stuffs.indexOf(stuff);  
                                if (index > -1) {  
                                    that.stuffs.splice(index, 1);  
                                }
                                that.curStuff = false;
                                that.update();
                            }
                        }
                    });
                    return true;
                }
                return false;
            },
            changeBackGroundImage:function(){
                var that = this;
                var action = that.backgroundImage?[]:[];
                if(!that.backgoundImage){
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
                                        that.backgroundImage = e.tempFilePaths[0];
                                        wx.getImageInfo({
                                            src: that.backgroundImage,
                                            success: function (res) {
                                                that.bgWidth=res.width;
                                                that.bgHeight=res.height;
                                            }
                                        });
                                        setTimeout(function(){
                                            that.update();
                                        },1000)
                                    }
                                })
                        }
                    });
                }else{
                    wx.showActionSheet({
                        itemList: ['换一张图片？','保存图片'],
                        success: function(res) {
                            if(!res.cancel){
                                if(res.tapIndex==0){
                                    wx.chooseImage({
                                        count: 1, // 最多可以选择的图片张数，默认9
                                        sizeType: ['original', 'compressed'],
                                        sourceType: ['album', 'camera'],
                                        complete: function(e) {
                                            if(!e.tempFilePaths){
                                                return;
                                            }
                                            that.backgroundImage = e.tempFilePaths[0];
                                            wx.getImageInfo({
                                                src: that.backgroundImage,
                                                success: function (res) {
                                                    that.bgWidth=res.width;
                                                    that.bgHeight=res.height;
                                                }
                                            });
                                            setTimeout(function(){
                                                that.update();
                                            },1000)
                                        }
                                    })
                                }else if(res.tapIndex==1){
                                    that.saveFile();
                                }
                            }
                        }
                    });
                }
                
            },
            addStuff:function(imgsrc,centerX,centerY,width,height){
                var that = this;
                that.curStuff = {
                    stuffId:that.stuffIdSeed++,
                    imgsrc:imgsrc,
                    centerX:centerX + Math.random()*30-15,
                    centerY:centerY + Math.random()*30-15,
                    width:width,
                    height:height+10,
                    curX:centerX-width/2,
                    curY:centerY-height/2,
                };
                this.stuffs.push(that.curStuff);
                this.update();
            },
            inRect:function(point,stuff){
                var x = point.x,y=point.y;
                if(x>stuff.curX&&x<stuff.curX+stuff.width
                    &&y>stuff.curY&&y<stuff.curY+stuff.height){
                        return true;
                }
            },
            inCircle:function(point,point2){
                console.log(Math.pow(point.x-point2.x,2)+
                Math.pow(point.y-point2.y,2));
                return Math.pow(point.x-point2.x,2)+
                Math.pow(point.y-point2.y,2)<=400;
            },
            isTouched:function(point){
                for(var i=0;i<this.stuffs.length;i++){
                    var stuff = this.stuffs[i];
                    stuff.touched = this.inRect(point,stuff);
                    stuff.scale = this.inCircle(point,{x:stuff.curX+stuff.width,y:stuff.curY+stuff.height});
                    if(stuff.touched||stuff.scale) {
                        this.curStuff=stuff;
                        if(stuff.touched) this.curStuff.touchedPoint = point;
                        if(stuff.scale) this.curStuff.scalePoint = point;
                        console.log(stuff);
                        break;
                    }
                }
            },
            moveTo:function(point){
                if(!this.curStuff)return false;
                //console.log('move to',point);
                this.curStuff.centerX = point.x;
                this.curStuff.centerY = point.y;
                this.curStuff.curX = this.curStuff.centerX-this.curStuff.width/2;
                this.curStuff.curY = this.curStuff.centerY-this.curStuff.height/2;
            },
            scaleTo:function(point){
                if(!this.curStuff)return false;
                //console.log('scale to',point);
                this.curStuff.width = Math.abs(point.x-this.curStuff.curX);
                this.curStuff.height = Math.abs(point.y-this.curStuff.curY);
                this.curStuff.centerX = this.curStuff.curX+this.curStuff.width/2;
                this.curStuff.centerY = this.curStuff.curY+this.curStuff.height/2;


            },
            reloadCanvas:function(){
                var that = this;
                var context = wx.createContext();
                
                context.translate(0,0);
                var imgWidth = that.canvasWidth/750*app.globalData.window.width;
                context.drawImage(
                    that.backgroundImage,
                    0,
                    0,
                    imgWidth,
                    imgWidth*that.bgHeight/that.bgWidth
                );

                for(var i=0;i<that.stuffs.length;i++){
                    var stuff = that.stuffs[i];

                    console.log(stuff);


                    
                    context.beginPath()
                    context.translate(
                        stuff.centerX,
                        stuff.centerY);
                    if(that.curStuff==stuff)context.rotate(stuff.degree);
                    context.translate(
                        -stuff.width/2,
                        -stuff.height/2);

                    context.setFillStyle(that.curStuff==stuff?"#ff0000":"#ffffff");
                    context.setStrokeStyle("#000000");
                    if(that.curStuff==stuff)context.arc(0,0,10,0,2*Math.PI);
                    if(that.curStuff==stuff)context.fill();
                    if(that.curStuff==stuff)context.stroke();

                    context.translate(
                        stuff.width,
                        stuff.height);

                    if(that.curStuff==stuff)context.arc(0,0,10,0,2*Math.PI);
                    if(that.curStuff==stuff)context.fill();
                    if(that.curStuff==stuff)context.stroke();

                    context.translate(
                        -stuff.width,
                        -stuff.height);

                    if(that.curStuff==stuff)context.rect(
                        0,0,
                        stuff.width,
                        stuff.height
                        );
                    if(that.curStuff==stuff)context.stroke();
                    context.closePath();


                    context.beginPath();

                    context.drawImage(
                        stuff.imgsrc,
                        0,0,
                        stuff.width,
                        stuff.height
                    );
                    context.stroke();

                    context.translate(
                        -stuff.curX,
                        -stuff.curY);
                    context.closePath();
                }

                

                wx.drawCanvas({
                    canvasId: that.canvasId,
                    actions: context.getActions()
                });
            },
            update:function(){
                var lastUpdate=new Date().getTime();
                if(lastUpdate-this.lastUpdate<30)return true;
                this.lastUpdate = lastUpdate;
                this.page.setData({
                    glass:this
                });
                this.reloadCanvas();
            },
            touchEnd:function(){
                if(this.curStuff){
                    this.curStuff.touched = false;
                    this.curStuff.scale = false;
                    this.curStuff.touchedPoint = false;
                    this.curStuff.scalePoint = false;
                    this.curStuff = false;
                    this.touchMoved = false;
                }
            }

        };
    }
    
}
