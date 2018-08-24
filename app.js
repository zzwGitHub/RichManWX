//var url_base = 'http://localhost:8081/RichMan/';
var url_base = 'https://ziweb.top/RichMan/';
App({
  onLaunch: function (options) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            url: url_base + 'WXManage/wxCheckLogin',    
            data: {
              code: res.code
            },
            success: function (res) {
              wx.setStorageSync('JSESSIONID', res.data.JSESSIONID)
              wx.setStorageSync('openid', res.data.openid)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    setInterval(this.refresh, 20 * 60 * 1000) //每20分种向后台请求，以保证session不过期
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  // globalData: {
  //   userInfo: null
  // }
  onShow: function (options) {
    console.log(options)
    //将分享票据存入本地（如果不是群，则没有这玩意）
    wx.setStorageSync('shareTicket', options.shareTicket)
  },
  refresh:function(){ 
    wx.request({
      url: url_base + 'test/connect',
      data: {
      },
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID') },
      success: function (res) {
      }
    })
  }
})