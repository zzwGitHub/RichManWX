//var url_base = 'http://localhost:8081/RichMan/';
var url_base = 'https://ziweb.top/RichMan/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg : '111',
    players : [
      { name: 'ziw', money: 1256, openid: 'sioevmwow23fgsw' },
      { name: 'niao', money: 6986, openid: 'ivmeo934j835i' }
      ]
  },
  getMsg: function () {
    //var seid = wx.getStorageSync('JSESSIONID');
    var _this = this;
    wx.request({
      url: url_base + 'test/testSession',
      data: {

      },
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')},
      success: function (res) {
        
        _this.setData({
          msg: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindWebSocket();
    wx.showShareMenu({  //开启分享按钮
      withShareTicket: true

    })
    this.getShareInfo();

    
  },
  getShareInfo: function () {
    var appShareTicket = wx.getStorageSync('shareTicket');
    if (appShareTicket != ''){ //单聊的话，则不触发
      var _this = this;
      wx.getShareInfo({
        shareTicket: appShareTicket,
        success: function (res) {
          console.log("res====" + JSON.stringify(res))
          //去后台解密
          wx.request({
            url: url_base + 'WXManage/wxDecryption',
            data: {
              encryptedData: res.encryptedData,
              iv: res.iv
            },
            header: {
              'content-type': 'application/json', // 默认值
              "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')
            },
            success: function (res) {
              _this.setData({
                msg: JSON.stringify(res.data.openGId) 
              })

              // _this.bindWebSocket();
            }
          })
        },
        fail: function (res) {
          _this.setData({
            text: JSON.stringify(res)
          })
        }
      })
    }
  },
  bindWebSocket :function(){//开启 websocket长连接的若干方法
    var _this = this;
    var openid = wx.getStorageSync('openid');
    console.log(openid)
    wx.connectSocket({
      // url: 'ws://127.0.0.1:8081/RichMan/websocket/' + openid
      url: 'wss://ziweb.top/RichMan/websocket/' + openid
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      _this.setData({
        msg: JSON.stringify(res)
      })
    })
  },
  WXSendSocketMsg: function (msg) { //websocket长连接发送消息
    console.log(msg);
    wx.sendSocketMessage({
      data: msg
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  onShareAppMessage: function (res) {
    
    // this.onShowMsg = JSON.stringify(res);

    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '自定义发标题',
      path: '/pages/player/player',
      success: function (res) {
        // console.log(res)
        res.shareTickets // 单聊是没有的
      }
    }
  }
})