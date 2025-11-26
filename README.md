# 🐦 Akıllı Asistan - AI Günlük Asistanım

React Native ile geliştirilmiş, kullanıcının günlük duygu durumunu AI ile analiz eden mobil uygulama.

## 📋 Proje Özeti

**Akıllı Asistan**, kullanıcıların günlük duygu durumlarını yazılı olarak ifade edebilecekleri ve bu ifadelerin AI tarafından analiz edilerek sentiment (duygu) analizi yapıldığı bir mobil uygulamadır. Uygulama, Hugging Face'in ücretsiz Inference API'sini kullanarak metinleri analiz eder ve kullanıcıya duygu durumu, özet ve öneriler sunar.

### 🎯 Proje Kapsamı

Bu proje, **Konuşarak Öğren - React Native + AI Stajyer Projesi** kapsamında 3 günlük bir süre içinde geliştirilmiştir. Tüm servisler ücretsiz olarak kullanılmış ve proje React Native CLI formatında oluşturulmuştur.

### ✨ Özellikler

- ✅ **Günlük Duygu Analizi**: Kullanıcılar günlük duygu durumlarını yazarak AI ile analiz edebilir
- ✅ **Sentiment Analizi**: Pozitif, negatif ve nötr duygu durumlarının tespiti
- ✅ **Günlük/Haftalık Özet**: Geçmiş analizlerin günlük ve haftalık olarak görüntülenmesi
- ✅ **Offline Çalışma**: İnternet bağlantısı olmadan önceki analizlerin görüntülenmesi
- ✅ **Renkli UI/UX**: Duygu durumuna göre dinamik arka plan renkleri
- ✅ **Lokal Veri Saklama**: AsyncStorage ile tüm verilerin cihazda saklanması

## 🛠️ Teknolojiler

### Mobil Platform
- **React Native CLI** (JavaScript/TypeScript)
- React Native 0.74.5
- React 18.2.0

### State Yönetimi
- React Hooks (useState, useEffect)
- Context API (gerekli yerlerde)

### AI Entegrasyonu
- **Hugging Face Inference API** (Ücretsiz)
- **Model**: `nlptown/bert-base-multilingual-uncased-sentiment`
Bu model, çok dilli (multilingual) bir BERT modelidir ve sentiment analizi için eğitilmiştir. Model, 5 yıldızlı bir sistem kullanır:
- 5 stars / 4 stars → Pozitif
- 3 stars → Nötr
- 2 stars / 1 star → Negatif


### API Endpoint
- **Endpoint**: `https://router.huggingface.co/hf-inference/models/`

POST https://router.huggingface.co/hf-inference/models/{model_name}
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json
Body:
  {
    "inputs": "kullanıcı metni"
  }

### Veri Saklama
- **AsyncStorage** (@react-native-async-storage/async-storage)

### Navigation
- **React Navigation** (@react-navigation/native)
- Native Stack Navigator

### UI/UX
- React Native StyleSheet
- Özel tasarım (React Native Paper veya Native Base kullanılmadı)



## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js >= 18
- npm veya yarn
- Android Studio (Android için)
- Xcode (iOS için - sadece macOS)
- React Native CLI


### Adım 1: Projeyi Klonlayın
git clone <repository-url>
cd AsistanApp


### Adım 2: Bağımlılıkları Yükleyin
npm install
veya
yarn install


