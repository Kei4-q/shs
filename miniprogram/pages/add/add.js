// pages/add/add.js
const app=getApp()
const db=wx.cloud.database()
const product=db.collection('product_info')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    type:'书籍',
    typelist:['书籍','自行车','电脑'],
    title:'',
    des:'',
    used:'',
    number:'',
    price:'',
    tel:'',
    city:'',
    imgurl1:'../../images/upload.png',
    imgurl2:'../../images/upload.png',
    imgurl3:'../../images/upload.png',
    upimgurl:[],
    change:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    let arr=Object.keys(options)
    if(arr.length!==0){
    const imgurl=options.imgurl.split(',')
    console.log(imgurl)
    that.setData({
      id:options.id,
      title:options.title,
      des:options.des,
      used:options.used,
      number:options.number,
      price:options.price,
      imgurl1:imgurl[0],
      imgurl2:imgurl[1],
      imgurl3:imgurl[2],
      tel:options.tel,
      city:options.city,
      change:true
    })
    }
    // if(arr.length!==0){
     
    // }
  },
  titleChange(e) {
    let that=this 
    that.setData({
      title:e.detail
    })
  },
  desChange(e) {
    let that=this
    that.setData({
     des:e.detail
    })
  },
  usedChange(e) {
    let that=this
    that.setData({
      used:e.detail
    })
  },
  numChange(e) {
    let that=this
    that.setData({
     number:e.detail
    })
  },
  priceChange(e) {
    let that=this
    that.setData({
     price:e.detail
    })
  },
  typeChange(e) {
    let that=this
    let type=e.detail.value
    that.setData({
      type:type
    })
  },
  cityChange(e) {
    let that=this
    that.setData({
     city:e.detail
    })
  },
  upimg1:function(){
    let that=this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
    }).then(res=>{
      wx.cloud.uploadFile({
        cloudPath:`${Math.floor(Math.random()*10000000)}.png`,
        filePath:res.tempFilePaths[0]
      }).then(res=>{
        console.log(res.fileID)
        that.setData({
          imgurl1:res.fileID
        })
      })
    })
  },
  upimg2:function(){
    let that=this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
    }).then(res=>{
      wx.cloud.uploadFile({
        cloudPath:`${Math.floor(Math.random()*10000000)}.png`,
        filePath:res.tempFilePaths[0]
      }).then(res=>{
        console.log(res.fileID)
        that.setData({
          imgurl2:res.fileID
        })
      })
    })
  },
  upimg3:function(){
    let that=this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
    }).then(res=>{
      wx.cloud.uploadFile({
        cloudPath:`${Math.floor(Math.random()*10000000)}.png`,
        filePath:res.tempFilePaths[0]
      }).then(res=>{
        console.log(res.fileID)
        that.setData({
          imgurl3:res.fileID
        })
      })
    })
  },
  addClick:function(){
    let that=this
    if(that.data.title==''){
      wx.showToast({
        title: '商品名称不能为空',
        duration:2000
      })
    }else if(that.data.des==''){
      wx.showToast({
        title: '商品描述不能为空',
        duration:2000
      })
    }else if(that.data.used==''){
      wx.showToast({
        title: '已用年限不能为空',
        duration:2000
      })
    }else if(that.data.number==''){
      wx.showToast({
        title: '商品名称不能为空',
        duration:2000
      })
    }else if(that.data.price==''){
      wx.showToast({
        title: '价格不能为空',
        duration:2000
      })
    }else{
      if(that.data.imgurl1!=='../../images/upload.png'){
        that.data.upimgurl.push(that.data.imgurl1);
      }
      if(that.data.imgur2!=='../../images/upload.png'){
        that.data.upimgurl.push(that.data.imgurl2);
      } 
      if(that.data.imgurl3!=='../../images/upload.png'){
        that.data.upimgurl.push(that.data.imgurl3);
      }
    product.add({
      data:{
        tel:app.globalData.tel,
        title:that.data.title,
        type:that.data.type,
        des:that.data.des,
        used:that.data.used,
        number:that.data.number,
        price:that.data.price,
        city:that.data.city,
        imgurl:that.data.upimgurl,
        disabled:false
      }
    }).then(()=>{
      wx.showToast({
        title: '发布成功',
        icon:'success',
        duration:2000
      })
      wx.redirectTo({
        url: '/pages/product/product?type='+that.data.type,
      })
    })}
  },
  changeClick:function(){
    let that=this
    product.doc(that.data.id).update({
      data:{
      tel:that.data.tel,
      title:that.data.title,
      des:that.data.des,
      used:that.data.used,
      number:that.data.number,
      price:that.data.price,
      city:that.data.city,
    }
    }).then(()=>{
      wx.showToast({
        title: '修改成功',
        icon:'success',
        duration:2000
      })
      wx.switchTab({
        url: '/pages/mine/mine',
      })
    })
  }
})