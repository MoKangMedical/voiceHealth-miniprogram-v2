// pages/index/index.js
const app = getApp()
const util = require('../../utils/util.js')
const config = require('../../config.js')
const recorderManager = wx.getRecorderManager()

Page({
  data: {
    isRecording: false,
    recordingTime: 0,
    timer: null,
    canAnalyze: false,
    audioFilePath: '',
    isAnalyzing: false,
    freeCount: 0,
    maxFree: 1,
    isVip: false,
    readingText: null,
    showReadingText: false,
    tips: [
      '请在安静环境下录制',
      '请朗读下方显示的文字',
      '保持正常语速和音量',
      '录制30秒效果最佳'
    ]
  },

  onLoad() {
    this.setData({
      freeCount: app.globalData.freeCount,
      maxFree: app.globalData.maxFreePerDay,
      isVip: app.globalData.isVip
    })
    this.fetchReadingText()
  },

  onShow() {
    this.setData({
      freeCount: app.globalData.freeCount,
      isVip: app.globalData.isVip
    })
  },

  async fetchReadingText() {
    try {
      const res = await app.request({ url: '/api/v1/verification/text' })
      if (res.ok) {
        this.setData({ readingText: res.text, showReadingText: true })
      }
    } catch (err) {
      console.error('获取朗读文本失败:', err)
      this.setData({
        readingText: {
          id: 'standard_1',
          text: '春天来了，花儿开了，小鸟在枝头唱歌。阳光温暖地照在大地上，万物复苏，生机勃勃。',
          keywords: ['春天', '花儿', '小鸟', '阳光']
        },
        showReadingText: true
      })
    }
  },

  refreshReadingText() {
    this.fetchReadingText()
    wx.showToast({ title: '已刷新', icon: 'success' })
  },

  startRecording() {
    if (!app.globalData.userInfo) {
      this.getUserProfile()
      return
    }

    recorderManager.start({
      duration: config.analysis.maxDuration,
      sampleRate: config.analysis.sampleRate,
      numberOfChannels: config.analysis.numberOfChannels,
      encodeBitRate: config.analysis.encodeBitRate,
      format: config.analysis.format
    })

    recorderManager.onStart(() => {
      this.setData({ isRecording: true, recordingTime: 0 })
      this.startTimer()
    })

    recorderManager.onError((err) => {
      console.error('录音失败:', err)
      wx.showToast({ title: '录音失败，请重试', icon: 'none' })
    })
  },

  stopRecording() {
    recorderManager.stop()
    recorderManager.onStop((res) => {
      this.stopTimer()
      this.setData({
        isRecording: false,
        audioFilePath: res.tempFilePath,
        canAnalyze: true
      })
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

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于生成健康参考报告',
      success: (res) => {
        const userInfo = res.userInfo
        app.globalData.userInfo = userInfo
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
        this.startRecording()
      },
      fail: () => {
        wx.showToast({ title: '需要授权才能使用', icon: 'none' })
      }
    })
  },

  async startAnalysis() {
    if (!this.data.canAnalyze || this.data.isAnalyzing) return

    if (!app.globalData.isVip && !app.canUseFree()) {
      this.showPaymentModal()
      return
    }

    this.setData({ isAnalyzing: true })

    try {
      wx.showLoading({ title: '分析中...' })

      const res = await wx.cloud.callFunction({
        name: 'analyze',
        data: {
          audioPath: this.data.audioFilePath,
          userId: app.globalData.userInfo?.nickName || 'anonymous',
          readingTextId: this.data.readingText?.id
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        if (!app.globalData.isVip) {
          app.useFree()
          this.setData({ freeCount: app.globalData.freeCount })
        }

        const reportId = res.result.reportId
        wx.navigateTo({ url: `/pages/report/report?id=${reportId}` })
      } else {
        wx.showToast({ title: res.result.message || '分析失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      console.error('分析失败:', err)
      wx.showToast({ title: '网络错误，请重试', icon: 'none' })
    } finally {
      this.setData({ isAnalyzing: false, canAnalyze: false, recordingTime: 0 })
    }
  },

  showPaymentModal() {
    wx.showModal({
      title: '免费次数已用完',
      content: `今日免费次数已用完。单次分析 ${app.globalData.pricePerReport} 元，或开通会员无限次使用。`,
      confirmText: '立即支付',
      cancelText: '明天再来',
      success: (res) => {
        if (res.confirm) {
          this.createPayment()
        }
      }
    })
  },

  async createPayment() {
    try {
      wx.showLoading({ title: '创建订单...' })

      const res = await wx.cloud.callFunction({
        name: 'payment',
        data: {
          type: 'single',
          amount: config.payment.singlePrice,
          description: 'VoiceHealth 单次健康参考报告'
        }
      })

      wx.hideLoading()

      if (res.result.payment) {
        wx.requestPayment({
          ...res.result.payment,
          success: () => {
            wx.showToast({ title: '支付成功', icon: 'success' })
            app.globalData.isVip = true
            wx.setStorageSync('isVip', true)
            this.startAnalysis()
          },
          fail: () => {
            wx.showToast({ title: '支付取消', icon: 'none' })
          }
        })
      }
    } catch (err) {
      wx.hideLoading()
      console.error('支付失败:', err)
      wx.showToast({ title: '支付创建失败', icon: 'none' })
    }
  },

  formatTime(seconds) {
    return util.formatDuration(seconds)
  },

  goScience() {
    wx.navigateTo({ url: '/pages/science/science' })
  },

  goFace() {
    wx.navigateTo({ url: '/pages/face/face' })
  },

  goCombined() {
    wx.navigateTo({ url: '/pages/combined/combined' })
  },

  goVideo() {
    wx.navigateTo({ url: '/pages/video/video' })
  }
})
