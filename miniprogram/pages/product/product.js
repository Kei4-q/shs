// pages/product/product.js
const app = getApp();
const db = wx.cloud.database();
const productInfo = db.collection('product_info')
const cart = db.collection('cart')
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    product: [],
    number:'',
    t: {
      type: '',
      empty: false,
    },
    disbaled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    let type = e.type
    let t = "t.type"
    that.setData({
      [t]: type
    })
    productInfo.where({
      type: type
    }).get().then(res => {
      if(res.data.length==0)
      {
        that.setData({
          empty:true
        })
      }else{
        that.setData({
          product: res.data,
          tel:app.globalData.tel
        })
      }
      }
    )},
    searchClick:function(){
      if(app.globalData.tel==''){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }else{
        wx.navigateTo({
          url: '/pages/search/search'
        })
      }
    },
  toadd: function () {
    if(app.globalData.tel==''){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
    wx.navigateTo({
      url: '/pages/add/add',
    })}
  },
  addCart: function (e) {
    let that = this
    let id = e.target.dataset.id
    if(app.globalData.tel==''){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      productInfo.doc(id).get().then(res => {
        that.setData({
          number:res.data.number
        })
        cart.where({
          title:_.eq(res.data.title),
          tel:_.eq(app.globalData.tel)
        }).get().then(res=>{
          let id=res.data[0]._id
          if(res.data.length!==0){
            let number=parseInt(res.data[0].number)+1
            console.log(number)
            cart.doc(id).update({
              data:{
                number:number
              }
            })
          }
        }).catch(()=>{
          cart.add({
            data: {
              tel:app.globalData.tel,
              des: res.data.des,
              imgurl: res.data.imgurl,
              number: '1',
              price: res.data.price,
              title: res.data.title,
              type: res.data.title,
              used:res.data.used,
              checked:false,
            }
          }).then(() => {
              let number=parseInt(that.data.number-1)
              if(number!==0){
                that.setData({
                  number:number
                })
              }else{
                that.setData({
                  disbaled:true
                })
              }
              that.onLoad(that.data.t)
          })
        
        })
    })
  }
  },
  delproduct: function (e) {
    let that = this
    let id = e.target.dataset.id
    productInfo.doc(id).remove().then(() => {
      that.onLoad(that.data.t)
    })
    cart.doc(id).remove()
  },
})