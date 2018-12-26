//var config = require('../../comm/script/config')
var app = getApp();
Page({
  data:{
    gridList: [
      {enName:'favorite', zhName:'收藏'},
      {enName:'history', zhName:'浏览记录'},
      {enName:'shake', zhName:'摇一摇'},
      {enName:'gallery', zhName:'相册'},
      {enName:'setting', zhName:'设置'}
    ],
    skin: ''
  },
  onLoad:function(cb){
    console.log(cb)
    
  },
  onShow:function(){
    var that = this
    // 检测是否存在用户信息
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      })
      return;
    }
    typeof cb == 'function' && cb()
    wx.getStorage({
      key: 'skin',
      success: function(res){
        if (res.data == "") {
          that.setData({
            skin: '/image/user/user_bg_10.jpg'
          })
        } else {
          that.setData({
            skin: res.data
          })
        }
      }
    })
  },
  onPullDownRefresh: function() {
    this.onLoad(function(){
      wx.stopPullDownRefresh()
    })
  },
  viewGridDetail: function(e) {
    var data = e.currentTarget.dataset
		wx.navigateTo({
			url: "../my/" + data.url + '/' + data.url
		})
  },
  viewSkin: function() {
		wx.navigateTo({
			url: "../skin/skin"
		})
  }
})