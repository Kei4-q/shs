// pages/search/search.js
const app = getApp();
const db = wx.cloud.database();
const productInfo = db.collection('product_info')
const record = db.collection('his_records')
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    product: [],
    search: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this
    record.where({
      tel:_.eq(app.globalData.tel)
    }).get().then(res => 
        that.setData({
          records:res.data,
        })
      )},
  del: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'emptyrecord'
    }).then(()=> {
      that.onLoad()
    })
  },
  recordClick: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    // console.log(that.data.records[index])
    that.setData({
      search: that.data.records[index].content
    })
    that.searchClick()
  },
  changeSearch: function (e) {
    let that = this;
    let inputSearch = e.detail.value;
    that.setData({
      search: inputSearch
    })
  },
  searchClick: function () {
    let that = this;
    let notrepeatnum = 0
    let e = that.data.search;
    if (e != '') {
      productInfo.where(_.or([{
          title: db.RegExp({
            regexp: e,
            options: 'i'
          })
        },
        {
          des: db.RegExp({
            regexp: e,
            options: 'i'
          })
        }
      ])).get().then(res => {
        that.setData({
          product: res.data
        })
        if (that.data.records.length==0) {
          record.add({
            data: {
              tel:app.globalData.tel,
              record:true,
              content: that.data.search
            }
          }).then(() => {
            that.onLoad();
          })
        }
        for (let key in that.data.records) {
          if (that.data.records[key].content !== that.data.search) {
            notrepeatnum =  notrepeatnum + 1
          }
          if (notrepeatnum == that.data.records.length) {
            record.add({
              data: {
                record:true,
                tel:app.globalData.tel,
                content: that.data.search
              }
            }).then(() => {
              that.onLoad();
            })
          }
        }
      })
    }
  }
})