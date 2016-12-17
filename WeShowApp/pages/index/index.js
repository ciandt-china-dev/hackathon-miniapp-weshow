var data = {glasses: [{
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
    hats: [
    //   {
    //   id: '0101',
    //   src: '../../images/hat/hat0101.png'
    // }, {
    //   id: '0201',
    //   src: '../../images/hat/hat0201.png'
    // }, 
    {
      id: '0301',
      src: '../../images/hat/hat0301.png'
    }, {
      id: '0401',
      src: '../../images/hat/hat0401.png'
    }, {
      id: '0501',
      src: '../../images/hat/hat0501.png'
    }, {
      id: '0601',
      src: '../../images/hat/hat0601.png'
    }],
    coats:[],
    pants:[],
    dresses:[]};
Page({
  data: {
    toView: 'red',
    categorys: [{
      id: 'glasses',
      name: '眼镜',
      active:'active'
    }, {
      id: 'hats',
      name: '帽子',
      active:''
    }, {
      id: 'coats',
      name: '上衣',
      active:''
    }, {
      id: 'pants',
      name: '裤子',
      active:''
    }, {
      id: 'dresses',
      name: '连衣裙',
      active:''
    }],
    showRightBar: '',
    sidebar: data.glasses,
    selectedCategory: 'glasses'
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
    }
})
