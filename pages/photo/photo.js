var page = 0;
var page_size = 8;
var GetList = function (that) {
  that.setData({
    hidden: false
  });
  wx.showNavigationBarLoading();
  wx.request({
    url: getApp().globalData.urlPath + 'index/api/photoList',
    data: {
      page: page,
      page_size: page_size
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      var whdthNum = res.data.data;
      if (whdthNum.code == 0) {
        that.setData({
          ShdthNum: whdthNum
        });
      }
      if (res.data.code != 0) {
        whdthNum.forEach(function (item) {
          item.imgs = item.content.split('src');
        });
        var listData = wx.getStorageSync('infoList') || []
        // -------------
        for (var i = 0; i < res.data.data.length; i++) {
          listData.push(res.data.data[i]);
        }
        wx.setStorageSync('infoList', listData)
        setTimeout(function () {
          that.setData({
            infoList: listData
          });
        }, 800)
        page++;
        // -------------
        setTimeout(function () {
          that.setData({
            hidden: true
          });
        }, 2000)
      } else {
        that.setData({
          hidden: true,
          display: false
        });
      }

    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  })
}
// -------------------------------
Page({
  data: {
    picUrl: "http://api.k-ww.com",
    infoList: [],
    hidden: true,
    display: true,
    ShdthNum: 1
  },
  onLoad: function () {
    try {
      wx.removeStorageSync('infoList')
    } catch (e) {
    }
  },
  onShow: function () {
    var that = this;
    var ShdthNum = that.data.ShdthNum;
    if (ShdthNum == 1) {
      GetList(that);
    } else {
      setTimeout(function () {
        try {
          var value = wx.getStorageSync('infoList')
          if (value) {
            that.setData({
              infoList: value,
            })
          }
        } catch (e) {
          console.log('error');
        }
      }, 1000)
    }
  },

  onPullDownRefresh: function () {
    page = 0;
    this.setData({
      display: true,
      infoList: []
    })
    wx.removeStorageSync('infoList')
    GetList(this)
  },

  onReachBottom: function () {
    var that = this;
    setTimeout(function () {
      GetList(that)
    }, 500)
  },

  onShareAppMessage: function () {
    var that = this;
    var picUrl = that.data.picUrl;
    return {
      title: '爱靓女，看美女，每日都有更新喔~',
      path: '/pages/photo/photo'
    }
  }
})
