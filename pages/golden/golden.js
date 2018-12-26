// pages/golden/golden.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    randStr:'前半生走马观花睡姑娘，反正你也不相信感情，干脆后半生就住我床上，能做了做一场，不能做了就陪我喝喝酒唱唱歌',
    randImg:'/image/iqiyi.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.onRandStrShow();
  },
  onRandStrShow:function(){
    var that = this
    wx.request({
      url: 'https://api.k-ww.com/index/api/randStrShow',
      success :function(res){
        that.setData({
          randStr: res.data.data.content,
          randImg: res.data.data.randImg
        })
        that.onShow()
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    const context = wx.createCanvasContext('firstCanvas')
    context.setFontSize(20);
    context.setFillStyle('#666');
    context.drawImage('/image/iqiyi.png', 0, 0, 300, 150)
    console.log(context)
    context.textAlign = "center";
    context.fillText('我是测试信息', 150, 200);
    context.draw()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})