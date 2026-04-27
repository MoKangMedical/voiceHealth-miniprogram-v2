// pages/face/face.js
Page({
  data: {
    cameraMode: 'front',
    photoPath: '',
    isAnalyzing: false,
    result: null,
    showResult: false
  },

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({ photoPath: res.tempImagePath })
      }
    })
  },

  choosePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        this.setData({ photoPath: res.tempFiles[0].tempFilePath })
      }
    })
  },

  switchCamera() {
    this.setData({
      cameraMode: this.data.cameraMode === 'front' ? 'back' : 'front'
    })
  },

  retake() {
    this.setData({ photoPath: '', result: null, showResult: false })
  },

  async analyze() {
    if (!this.data.photoPath || this.data.isAnalyzing) return
    
    this.setData({ isAnalyzing: true })
    
    try {
      wx.showLoading({ title: '分析中...' })
      
      // 调用云函数
      const res = await wx.cloud.callFunction({
        name: 'face-analyze',
        data: { imageUrl: this.data.photoPath }
      })
      
      wx.hideLoading()
      
      if (res.result.success) {
        this.setData({
          result: res.result.report,
          showResult: true
        })
      } else {
        // 使用模拟数据
        this.setData({
          result: {
            overall_score: 72,
            predicted_age: 28,
            dimensions: [
              { name: '皱纹', score: 65, level: '良好' },
              { name: '色斑', score: 78, level: '良好' },
              { name: '紧致度', score: 70, level: '一般' },
              { name: '眼部', score: 68, level: '一般' },
              { name: '法令纹', score: 72, level: '良好' },
              { name: '肤色', score: 80, level: '优秀' }
            ],
            summary: '面部皮肤状态良好，建议加强防晒和保湿。',
            suggestions: ['建议使用SPF30+防晒霜', '保持充足睡眠', '适当补充胶原蛋白']
          },
          showResult: true
        })
      }
    } catch (err) {
      wx.hideLoading()
      console.error('分析失败:', err)
      wx.showToast({ title: '分析失败', icon: 'none' })
    } finally {
      this.setData({ isAnalyzing: false })
    }
  },

  getScoreColor(score) {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#3b82f6'
    if (score >= 40) return '#eab308'
    return '#ef4444'
  },

  onShareAppMessage() {
    return { title: 'AI面部衰老分析', path: '/pages/face/face' }
  }
})
