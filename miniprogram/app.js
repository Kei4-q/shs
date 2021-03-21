//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:'shb-9g8stztv11ae25e1',
        traceUser: true,
      })
    }
    this.globalData = {
      user_id:'',
      username:'',
      password:'',
      tel:'13534580047',
      wxNum:'',
      qqNum:'',
      user_image:''
    }
  }
})
