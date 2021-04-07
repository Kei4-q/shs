// pages/detail/detail.js
const app = getApp();
const db = wx.cloud.database();
const productInfo = db.collection('product_info')
const cart = db.collection('cart')
const order = db.collection('order')
const userinfo=db.collection('user_info')
const _ = db.command
Page({
  data: {
    orderlist: [],
    id: '',
    imglist: [],
    title: '',
    des: '',
    used: '',
    number: '',
    type: '',
    price: '',
    city: '',
    tel:'',
    show:false,
    wxNum:'',
    qqNum:''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      id: options.id
    })
    productInfo.doc(that.data.id).get().then(res => {
      that.setData({
        orderlist: res.data,
        imglist: res.data.imgurl,
        title: res.data.title,
        des: res.data.des,
        used: res.data.used,
        number: res.data.number,
        type: res.data.type,
        price: res.data.price,
        city: res.data.city,
        tel: res.data.tel
      })
    }).catch(() => {
      cart.doc(that.data.id).get().then(res => {
        that.setData({
          orderlist: res.data,
          imglist: res.data.imgurl,
          title: res.data.title,
          des: res.data.des,
          used: res.data.used,
          number: res.data.number,
          type: res.data.type,
          price: res.data.price
        })
      })
    })
  },
  addCart: function () {
    let that = this
    if (!app.globalData.tel) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      productInfo.doc(that.data.id).get().then(res => {
        cart.add({
          data: {
            des: res.data.des,
            imgurl: res.data.imglist,
            number: res.data.number,
            price: res.data.price,
            title: res.data.title,
            type: res.data.title,
            checked: false
          }
        }).then(() => {
          wx.switchTab({
            url: '/pages/cart/cart',
          })
        })
      })
    }

  },
  buyClick: function () {
    let that = this
    if (!app.globalData.tel) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      order.add({
        data: {
          done: false,
          number: '1',
          tel: app.globalData.tel,
          total: that.data.price,
          order: [that.data.orderlist]
        }
      }).then(() => {
        wx.navigateTo({
          url: '/pages/commitorder/commitorder',
        })
      })
    }
  },
  showInfo:function(){
    let that=this
    userinfo.where({
      tel:that.data.tel
    }).get().then(res=>{
      console.log(res)
     that.setData({
       show:true,
       wxNum:res.data[0].wxNum,
       qqNum:res.data[0].qqNum
     })
    })
  },
  onClickHide(){
    let that=this
    that.setData({
      show:false
    })
  }
})