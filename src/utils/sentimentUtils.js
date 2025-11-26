export function sentimentEmoji(s) {
  if (!s) return '😐';
  if (s === 'pozitif') return '😊';
  if (s === 'negatif') return '😔';
  return '😐';
}

export function getSentimentColor(sentiment) {
  if (sentiment === 'pozitif') return '#4CAF50';
  if (sentiment === 'negatif') return '#F44336';
  return '#9E9E9E';
}

export function getSentimentBgColor(sentiment) {
  if (sentiment === 'pozitif') return '#E8F5E9';
  if (sentiment === 'negatif') return '#FFEBEE';
  return '#F5F5F5';
}

export function groupByDay(entries) {
  const grouped = {};
  entries.forEach(entry => {
    const date = new Date(entry.when).toLocaleDateString('tr-TR');
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  });
  return grouped;
}

export function groupByWeek(entries) {
  const grouped = {};
  entries.forEach(entry => {
    const date = new Date(entry.when);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toLocaleDateString('tr-TR');
    if (!grouped[weekKey]) grouped[weekKey] = [];
    grouped[weekKey].push(entry);
  });
  return grouped;
}

export function getDailyStats(dayEntries) {
  const stats = { positive: 0, negative: 0, nötr: 0 };
  dayEntries.forEach(entry => {
    const sentiment = entry.ai?.sentiment || 'nötr';
    stats[sentiment] = (stats[sentiment] || 0) + 1;
  });
  return stats;
}

export function getWeeklyStats(weekEntries) {
  const stats = { positive: 0, negative: 0, nötr: 0 };
  weekEntries.forEach(entry => {
    const sentiment = entry.ai?.sentiment || 'nötr';
    stats[sentiment] = (stats[sentiment] || 0) + 1;
  });
  return stats;
}
