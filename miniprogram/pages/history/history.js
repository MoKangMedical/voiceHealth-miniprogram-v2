Page({
  data: { records: [], loading: true },
  onLoad() { this.loadRecords() },
  async loadRecords() { this.setData({ loading: false }) }
})
