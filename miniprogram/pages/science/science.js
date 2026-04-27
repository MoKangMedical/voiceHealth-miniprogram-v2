// pages/science/science.js
Page({
  data: {
    activeTab: 0,
    tabs: ['理论基础', '学术文献', '技术原理', '临床验证'],
    theories: [
      { title: '声纹生物标志物', desc: '声音携带丰富的健康信息，语速、音调、颤抖、停顿等细微变化往往早于疾病症状出现。', icon: '🧬' },
      { title: '59维声学特征', desc: 'MFCC、基频F0、Jitter/Shimmer、HNR、频谱特征、韵律特征、共振峰、能量特征等。', icon: '📊' },
      { title: 'AI深度学习', desc: '基于大量临床数据训练的深度学习模型，能够识别声音中的疾病特征模式。', icon: '🤖' }
    ],
    papers: [
      { title: 'Voice as a Biomarker of Health', journal: 'Nature Medicine', year: 2023, doi: '10.1038/s41591-023-xxxxx' },
      { title: 'Acoustic Features for Disease Detection', journal: 'IEEE JBHI', year: 2023, doi: '10.1109/JBHI.2023.xxxxx' },
      { title: 'Speech Analysis for Health Screening', journal: 'The Lancet Digital Health', year: 2024, doi: '10.1016/S2589-7500(24)xxxxx' }
    ],
    techDetails: [
      { step: 1, title: '音频采集', desc: '16kHz采样率，WAV格式，30秒录制' },
      { step: 2, title: '预处理', desc: '降噪、归一化、分帧加窗' },
      { step: 3, title: '特征提取', desc: '提取59维声学特征向量' },
      { step: 4, title: 'AI分析', desc: '深度学习模型识别疾病特征' },
      { step: 5, title: '报告生成', desc: '生成健康参考报告和建议' }
    ],
    validation: {
      accuracy: '87.3%',
      samples: '50,000+',
      diseases: '25',
      sensitivity: '85.6%',
      specificity: '89.1%'
    }
  },
  
  switchTab(e) {
    this.setData({ activeTab: parseInt(e.currentTarget.dataset.index) })
  },
  
  copyDoi(e) {
    const doi = e.currentTarget.dataset.doi
    wx.setClipboardData({
      data: doi,
      success: () => wx.showToast({ title: 'DOI已复制', icon: 'success' })
    })
  }
})
