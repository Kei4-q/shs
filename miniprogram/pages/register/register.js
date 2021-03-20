// pages/register/register.js
const app = getApp();
const db = wx.cloud.database();
const userInfo = db.collection('user_info')
const _ = db.command
Page({
  data: {
    username: '',
    tel: '',
    password: '',
    psd_again: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '注册',
    })
  },
  onChangeusername: function (e) {
    let that = this
    that.setData({
      username: e.detail.value
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
      password: e.detail.value
    })
  },
  onChangepsd_again: function (e) {
    let that = this
    that.setData({
      psd_again: e.detail.value
    })
  },
  registerClick: function (e) {
    let that = this
    if (that.data.username == '') {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.tel == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.password == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.password == that.data.psd_again) {
      userInfo.where({
        tel: _.eq(that.data.tel)
      }).get().then(res => {
        if (res.data.length !== 0) {
          wx.showToast({
            title: '手机号已被注册',
            icon: 'none',
            duration: 2000
          })
        } else {
          userInfo.add({
            data: {
              username: that.data.username,
              tel: that.data.tel,
              password: that.data.password,
              qqNum:'',
              wxNum:'',
              user_image:''
            }
          }).then(res => {
            wx.showToast({
              title: '注册成功',
              icon:'success',
              duration:2000
            })
            wx.navigateTo({
              url: '/pages/login/login',
            })
          })
        }
      })
    } else {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 2000
      })
    }
  }
})