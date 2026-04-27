Page({
  data: { userInfo: null, isVip: false, stats: {} },
  onLoad() {
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo,
      isVip: app.globalData.isVip
    })
  }
})
