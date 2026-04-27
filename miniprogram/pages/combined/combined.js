// pages/combined/combined.js
Page({
  data: {
    hasVoice: false,
    hasFace: false,
    voiceResult: null,
    faceResult: null,
    combinedResult: null,
    isAnalyzing: false,
    showResult: false,
    dimensions: [
      { name: '心血管', icon: '❤️', score: 0 },
      { name: '呼吸系统', icon: '🫁', score: 0 },
      { name: '神经系统', icon: '🧠', score: 0 },
      { name: '内分泌', icon: '⚖️', score: 0 },
      { name: '免疫系统', icon: '🛡️', score: 0 },
      { name: '衰老程度', icon: '⏳', score: 0 }
    ]
  },

  onLoad(options) {
    if (options.voice) this.setData({ hasVoice: true, voiceResult: JSON.parse(options.voice) })
    if (options.face) this.setData({ hasFace: true, faceResult: JSON.parse(options.face) })
  },

  async startCombinedAnalysis() {
    this.setData({ isAnalyzing: true })
    
    try {
      wx.showLoading({ title: '综合分析中...' })
      
      // 模拟综合分析结果
      await new Promise(r => setTimeout(r, 2000))
      
      const dimensions = this.data.dimensions.map((d, i) => ({
        ...d,
        score: 65 + Math.floor(Math.random() * 25)
      }))
      
      const overallScore = Math.floor(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length)
      
      this.setData({
        combinedResult: {
          overall_score: overallScore,
          biological_age: 28,
          dimensions: dimensions,
          summary: '综合评估显示您的整体健康状态良好，各项指标均在正常范围内。',
          suggestions: [
            '保持规律作息，每天睡眠7-8小时',
            '每周进行3-4次中等强度运动',
            '均衡饮食，多摄入蔬果和优质蛋白',
            '定期进行健康体检'
          ]
        },
        showResult: true
      })
      
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
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

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  onShareAppMessage() {
    return { title: '我的综合健康评估结果', path: '/pages/combined/combined' }
  }
})
