//var url_base = 'http://localhost:8081/RichMan/';
var url_base = 'https://ziweb.top/RichMan/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    players : [
      // { name: 'ziw', money: 1256, openid: 'sioevmwow23fgsw', pic: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erY3ibuXWnG1jNM8VvfquXvbLgtWa2GkXVhMogtYAfKSAPMnJtAyiboYrB3Xosm5libEng9XxuLoIryw/132', style:'player-select'},
      // { name: 'niao', money: 6986, openid: 'ivmeo934j835i', pic: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqzibboHr3bsE74pfRcfql6ibfGcoVzp0HyQrWIZQlQqDGbPZdicEQmoSre0qShonO4ZHErlYH5GL08Q/132', style:'player-select-not' }
      ],
    myMoney : '0',
    switchBtn : '去银行页面',
    BankPower: false,
    isPlayerPage:true,
    settingMoney:'', //银行给所有人指定钱的输入框的对应的值
    settingOneMoney: '',//银行给某人指定钱的输入框的对应的值
    ptpMoney: ''//某人给某人汇钱的输入框的对应的值
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
  selectPlayer:function(e){
    var openid = e.currentTarget.dataset.openid;
    //console.log(openid);
    var changePlayers = this.data.players;
    for (var i = 0; i < changePlayers.length; i++) {
      if (changePlayers[i].openid == openid){
        changePlayers[i].style = "player-select"
      }else{
        changePlayers[i].style = "player-select-not"
      }
    }
    
    this.setData({
      players: changePlayers
    })
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
  ptpMoney: function (e) {//与ptp输入框双向绑定
    this.setData({
      ptpMoney: e.detail.value
    })
  },

  givePlayerMoney: function () {  //指定向某人汇钱

    var playList = this.data.players;
    var selectOpenid = "";
    for (var i = 0; i < playList.length; i++) {
      if (playList[i].style == "player-select") {
        selectOpenid = playList[i].openid
      }
    }
    wx.request({
      url: url_base + 'WXManage/playerSetMoney',
      data: {
        money: this.data.ptpMoney,
        human: selectOpenid
      },
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')
      },
      success: function (res) {
      }
    })
  },



  ////////////////////////////////bank页面相关方法/////////////////////////////////////////

  
  bankMoney: function (e) {//与银行钱输入框双向绑定
    this.setData({
      settingMoney: e.detail.value
    })
  },
  
  appointMoney:function(){  //指定某人的金额
    wx.request({
      url: url_base + 'WXManage/bankSetMoney',
      data: {
        money: this.data.settingMoney
      },
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')
      },
      success: function (res) {
      }
    })
  },
  

  playerMoney: function (e) {//与银行钱输入框双向绑定
    this.setData({
      settingOneMoney: e.detail.value
    })
  },

  appointOneMoney: function () {  //指定某人的金额

    var playList = this.data.players;
    var selectOpenid = "";
    for (var i = 0; i < playList.length; i++) {
      if (playList[i].style == "player-select") {
        selectOpenid = playList[i].openid
      } 
    }
    wx.request({
      url: url_base + 'WXManage/bankSetMoney',
      data: {
        money: this.data.settingOneMoney,
        human: selectOpenid
      },
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')
      },
      success: function (res) {
      }
    })
  }
})