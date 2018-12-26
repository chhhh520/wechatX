var app = getApp()
Page({
  data: {
    films: [],
    hasMore: true,
    showLoading: true,
    start: 0,
    bannerList: [{ type: 'film', id: '26683290', imgUrl: '/image/banner/banner_4.jpg' },
      { type: 'film', id: '25793398', imgUrl: '/image/banner/banner_4.jpg' },
      { type: 'film', id: '26630781', imgUrl: '/image/banner/banner_4.jpg' },
      { type: 'film', id: '26415200', imgUrl: '/image/banner/banner_4.jpg' },
      { type: 'film', id: '3025375', imgUrl: '/image/banner/banner_4.jpg' }]
  },
  onLoad: function () {
    var that = this
    wx.showNavigationBarLoading()
    that.fetchFilms.call(that, 'https://api.k-ww.com/index/api/photoList', that.data.start)

    wx.hideNavigationBarLoading()
    // app.getCity(function () {
    //   wx.hideNavigationBarLoading()
    //   wx.setNavigationBarTitle({
    //     title: '正在热映 - ' + '成都市'
    //   })
      
    // })
  },
  // 获取电影列表
  fetchFilms: function (url, start, count, cb, fail_cb) {
    var that = this
  //message.hide.call(that)
  if(that.data.hasMore) {
      wx.request({
        url: url,
        data: {
          city: '成都市',
          start: start,
          count: 4
        },
        method: 'GET',
        header: {
          "Content-Type": "application/json,application/json"
        },
        success: function (res) {
          console.log(res)
          if (res.data.data.length === 0) {
            that.setData({
              hasMore: false,
            })
          } else {
            that.setData({
              films: that.data.films.concat(res.data.data),
              start: that.data.start + res.data.data.length,
              showLoading: false
            })
            console.log(that.data.start);
          }
          wx.stopPullDownRefresh()
          typeof cb == 'function' && cb(res.data)
        },
        fail: function () {
          that.setData({
            showLoading: false
          })
          message.show.call(that, {
            content: '网络开小差了',
            icon: 'offline',
            duration: 3000
          })
          wx.stopPullDownRefresh()
          typeof fail_cb == 'function' && fail_cb()
        }
      })
    }
  },
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      films: [],
      hasMore: true,
      showLoading: true,
      start: 0
    })
    this.onLoad()
  },
  onReachBottom: function () {
    var that = this
    if (!that.data.showLoading) {
      that.fetchFilms.call(that, 'https://api.k-ww.com/index/api/photoList', that.data.start)
    }
  },
  viewFilmDetail: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "detail/detail?id=" + data.id
    })
  },
  viewFilmByTag: function (e) {
    var data = e.currentTarget.dataset
    var keyword = data.tag
    wx.navigateTo({
      url: '../searchResult/searchResult?url=' + encodeURIComponent(config.apiList.search.byTag) + '&keyword=' + keyword
    })
  },
  viewBannerDetail: function (e) {
    var data = e.currentTarget.dataset
    if (data.type == 'film') {
      wx.navigateTo({
        url: "../filmDetail/filmDetail?id=" + data.id
      })
    } else if (data.type == 'person') {
      wx.navigateTo({
        url: '../personDetail/personDetail?id=' + data.id
      })
    } else if (data.type == 'search') {
      // stype(searchType) 0:关键词, 1:类型标签
      var searchUrl = stype == 'keyword' ? config.search.byKeyword : config.search.byTag
      wx.navigateTo({
        url: '../searchResult/searchResult?url=' + encodeURIComponent(searchUrl) + '&keyword=' + keyword
      })
    }
  },
  viewSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  }
})