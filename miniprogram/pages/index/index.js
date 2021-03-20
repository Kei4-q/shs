const app=getApp()
Page({
  data:{
    type:''
  },
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
  bookClick:function(){
    let that=this
    that.setData({
      type:'书籍'
    })
    wx.navigateTo({
      url: '/pages/product/product?type='+that.data.type,
    })
  },
  bikeClick:function(){
    let that=this
    that.setData({
      type:'自行车'
    })
    wx.navigateTo({
      url: '/pages/product/product?type='+that.data.type,
    })
  },
  computerClick:function(){
    let that=this
    that.setData({
      type:'电脑'
    })
    wx.navigateTo({
      url: '/pages/product/product?type='+that.data.type,
    })
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
  }
})