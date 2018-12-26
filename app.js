var config = require('/data/config.js');
App({
  /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
  onLaunch: function () {
    var that = this;
    that.bindGetUserInfo();
    that.initStorage();
    console.log(wx.getStorageSync('openid'))
  },
  bindGetUserInfo: function () {
    var that = this;
    wx.login({
      success: res => {
        console.log(res.code)
        wx.request({
          url: 'https://api.k-ww.com/index/api/GetOpenid',//that.globalData.wx_url_1 + res.code + that.globalData.wx_url_2,
         data: { code:res.code},
          success: res => {
            console.log(res);
            wx.setStorageSync('openid', res.data.data.openid);
            // wx.getUserInfo({
            //   //getUserInfo流程
            //   success: function (res2) {
            //     wx.setStorageSync('userInfo', res2.userInfo);
            //     //that.globalData.userInfo = res2.userInfo
            //     // typeof cb == "function" && cb(that.globalData.userInfo)
            //     // var username = res2.userInfo.nickName
            //     // var img = res2.userInfo.avatarUrl
            //     // //请求自己的服务器
            //     // console.log(username)
            //     // console.log(img)
            //     // //Login(code, username, img);
            //     return res2.userInfo;
            //   }
            // })
          }
        })
      }
    });
  },
  getUserInfo: function (cb) {
    console.log('getUserInfo 函数开始执行');
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log('用户数据获取成功');
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              that.doLogin(res.userInfo.nickName, res.userInfo.avatarUrl);
            }
          })
        }
      })
    }
  },
  doLogin: function (nickName, avatarUrl){
    let openid = wx.getStorageSync('openid');

    wx.request({
      url: getApp().globalData.urlPath + 'index/api/insert_user',
      method: 'POST',
      dataType: 'json',
      data: { nickName, avatarUrl, openid},
      success: function (res) {
        res = res.data;
        if (res.code === 200) {
          wx.setStorageSync('uid', res.data)
          wx.navigateBack({});
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
  },
  getCity: function (cb) {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var locationParam = res.latitude + ',' + res.longitude + '1'
        wx.request({
          url: config.apiList.baiduMap,
          data: {
            ak: config.baiduAK,
            location: locationParam,
            output: 'json',
            pois: '1'
          },
          method: 'GET',
          success: function (res) {
            config.city = res.data.result.addressComponent.city.slice(0, -1)
            typeof cb == "function" && cb(res.data.result.addressComponent.city.slice(0, -1))
          },
          fail: function (res) {
            // 重新定位
            that.getCity();
          }
        })
      }
    })
  },
  initStorage: function () {
    wx.getStorageInfo({
      success: function (res) {
        // 判断电影收藏是否存在，没有则创建
        if (!('film_favorite' in res.keys)) {
          wx.setStorage({
            key: 'film_favorite',
            data: []
          })
        }
        // 判断人物收藏是否存在，没有则创建
        if (!('person_favorite' in res.keys)) {
          wx.setStorage({
            key: 'person_favorite',
            data: []
          })
        }
        // 判断电影浏览记录是否存在，没有则创建
        if (!('film_history' in res.keys)) {
          wx.setStorage({
            key: 'film_history',
            data: []
          })
        }
        // 判断人物浏览记录是否存在，没有则创建
        if (!('person_history' in res.keys)) {
          wx.setStorage({
            key: 'person_history',
            data: []
          })
        }
        // 个人信息默认数据
        var personInfo = {
          name: '',
          nickName: '',
          gender: '',
          age: '',
          birthday: '',
          constellation: '',
          company: '',
          school: '',
          tel: '',
          email: '',
          intro: ''
        }
        // 判断个人信息是否存在，没有则创建
        if (!('person_info' in res.keys)) {
          wx.setStorage({
            key: 'person_info',
            data: personInfo
          })
        }
        // 判断相册数据是否存在，没有则创建
        if (!('gallery' in res.keys)) {
          wx.setStorage({
            key: 'gallery',
            data: []
          })
        }
        // 判断背景卡选择数据是否存在，没有则创建
        if (!('skin' in res.keys)) {
          wx.setStorage({
            key: 'skin',
            data: ''
          })
        }
      }
    })
  },
    globalData:{
        g_isPlayingMusic:false,
        g_currentMusicPostId:null,
        urlPath: "https://api.k-ww.com/",
      userInfo:null,
      openid:null,
      wx_url_1: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxb4bbfb5bd568cf29&secret=3d30ccf7075157fa570bee5bb65dc3fe&js_code=',
      wx_url_2: '&grant_type=authorization_code'
    }
})