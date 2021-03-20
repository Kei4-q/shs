// pages/login/login.js
const app = getApp();
const db = wx.cloud.database();
const userInfo = db.collection('user_info')
const _ = db.command
Page({
  data: {
    id: '',
    tel: '',
    psd: '',
  },
  onLoad: function (options) {
    let that = this
    wx.setNavigationBarTitle({
        title: '登录',
      }) 
  },
  onChangetel: function (e) {
    let that = this
    that.setData({
      tel: e.detail.value
    })
  },
  onChangepsd: function (e) {
    let that = this
    that.setData({
      psd: e.detail.value
    })
  },
  loginapp: function () {
    let that=this
   userInfo.where({
     tel:_.eq(that.data.tel),
     password:_.eq(that.data.psd)
   }).get({
     success:function(res){
       console.log(res.data[0])
       if(res.data.length==0){
        wx.showToast({
          title: '用户名或密码不正确',
          icon:'none',
          duration:2000
        })
       }
       else{
        app.globalData.user_id=res.data[0]._id
        app.globalData.username=res.data[0].username
        app.globalData.tel=res.data[0].tel
        app.globalData.password=res.data[0].password
        app.globalData.user_image=res.data[0].user_image
        app.globalData.wxNum=res.data[0].wxNum
        app.globalData.qqNum=res.data[0].qqNum
       wx.showToast({
         title: '登录成功',
         icon:'success',
         duration:2000
       }),
       wx.switchTab({
         url: '/pages/mine/mine',
       })
      }
      },
   })

  }
})