// pages/cart/cart.js
const app = getApp()
const db = wx.cloud.database()
const cart = db.collection('cart')
const address = db.collection('address')
const order=db.collection('order')
const _ = db.command
Page({
  data: {
    id:'',
    cartlist: [],
    order:[],
    total: '0',
    number: '',
    tel:'',
    mainActiveIndex: 0,
    activeId: null,
    address:'',
    show:false,
    fousc:false,
    items: [{
      text: "选择地址",
      children: [{
        text: '',
        id: ''
      }]
    }]
  },
  onLoad: function (options) {
    console.log(options)
    let that = this
    let total = 0
    let arr=Object.keys(options)
    if(arr.length!==0){
      order.doc(options.id).get().then(res=>{
        console.log(res.data)
        that.setData({
          cartlist: res.data.order,
          number: res.data.order.length,
          tel:app.globalData.tel,
          id:res.data._id
        })
        for (let key in that.data.cartlist) {
          total += parseFloat(that.data.cartlist[key].price * that.data.cartlist[key].number)
          that.setData({
            total: total
          })
        }
      })
    }
    else{
   order.get().then(res => {
     that.setData({
       order:res.data
     })
     for(let key in res.data){
       that.setData({
        cartlist: res.data[key].order,
        number: res.data[key].order.length,
        tel:app.globalData.tel
      })
     }
      for (let key in that.data.cartlist) {
        total += parseFloat(that.data.cartlist[key].price * that.data.cartlist[key].number)
        that.setData({
          total: total
        })
      }
    })}
    address.where({
      tel: _.eq(app.globalData.tel)
    }).get().then(res => {
      for (let key in res.data) {
        let text = 'items[0].children[' + key + '].text'
        let id = 'items[0].children[' + key + '].id'
        that.setData({
          [text]: res.data[key].address,
          [id]: res.data[key]._id
        })
      }
    })
  },
  searchClick: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  onClickItem({
    detail = {}
  }) {
    let that=this
    const activeId = this.data.activeId === detail.id ? null : detail.id;
    this.setData({
      activeId
    });
    that.setData({
      address:detail.text
    })
  },
  payClick:function(){
    let that=this
    that.setData({
      show:true
    })
  },
  onClickHide() {
    let that=this
    let arr=Object.keys(that.data.order)
    if(arr.length!==0){
      order.doc(that.data.order[0]._id).update({
        data:{
          done:true
        }
      }).then(()=>{
        wx.switchTab({
          url: '/pages/order/order',
        })
      })
    }else{
      order.doc(that.data.id).update({
        data:{
          done:true
        }
      }).then(()=>{
        wx.switchTab({
          url: '/pages/order/order',
        })
      })
    }
    this.setData({ 
      show: false 
    });
  },
  onHide(){
    this.setData({
      show:false
    })
  },
  onChange(e) {
    this.setData({
      tel:e.detail.value,
      fousc:false
    })
  },
  changetel(){
    this.setData({
      fousc:true
    })
  }
})
