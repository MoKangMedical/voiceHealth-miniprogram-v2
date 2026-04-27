const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  console.log('Cloud function: payment', event)
  
  return {
    success: true,
    message: 'payment cloud function',
    openid: OPENID
  }
}
