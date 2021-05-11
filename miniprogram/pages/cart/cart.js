// pages/cart/cart.js
const app = getApp()
const db = wx.cloud.database()
const cart = db.collection('cart')
const order = db.collection('order')
const _=db.command
Page({
  data: {
    cartlist: [],
    empty: false,
    total: '0',
    checked: false,
  },
  onShow: function () {
    let that = this
    cart.where({
      tel:_.eq(app.globalData.tel),
    }).get().then(res => {
      if (!res.data.length) {
        that.setData({
          empty: true,
        })
      } else {
        that.setData({
          cartlist: res.data,
          checked: false,
          total: '0'
        })
      }
    })
  },
  searchClick: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  onChange: function (e) {
    let that = this
    let flag = 0
    let index = e.target.dataset.index
    let temp = "cartlist[" + index + "].checked"
    this.setData({
      [temp]: e.detail
    });
    for (let key in that.data.cartlist) {
      if (that.data.cartlist[key].checked) {
        flag = flag + 1;
      }
    }
    if (that.data.cartlist.length == flag) {
      that.setData({
        checked: true
      })
    } else {
      that.setData({
        checked: false
      })
    }
    that.totalfun()
  },
  all: function (e) {
    let that = this
    that.setData({
      checked: e.detail,
    })
    for (let i = 0; i < that.data.cartlist.length; i++) {
      let temp = "cartlist[" + i + "].checked"
      that.setData({
        [temp]: that.data.checked
      })
    }
    that.totalfun()
  },
  delcart: function (e) {
    console.log(e)
    let that = this
    let id = e.target.dataset.id
    cart.doc(id).remove().then(() => {
      that.totalfun()
      that.onShow()
    })
  },
  totalfun: function () {
    let that = this
    let total = 0
    for (let key in that.data.cartlist) {
      if (that.data.cartlist[key].checked) {
        total += parseFloat(that.data.cartlist[key].price * that.data.cartlist[key].number)
      }
      that.setData({
        total: total
      })
    }
  },
  commit: function () {
    let that = this
    let orderlist = []
    let leng=0
    for (let key in that.data.cartlist) {
      if (that.data.cartlist[key].checked) {
        orderlist.push(that.data.cartlist[key])
        leng +=1
      }
    }
      order.add({
        data: {
          done:false,
          number:leng,
          tel:app.globalData.tel,
          total:that.data.total,
          order: orderlist
        }
      }).then(() => {
        
        wx.navigateTo({
          url: '/pages/commitorder/commitorder',
        })
      })
    
  }
})