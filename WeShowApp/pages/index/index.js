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
