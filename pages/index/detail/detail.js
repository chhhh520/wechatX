var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    picUrl: "http://api.k-ww.com/",
    userInfo: [],
    pid: '',
    openid: '',
    vid: 0,
    names: '标题加载中...',
    olist: 0,
    wlist: 0,
    disabled_1: false,
    disabled_2: false,
    gzList: []
  },

  getGuanzhu: function (ev) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    if (ev == 1) {
      wx.request({
        url: getApp().globalData.urlPath + 'index/api/getGuanzhu/',
        data: {
          cid: 1,
          openid: wx.getStorageSync('openid'),
          vid: that.data.vid,
          avatar: userInfo.avatarUrl,
          uname: userInfo.nickName
        },
        method: 'GET',
        success: function (res) {
        }
      })
    } else if (ev == 2) {
      wx.request({
        url: getApp().globalData.urlPath + 'index/api/getGuanzhu/',
        data: {
          cid: 2,
          vid: that.data.vid
        },
        method: 'GET',
        success: function (res) {
          that.setData({
            gzList: res.data
          })
        }
      })
    }

  },

  onLoad: function (params) {
    console.log(params)
    this.setData({
      pid: params.id
    })
  },
  onShow: function () {
    let openid = wx.getStorageSync('openid')
    let userInfo = wx.getStorageSync('userInfo')
    console.log(openid)
    console.log(userInfo)
    if (!openid || !userInfo) {
      wx.navigateTo({
        url: "/pages/login/login"
      })
      return;
    } else {
      setTimeout(function () {
        that.getGuanzhu(1);
      }, 5000)
      setTimeout(function () {
        that.getGuanzhu(2);
      }, 7000)
    }
    var that = this;
    wx.showNavigationBarLoading();
    console.log(this.data.pid)
    if (!this.data.pid) {
      wx.showToast({
        title: '没有数据啦',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.request({
        url: getApp().globalData.urlPath + 'index/api/photoDetail/id/' + this.data.pid,
        data: {},
        method: 'GET',
        success: function (res) {
          var homeid = res.data.code;
          if (homeid == 0) {
            wx.redirectTo({
              url: 'detail?id=' + res.data.data
            })
          } else {
            var article = res.data.data.content;
            WxParse.wxParse('article', 'html', article, that, 5);
            // success
            that.setData({
              gzList: res.data.data.gzlist,
              vid: res.data.data.id,
              names: res.data.data.name,
              olist: res.data.data.olist,
              wlist: res.data.data.wlist
            })
            setTimeout(function () {
              if (that.data.wlist == that.data.vid) {
                that.setData({
                  disabled_1: false,
                  disabled_2: true
                })
              } else if (that.data.olist == that.data.vid) {
                that.setData({
                  disabled_1: true,
                  disabled_2: false
                })
              } else {
                that.setData({
                  disabled_1: false,
                  disabled_2: false
                })
              }
            }, 2000)
            wx.showLoading({
              title: '图片加载中'
            })
          }
        },
        complete: function () {
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
          wx.hideNavigationBarLoading()
        }
      })
    }
  },

  topIc: function (e) {
    var that = this;
    var topid = e.currentTarget.dataset.id - 1;
    wx.redirectTo({
      url: 'detail?id=' + topid
    })

  },

  nextIc: function (e) {
    var that = this;
    var nextid = parseInt(e.currentTarget.dataset.id) + 1;
    wx.redirectTo({
      url: 'detail?id=' + nextid
    })
  },

  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '爱靓女，看美女，每日都有更新喔~',
      path: '/pages/photo/detail/detail?id=' + that.data.vid
    }
  }

})