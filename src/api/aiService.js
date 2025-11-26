const { HF_API_TOKEN, HF_MODEL } = require('../config/local.env');

const API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

async function analyzeText(text) {
  if (!text || text.trim() === '') {
    return null;
  }

  try {
    const body = JSON.stringify({ inputs: text });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error('API hatası');
    }

    const data = await response.json();
    return formatResponse(data);
  } catch (error) {
    console.error('Hata:', error);
    return {
      sentiment: 'nötr',
      rawLabel: 'ERROR',
      score: 0,
      summary: 'Analiz sırasında bir hata oluştu.',
      suggestion: 'Lütfen tekrar deneyin.',
    };
  }
}

function formatResponse(data) {
  let results = data;
  
  if (Array.isArray(data) && data.length > 0) {
    if (Array.isArray(data[0])) {
      results = data[0];
    }
  }

  if (!results || results.length === 0) {
    return {
      sentiment: 'nötr',
      rawLabel: 'UNKNOWN',
      score: 0,
      summary: 'API yanıtı beklenmeyen formattaydı.',
      suggestion: 'Lütfen tekrar deneyin.',
    };
  }

  let bestResult = results[0];
  for (let i = 1; i < results.length; i++) {
    if (results[i].score > bestResult.score) {
      bestResult = results[i];
    }
  }

  const score = bestResult.score || 0;
  const label = bestResult.label || 'nötr';
  const sentiment = determineSentiment(label);

  return {
    sentiment: sentiment,
    rawLabel: label,
    score: score,
    summary: getSummary(sentiment),
    suggestion: getSuggestion(sentiment),
  };
}

function determineSentiment(label) {
  const upperLabel = label.toUpperCase();

  // Türkçe model label'ları: POSITIVE, NEGATIVE, NEUTRAL
  // Ayrıca eski model formatları için de destek
  if (upperLabel.includes('POSITIVE') || upperLabel === 'POSITIVE' || upperLabel.includes('POS')) {
    return 'pozitif';
  }
  if (upperLabel.includes('NEGATIVE') || upperLabel === 'NEGATIVE' || upperLabel.includes('NEG')) {
    return 'negatif';
  }
  if (upperLabel.includes('NEUTRAL') || upperLabel === 'NEUTRAL' || upperLabel.includes('NÖTR')) {
    return 'nötr';
  }
  
  // 5 yıldızlı sistem için (eski model uyumluluğu)
  if (upperLabel.includes('5 STAR') || upperLabel.includes('4 STAR')) {
    return 'pozitif';
  }
  if (upperLabel.includes('1 STAR') || upperLabel.includes('2 STAR')) {
    return 'negatif';
  }
  if (upperLabel.includes('3 STAR')) {
    return 'nötr';
  }
  
  return 'nötr';
}

function getSummary(sentiment) {
  if (sentiment === 'pozitif') {
    return 'Bugün genel olarak olumlu bir gün geçirmişsin.';
  }
  if (sentiment === 'negatif') {
    return 'Bugün biraz zor veya olumsuz hissetmişsin.';
  }
  return 'Bugün karışık veya nötr duyguların var.';
}

function getSuggestion(sentiment) {
  if (sentiment === 'pozitif') {
    return 'Harika! Kendini ödüllendirmek için küçük bir şey yapabilirsin.';
  }
  if (sentiment === 'negatif') {
    return 'Kısa bir yürüyüş veya 10 dakikalık mola yardımcı olabilir.';
  }
  return 'Kısa nefes egzersizleri veya bir mola deneyebilirsin.';
}

module.exports = { analyzeText };
