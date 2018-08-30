//var url_base = 'http://localhost:8081/RichMan/';
var url_base = 'https://ziweb.top/RichMan/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    players : [
      { name: 'ziw', money: 1256, openid: 'sioevmwow23fgsw', pic:''},
      { name: 'niao', money: 6986, openid: 'ivmeo934j835i', pic: '' }
      ],
    myMoney : '2.89',
    switchBtn : '去银行页面',
    BankPower: false,
    isPlayerPage:true,
    settingMoney:'',
    settingHuman:''
  },
  switchPAB:function() { //切换玩家视图和银行视图
    if (this.data.isPlayerPage){
      this.setData({
        switchBtn: '去玩家页面',
        isPlayerPage: false
      })
    }else{
      this.setData({
        switchBtn: '去银行页面',
        isPlayerPage: true
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({  //开启分享按钮
      withShareTicket: true

    })
    
  },
  
  getShareInfo: function () {
    var appShareTicket = wx.getStorageSync('shareTicket');

    // var seid = wx.getStorageSync('JSESSIONID');
    // console.log('JSESSIONID' + seid);

    //console.log('getShareInfo=====getShareInfo======' + appShareTicket);
    if (appShareTicket != ''){ //单聊的话，则不触发
      var _this = this;
      wx.getShareInfo({
        shareTicket: appShareTicket,
        success: function (res) {
          //console.log("res==res==" + JSON.stringify(res))
          //去后台解密
          wx.request({
            url: url_base + 'WXManage/recordWXGroupInfo',
            data: {
              encryptedData: res.encryptedData,
              iv: res.iv
            },
            header: {
              "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')
            },
            success: function (res) {
              _this.setData({
                BankPower: res.data.isBank
              })
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
    // console.log(openid)
    wx.connectSocket({
      //url: 'ws://127.0.0.1:8081/RichMan/websocket/' + openid
      url: 'wss://ziweb.top/RichMan/websocket/' + openid
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      _this.getShareInfo();
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
      var resObj = JSON.parse(res.data);
      if ("showAllPlayers" == resObj.fun) {

        _this.socketShowAllPalyers(resObj.data);

      } else if("showMyMoney" == resObj.fun) {
        
        _this.socketShowMyMoney(resObj.data);
      }

      
    })
  },
  WXSendSocketMsg: function (msg) { //websocket长连接发送消息
    console.log(msg);
    wx.sendSocketMessage({
      data: msg
    })
  },
  socketShowAllPalyers:function(data){
    this.setData({
      players: JSON.parse(data)
    })
  },
  socketShowMyMoney: function (data) {
    this.setData({
      myMoney: data
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
    this.bindWebSocket();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.closeSocket({})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket({})
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
      path: '/pages/accredit/accredit',
      success: function (res) {
        // console.log(res)
        res.shareTickets // 单聊是没有的
      }
    }
  },
  ////////////////////////////////bank页面相关方法/////////////////////////////////////////

  bankhuman:function(e){ //与银行人输入框双向绑定
    this.setData({
      settingHuman: e.detail.value
    })
  },
  bankMoney: function (e) {//与银行钱输入框双向绑定
    this.setData({
      settingMoney: e.detail.value
    })
  },
  
  appointMoney:function(){  //指定某人的金额
    wx.request({
      url: url_base + 'WXManage/bankSetMoney',
      data: {
        money: this.data.settingMoney,
        human: this.data.settingHuman
      },
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')
      },
      success: function (res) {
      }
    })
  }
  
})