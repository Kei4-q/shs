// pages/mine/mine.js
const app = getApp()
const db = wx.cloud.database()
const address = db.collection('address')
const userInfo=db.collection('user_info')
const product=db.collection('product_info')
const _=db.command

Page({
  data: {
    change: true,
    username: '',
    tel: '',
    imgurl:'',
    wxNum: '',
    qqNum: '',
    address: '',
    show:false,
    _address:'',
    activeNames: [],
    personpro:[],
    login:false
  },

  onShow: function () {
    let that = this
    if(app.globalData.tel){
      that.setData({
        login:true
      })
    }
      that.setData({
        username: app.globalData.username,
        tel: app.globalData.tel,
        wxNum: app.globalData.wxNum,
        qqNum: app.globalData.qqNum,
        imgurl: app.globalData.user_image
      }),
      address.where({
        tel:_.eq(app.globalData.tel)
      }).get().then(res => {
        that.setData({
          address: res.data
        })
      })
      product.where({
          tel:_.eq(app.globalData.tel)
      }).get().then(res=>{
        that.setData({
          personpro:res.data
        })
      })
      if(!app.globalData.user_image){
        that.setData({
          imgurl:'../../images/upload.png'
        })
      }
  },
  upImg:function(){
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
          imgurl:res.fileID
        })
        userInfo.doc(app.globalData.user_id).update({
          data:{
            user_image:res.fileID
          }
        }).then(()=>{
          that.onShow()
        })
      })
    })
  },
  changemsg: function () {
    let that = this
    that.setData({
      change: !that.data.change,
    })
    userInfo.doc(app.globalData.user_id).update({
      data:{
      tel:that.data.tel,
      wxNum:that.data.wxNum,
      qqNum:that.data.qqNum
    }
    }).then(()=>{
    app.globalData.tel=that.data.tel
    app.globalData.wxNum=that.data.wxNum
    app.globalData.qqNum=that.data.qqNum

    })
  },
  addaddress:function(){
   let that=this
   that.setData({
     show:true
   })
  },
  addChange:function(e){
    let that=this
    that.setData({
      _address:e.detail.value
    })
  },
  deladdress: function (e) {
    let that = this
    let id = e.target.dataset.id
    address.doc(id).remove().then(() => {
      that.onShow()
    })
  },
  onClose:function() {
    this.setData({ 
      show: false 
    });
  },
  onComfirm:function(){
    let that=this
    that.setData({
      show:false
    })
    address.add({
      data:{
        tel:that.data.tel,
        address:that.data._address
      }
    }).then(()=>{
      that.onShow()
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  delproduct: function (e) {
    let that = this
    let id = e.target.dataset.id
    product.doc(id).remove().then(() => {
      that.onShow()
    })
  },
  changeproduct:function(e){
    let that=this
    console.log(e)
    let index=e.target.dataset.index
    let personpro=that.data.personpro
    wx.navigateTo({
      url: '/pages/add/add?tel='+personpro[index].tel+'&title='+personpro[index].title+'&type='+personpro[index].type+'&des='+personpro[index].des+'&used='+personpro[index].used+'&number='+personpro[index].number+'&price='+personpro[index].price+'&imgurl='+personpro[index].imgurl+'&tel='+personpro[index].tel+'&id='+personpro[index]._id+'&city='+personpro[index].city
    })
  },
  loginClick:function(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  quit:function(){
    let that=this
    app.globalData.user_id='',
    app.globalData.username='',
    app.globalData.password='',
    app.globalData.tel='',
    app.globalData.wxNum='',
    app.globalData.qqNum='',
    app.globalData.user_image=''
    that.setData({
      login:false
    })
    that.onShow();
  }
})