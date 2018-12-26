//var message = require('../../component/message/message')
//var douban  = require('../../comm/script/fetch')
//var config  = require('../../comm/script/config')
Page({
  data:{
    searchType: 'keyword',
    hotKeyword: ['功夫熊猫', '烈日灼心', '摆渡人', '长城', '我不是潘金莲', '这个杀手不太冷', '驴得水', '海贼王之黄金城', '西游伏妖片', '我在故宫修文物', '你的名字'],
    hotTag: ['动作', '喜剧', '爱情', '悬疑'],
  },
  changeSearchType: function() {
    var types = ['默认', '类型'];
    var searchType = ['keyword', 'tag']
    var that = this
    wx.showActionSheet({
      itemList: types,
      success: function(res) {
        console.log(res)
        if (!res.cancel) {
          that.setData({
            searchType: searchType[res.tapIndex]
          })
        }
      }
    })
  },
  search: function(e) {
    var that = this
    var keyword = e.detail.value.keyword
    if (keyword == '') {
      message.show.call(that,{
        content: '请输入内容',
        icon: 'null',
        duration: 1500
      })
      return false
    } else {
      var searchUrl = that.data.searchType == 'keyword' ? that.data.byKeyword : that.data.search.byTag
      wx.redirectTo({
        url: '../searchResult/searchResult?url=' + encodeURIComponent(searchUrl) + '&keyword=' + keyword
      })
    }
  },
  searchByKeyword: function(e) {
    var that = this
    var keyword = e.currentTarget.dataset.keyword
    wx.redirectTo({
      url: '../searchResult/searchResult?url=' + encodeURIComponent(that.data.byKeyword) + '&keyword=' + keyword
    })
  },
  searchByTag: function(e) {
    var that = this
    var keyword = e.currentTarget.dataset.keyword
    wx.redirectTo({
      url: '../searchResult/searchResult?url=' + encodeURIComponent(that.data.byTag) + '&keyword=' + keyword
    })
  }
})