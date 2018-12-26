//var douban = require('../../comm/script/fetch')
//var config = require('../../comm/script/config')
Page({
	data: {
		films: [],
		hasMore: true,
		showLoading: true,
    start: 0,
    count: 8,
    url: '',
		keyword: '',
		isNull: false,
		nullTip: {
			tipText: 'sorry，没有找到您要的内容，换个关键词试试吧',
			actionText: '返回',
			routeUrl: '../../pages/search/search'
		}
	},
	onLoad: function(options) {
		var that = this
    console.log(options)
		that.setData({
      url: 'https://api.k-ww.com/index/api/photoList?q=',
			keyword: options.keyword,
			title: options.keyword
		})
    that.search.call(that, that.data.url, that.data.keyword, that.data.start, that.data.count, function(data){
			if (data.data.length == 0) {
				that.setData({
					isNull: true
				})
			}
		})
	},
  // 搜索（关键词或者类型）
  search:function(url, keyword, start, count, cb){
    var that = this
  //message.hide.call(that)
  var url = decodeURIComponent(url)
  if(that.data.hasMore) {
      wx.request({
        url: url + keyword,
        data: {
          start: start,
          count: count
        },
        method: 'GET',
        header: {
          "Content-Type": "application/json,application/json"
        },
        success: function (res) {
          if (res.data.data.length === 0) {
            that.setData({
              hasMore: false,
              showLoading: false
            })
          } else {
            that.setData({
              films: that.data.films.concat(res.data.data),
              start: that.data.start + res.data.data.length,
              showLoading: false
            })
            wx.setNavigationBarTitle({
              title: keyword
            })
          }
          wx.stopPullDownRefresh()
          typeof cb == 'function' && cb(res.data)
        },
        fail: function () {
          that.setData({
            showLoading: false
          })
          // message.show.call(that, {
          //   content: '网络开小差了',
          //   icon: 'offline',
          //   duration: 3000
          // })
        }
      })
    }
  },
	onPullDownRefresh: function() {
		var that = this
		that.setData({
			films: [],
			hasMore: true,
			showLoading: true,
			start: 0
		})
    that.search.call(that, that.data.url, that.data.keyword, that.data.start, that.data.count)
	},
	onReachBottom: function() {
		var that = this
		if (!that.data.showLoading) {
      that.search.call(that, that.data.url, that.data.keyword, that.data.start, that.data.count)
		}
	},
	viewFilmDetail: function(e) {
		var data = e.currentTarget.dataset;
		wx.redirectTo({
			url: "../filmDetail/filmDetail?id=" + data.id
		})
	},
	viewFilmByTag: function(e) {
		var data = e.currentTarget.dataset
		var keyword = data.tag
		wx.redirectTo({
			url: '../searchResult/searchResult?url=' + encodeURIComponent(config.apiList.search.byTag) + '&keyword=' + keyword
		})
	}
})