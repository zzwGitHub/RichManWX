//var url_base = 'http://localhost:8081/RichMan/';
var url_base = 'https://ziweb.top/RichMan/';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin :false,
    hasAuthority: false,
    nickName : '',
    avatarUrl :''

  },
  //这个方法是授权弹框的“确定”和“取消”按钮的响应方法，点击不同，则返回不同
  bindGetUserInfo:function(e){
    var _this = this;
    if (e.detail.userInfo){
      _this.showNameAndPic();
    }
    
  },
  showNameAndPic:function(){
    var _this = this;
    _this.setData({
      hasAuthority: true
    })
    wx.getUserInfo({
      success: res => {
        // console.log("resresresresres" + JSON.stringify(res));
        // console.log(JSON.parse(res.rawData).nickName);
        _this.setData({
          nickName: JSON.parse(res.rawData).nickName,
          avatarUrl: JSON.parse(res.rawData).avatarUrl
        })
      }
    })
  },
  joinGame:function(){
    var _this = this;
    //把用户信息发送到后台去（头像~网名嘛的~）
    wx.request({
      url: url_base + 'WXManage/recordWXUserInfo',
      data: {
        nickName: _this.data.nickName,
        avatarUrl: _this.data.avatarUrl
      },
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync('JSESSIONID')
      },
      success: function (res) {
        //console.log(res);
        wx.redirectTo({
          url: '/pages/player/player'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var _this = this;
    //app.js登录成功的回调函数
    app.loginCallback = function () {
      _this.setData({
        isLogin: true
      })
    }
    wx.getSetting({ //如果有权限就直接显示头像了
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.showNameAndPic();
        }
      }
    })
    //下面这段代码针对的是：打开小程序又关闭，再打开的情况，确保isLogin是true
    var seid = wx.getStorageSync('JSESSIONID');
    if (seid != null && seid != ""){
      _this.setData({
        isLogin: true
      })
    }
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