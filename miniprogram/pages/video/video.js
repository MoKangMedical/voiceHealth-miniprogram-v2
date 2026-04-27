// pages/video/video.js
Page({
  data: {
    cameraMode: 'front',
    isRecording: false,
    recordingTime: 0,
    timer: null,
    maxDuration: 15,
    videoPath: '',
    isAnalyzing: false,
    analyzeProgress: 0,
    result: null,
    showResult: false,
    detectItems: [
      { id: 'skin', name: '皮肤状态', icon: '🧴', enabled: true },
      { id: 'eye', name: '眼睛状态', icon: '👁️', enabled: true },
      { id: 'hair', name: '头发状态', icon: '💇', enabled: true }
    ]
  },

  switchCamera() {
    this.setData({ cameraMode: this.data.cameraMode === 'front' ? 'back' : 'front' })
  },

  startRecording() {
    const ctx = wx.createCameraContext()
    ctx.startRecord({
      success: () => {
        this.setData({ isRecording: true, recordingTime: 0 })
        this.startTimer()
        setTimeout(() => { if (this.data.isRecording) this.stopRecording() }, this.data.maxDuration * 1000)
      }
    })
  },

  stopRecording() {
    const ctx = wx.createCameraContext()
    ctx.stopRecord({
      success: (res) => {
        this.stopTimer()
        this.setData({ isRecording: false, videoPath: res.tempVideoPath })
      }
    })
  },

  startTimer() {
    const timer = setInterval(() => {
      this.setData({ recordingTime: this.data.recordingTime + 1 })
    }, 1000)
    this.setData({ timer })
  },

  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  retake() {
    this.setData({ videoPath: '', result: null, showResult: false })
  },

  toggleItem(e) {
    const id = e.currentTarget.dataset.id
    const items = this.data.detectItems.map(i => 
      i.id === id ? { ...i, enabled: !i.enabled } : i
    )
    this.setData({ detectItems: items })
  },

  async startAnalysis() {
    if (!this.data.videoPath || this.data.isAnalyzing) return
    
    this.setData({ isAnalyzing: true, analyzeProgress: 0 })
    
    try {
      // 模拟分析进度
      for (let i = 0; i <= 90; i += 10) {
        await new Promise(r => setTimeout(r, 300))
        this.setData({ analyzeProgress: i })
      }
      
      // 模拟分析结果
      this.setData({
        result: {
          overall_score: 72,
          biological_age: 28,
          skin: {
            overall_score: 68,
            summary: '肤色均匀，轻微痘痘',
            acne_level: 'mild',
            wrinkle_level: 'none',
            suggestions: ['注意防晒', '保持清洁']
          },
          eye: {
            overall_score: 75,
            summary: '轻微黑眼圈',
            dark_circle_level: 'mild',
            fatigue_level: 'none',
            suggestions: ['保证充足睡眠']
          },
          hair: {
            overall_score: 78,
            summary: '发量正常，发质良好',
            density_level: 'normal',
            gray_level: 'none',
            suggestions: ['保持健康饮食']
          }
        },
        showResult: true,
        analyzeProgress: 100
      })
    } catch (err) {
      wx.showToast({ title: '分析失败', icon: 'none' })
    } finally {
      this.setData({ isAnalyzing: false })
    }
  },

  formatTime(s) {
    return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`
  },

  getScoreColor(score) {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#3b82f6'
    return '#eab308'
  },

  onShareAppMessage() {
    return { title: '视频健康分析结果', path: '/pages/video/video' }
  }
})
