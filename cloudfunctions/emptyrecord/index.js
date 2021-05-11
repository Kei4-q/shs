// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init( {env:'shb-9g8stztv11ae25e1'})
const db=cloud.database()
const records=db.collection('his_records')
// 云函数入口函数
exports.main = async () => {
 return await records.where({
   tel:db.command.eq(app.globalData.tel),
   record:true
 }).remove()
}