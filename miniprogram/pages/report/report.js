// pages/report/report.js
Page({
  data: { reportId: '', report: null, loading: true },
  onLoad(options) {
    if (options.id) {
      this.setData({ reportId: options.id })
      this.loadReport(options.id)
    }
  },
  async loadReport(id) {
    // 加载报告逻辑
    this.setData({ loading: false })
  }
})
