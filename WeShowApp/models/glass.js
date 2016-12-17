var app = getApp();

module.exports = {
    glass:function(){
        return {
            canvasId:1,
            canvasWidth:app.globalData.window.width,
            canvasHeight:app.globalData.window.height,
            backgroundImage:"",
            lastUpdate:0,
            page:null,

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
            curStuff:false,
            setPage:function(page){
                this.page = page;
                
                this.changeBackGroundImage();
                this.update();
            },
            changeBackGroundImage:function(){
                var that = this;
                wx.showModal({
                    title: '微秀',
                    content: that.backgroundImage?'换一张图片？':'请选择一张照片，一起微秀',
                    success: function(res) {
                        if(res.confirm)
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
                            }
                            })
                        }
                    });
            },
            addStuff:function(imgsrc,centerX,centerY,width,height){
                this.stuffs.push({
                    imgsrc:imgsrc,
                    centerX:centerX,
                    centerY:centerY,
                    width:width,
                    height:height,
                    curX:centerX-width/2,
                    curY:centerY-height/2,
                });
                this.update();
            },
            inRect:function(point,stuff){
                var x = point.x,y=point.y;
                if(x>stuff.curX&&x<stuff.curX+stuff.width
                    &&y>stuff.curY&&y<stuff.curY+stuff.height){
                        return true;
                }
            },
            inCircle:function(point,stuff){
                return Math.pow(point.x-stuff.curX-stuff.width,2)+Math.pow(point.y-stuff.curY-stuff.height,2)<=400;
            },
            isTouched:function(point){
                for(var i=0;i<this.stuffs.length;i++){
                    var stuff = this.stuffs[i];
                    stuff.touched = this.inRect(point,stuff);
                    stuff.scale = this.inCircle(point,stuff);
                    if(stuff.touched||stuff.scale) {
                        this.curStuff=stuff;
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
                var context = wx.createContext()
                
                context.translate(0,0);
                context.drawImage(
                    this.backgroundImage,
                    0,
                    0,
                    this.canvasWidth,
                    this.canvasWidth*this.bgHeight/this.bgWidth,
                );

                for(var i=0;i<this.stuffs.length;i++){
                    var stuff = this.stuffs[i];

                    console.log(stuff);
                    context.beginPath()
                    context.translate(
                        stuff.centerX,
                        stuff.centerY);
                    context.rotate(stuff.degree);
                    context.translate(
                        -stuff.width/2,
                        -stuff.height/2);


                    context.arc(0,0,10,0,2*Math.PI);
                    context.setFillStyle("#ff0000");
                    context.setStrokeStyle("#ff0000");
                    context.fill();
                    context.stroke();

                    context.translate(
                        stuff.width,
                        stuff.height);

                    context.arc(0,0,10,0,2*Math.PI);
                    context.setFillStyle("#ff0000");
                    context.setStrokeStyle("#ff0000");
                    context.fill();
                    context.stroke();
                    context.closePath();


                    context.beginPath();
                    context.setStrokeStyle("#ff0000");
                    context.translate(
                        -stuff.width,
                        -stuff.height);
                    context.rect(
                        0,0,
                        stuff.width,
                        stuff.height
                        );

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
                    canvasId: this.canvasId,
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
                    this.curStuff = false;
                }
            }

        };
    }
    
}
