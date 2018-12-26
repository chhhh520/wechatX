function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function shareEvent(option, obj) {
  let shareObj = {
    title: obj.title,
    path: obj.path,
    imgUrl: obj.imgUrl,
    success(res) {
      // 转发成功之后的回调
      if (res.errMsg == 'shareAppMessage:ok') { }
    },
    fail(res) {
      // 转发失败之后的回调
      if (res.errMsg == 'shareAppMessage:fail cancel') {
        // 用户取消转发
      } else if (res.errMsg == 'shareAppMessage:fail') {
        // 转发失败，其中 detail message 为详细失败信息
      　　　　}
    },
    complete() {
      // 转发结束之后的回调（转发成不成功都会执行）
    }
  };
  if (option.from === 'button') {
    // 来自页面内转发按钮
    console.log(option.target)
  }
  return shareObj;
}

function formatTime(e) {
  var t = e.getFullYear(), r = e.getMonth() + 1, n = e.getDate(), o = e.getHours(), a = e.getMinutes(), S = e.getSeconds();
  return [t, r, n].map(formatNumber).join("/") + " " + [o, a, S].map(formatNumber).join(":");
}

function formatNumber(e) {
  return (e = e.toString())[1] ? e : "0" + e;
}

function isEmpty(e) {
  return "" == e || null == e || null == e;
}

function setStorageSync(e, t, r) {
  wx.setStorageSync(e, t), r = isEmpty(r) ? 1800 : r;
  var n = Date.parse(new Date());
  wx.setStorageSync(e + "_expire", n + 1e3 * r);
}

function getStorageSync(e) {
  var t = parseInt(wx.getStorageSync(e + "_expire"));
  return Date.parse(new Date()) < t && wx.getStorageSync(e);
}

function removeStorageSync(e) {
  wx.removeStorageSync(e), wx.removeStorageSync(e + "_expire");
}

function clearStorageSync() {
  wx.clearStorageSync();
}
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function getDate() {
  var time = new Date()
  var year = time.getFullYear()
  var month = time.getMonth()
  month = month < 10 ? '0' + month : month
  var day = time.getDay()
  day = day < 10 ? '0' + day : day
  return [year, month, day].join('-')
}

function getTime() {
  var time = new Date()
  var hours = time.getHours()
  hours = hours < 10 ? '0' + hours : hours
  var minute = time.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = time.getSeconds()
  second = second < 10 ? '0' + second : second
  return [hours, minute, second].join(':')
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  removeStorageSync: removeStorageSync,
  clearStorageSync: clearStorageSync,
  formatTime: formatTime,
  shareEvent: shareEvent,
  getDate: getDate,
  getTime: getTime
};
