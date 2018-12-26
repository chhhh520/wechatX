var app = getApp(),
  //common = require("../../utils/common.js"),
  util = require("../../utils/util.js");

Page({
  data: {
    themeColor: "#e64340",
    remind: "加载中",
    angle: 0,
    canIUse: wx.canIUse("open-data"),
    url: "",
    type: "",
    id: 0
  },
  onLoad: function (t) {
    
  },
  onShow: function () { },
  onReady: function () {
    var a = this;
    setTimeout(function () {
      a.setData({
        remind: ""
      });
    }, 1e3), wx.onAccelerometerChange(function (t) {
      var e = -(30 * t.x).toFixed(1);
      14 < e ? e = 14 : e < -14 && (e = -14), a.data.angle !== e && a.setData({
        angle: e
      });
    });
  },
  onShareAppMessage: function () {
    return {
      title: "咸鱼——领地登陆",
      path: "/pages/login/login",
      success: function (t) {
        alert(1)
      },
      fail: function (t) { }
    };
  },
  bindGetUserInfo: function (e) {
    
    if (e.detail.userInfo) {
      var that = this;
      var openid = wx.getStorageSync('openid');
      //获取到用户数据  保存 用户数据到服务器
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.checkSessionAndLogin();
    } else {
      //用户拒绝弹窗
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            //点击了返回授权
          }
        }
      })
    }
  },
  checkSessionAndLogin: function () {
    let that = this;
    let thisOpenId = wx.getStorageSync('openid');

    // 已经进行了登录，检查登录是否过期
    if (thisOpenId) {
      console.log('have openid')
      that.sendUserInfoToServer();
    } else {
      // 没有进行登录则先进行登录操作
      console.log('do not have openid');
      that.loginAndGetOpenid();
    }
  },
  // 执行登录操作并获取用户openId
  loginAndGetOpenid: function () {
    console.log('do login and get openid');
    let that = this;
    getApp().bindGetUserInfo();
    that.sendUserInfoToServer();
  },
  sendUserInfoToServer: function () {

    console.log('now send user info to server');
    let userInfo = wx.getStorageSync('userInfo');
    let thisOpenId = wx.getStorageSync('openid');

    userInfo.openid = thisOpenId;

    wx.request({
      url: getApp().globalData.urlPath + 'index/api/insert_user',
      method: 'POST',
      dataType: 'json',
      data: userInfo,
      success: function (res) {
        res = res.data;
        if (res.code === 200) {
          wx.setStorageSync('uid', res.data)
          wx.navigateBack({

          });
        } else {
          wx.showModal({
            title: '警告',
            content: '同步信息出错',
            showCancel: false,
            confirmText: '返回授权',
          })
        }
      }
    })
  }
});