### Adım 3: API Token'ı Yapılandırın
1. `src/config/local.env.js` dosyasını açın
2. Hugging Face API token'ınızı ekleyin:
javascript
module.exports =

 {
  HF_API_TOKEN: 'your-huggingface-token-here',
  HF_MODEL: 'nlptown/bert-base-multilingual-uncased-sentiment'

};
**Hugging Face Token Nasıl Alınır?**
1. [Hugging Face](https://huggingface.co/) hesabı oluşturun
2. Settings > Access Tokens bölümüne gidin
3. Yeni bir token oluşturun (Read izni yeterli)
4. Token'ı `local.env.js` dosyasına ekleyin


### Adım 4: Metro Bundler'ı Başlatın
npm start
 veya
yarn start


### Adım 5: Uygulamayı Çalıştırın
**Android için:**
npm run android
#veya
yarn android

**iOS için (sadece macOS):**
npm run ios
 veya
yarn ios




## 📁 Proje Yapısı

AsistanApp/
├── src/
│   ├── api/
│   │   └── aiService.js          # Hugging Face API entegrasyonu
│   ├── assets/
│   │   └── bird_character.jpg    # Uygulama logosu
│   ├── config/
│   │   └── local.env.js          # API token ve model konfigürasyonu
│   ├── screens/
│   │   ├── HomeScreen.js         # Ana ekran
│   │   ├── HistoryScreen.js      # Geçmiş ekranı (tab container)
│   │   ├── DailySummaryScreen.js # Günlük özet
│   │   └── WeeklySummaryScreen.js # Haftalık özet
│   └── utils/
│       └── sentimentUtils.js     # Ortak utility fonksiyonları
├── screenshots/                   # Ekran görüntüleri ve demo videoları
├── App.tsx                        # Ana uygulama dosyası
├── package.json
└── README.md



## 🎨 UI/UX Özellikleri

- **Dinamik Arka Plan Renkleri**:
  - Pozitif: Açık yeşil (#E8F5E9)
  - Negatif: Açık kırmızı (#FFEBEE)
  - Nötr: Gri (#F5F5F5)

- **Renk Kodları**:
  - Pozitif: #4CAF50 (yeşil)
  - Negatif: #F44336 (kırmızı)
  - Nötr: #9E9E9E (gri)

- **Emoji Gösterimi**:
  - Pozitif: 😊
  - Negatif: 😔
  - Nötr: 😐

## 📊 Veri Yapısı

Her analiz sonucu şu yapıda saklanır:
ipt
{
  id: "timestamp",
  text: "kullanıcı metni",
  when: "ISO 8601 tarih formatı",
  ai: {
    sentiment: "pozitif" | "negatif" | "nötr",
    rawLabel: "model label'ı",
    score: 0.0-1.0,
    summary: "özet mesajı",
    suggestion: "öneri mesajı"
  }
}

## 🔒 Offline Çalışma

Uygulama, tüm analiz sonuçlarını AsyncStorage'da saklar. Bu sayede:
- İnternet bağlantısı olmadan önceki analizler görüntülenebilir
- Veriler cihazda kalıcı olarak saklanır
- Uygulama kapatılıp açılsa bile veriler korunur


## 🤖 AI Araç Kullanımı

Bu proje geliştirilirken **yapay zeka destekli kod editörleri** kullanılmıştır:

- **Cursor AI**: Kod yazımı, hata düzeltme ve optimizasyon süreçlerinde yardımcı olarak kullanılmıştır
- **Gemini**: Kompleks mantık problemlerinin çözümünde ve kod yapısının iyileştirilmesinde kullanılmıştır

AI araçları özellikle şu alanlarda kullanılmıştır:
- API entegrasyonu ve hata yönetimi
- UI/UX tasarımı ve stil optimizasyonu
- Kod organizasyonu ve modüler yapı
- React Navigation yapılandırması

**Not**: Tüm kod mantığı ve iş akışı geliştirici tarafından tasarlanmış, AI araçları sadece implementasyon sürecinde yardımcı olarak kullanılmıştır.

## 📸 Ekran Görüntüleri

Uygulamanın ekran görüntüleri ve demo videoları için `screenshots/` klasörüne bakabilirsiniz.

### Ekranlar:
1. **Ana Ekran**: Logo, metin girişi, analiz butonu ve sonuç gösterimi
2. **Geçmiş Ekranı**: Günlük ve haftalık özet sekmeleri
3. **Günlük Özet**: Tarih bazlı analiz sonuçları ve istatistikler
4. **Haftalık Özet**: Haftalık analiz sonuçları ve istatistikler

### Dosya İsimlendirmeleri:
- `home-screen.png` - Ana ekran görüntüsü
- `status-screen.png` - Durum ekranı görüntüsü
- `daily-summary.png` - Günlük özet görüntüsü
- `weekly-summary.png` - Haftalık özet görüntüsü
- `demo-video.mp4` - Demo videosu

## 🐛 Bilinen Sorunlar

- İlk API çağrısında model yüklenirken kısa bir gecikme olabilir
- Çok uzun metinler için API timeout riski (max ~500 karakter önerilir)

## 🔮 Gelecek Geliştirmeler

- [ ] Grafik ve istatistik görselleştirmeleri
- [ ] Export/Import özelliği
- [ ] Bildirim sistemi
- [ ] Dark mode desteği
- [ ] Çoklu dil desteği (İngilizce, Almanca, vb.)

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

Proje, **Konuşarak Öğren - React Native + AI Stajyer Projesi** kapsamında geliştirilmiştir.

## 🙏 Teşekkürler

- Hugging Face - Ücretsiz AI Inference API
- React Native Community
- Tüm açık kaynak kütüphane geliştiricileri

---

**Not**: Bu uygulama tamamen ücretsiz servisler kullanılarak geliştirilmiştir ve eğitim amaçlıdır.
