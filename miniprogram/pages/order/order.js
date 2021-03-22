// pages/order/order.js
const app = getApp()
const db = wx.cloud.database()
const order = db.collection('order')
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    donelist: [],
    notdonelist: [],
    empty:false
  }, 
  onShow: function () {
    let that = this
    order.where({
      tel:_.eq(app.globalData.tel),
      done: false
    }).get().then(res => {
      that.setData({
        notdonelist: res.data,
      })
    })
    order.where({
      tel:_.eq(app.globalData.tel),
      done: true
    }).get().then(res => {
      that.setData({
        donelist: res.data
      })
    })
    if(that.data.notdonelist.length==0 && that.data.donelist.length==0){
      that.setData({
        empty:true
      })
    }
  },
  delorder: function (e) {
    let that = this
    let id = e.target.dataset.id
    order.doc(id).remove().then(() => {
      that.onShow()
    })
  },
  orderdetail: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/commitorder/commitorder?id='+id,
    })
  }
})