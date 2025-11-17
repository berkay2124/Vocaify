# Vocaify React - AI Destekli HR & ATS Sistemi

Modern React ile yeniden yazılmış Vocaify ATS (Applicant Tracking System) uygulaması.

## 🚀 Özellikler

- **React 18** ile modern component mimarisi
- **Context API** ile global state management
- **Chart.js** ile interaktif grafikler
- **Lucide React** icon kütüphanesi
- **Tailwind CSS** ile responsive tasarım
- **localStorage** ile veri persistance
- **Hooks** (useState, useEffect, useContext)
- **Modüler yapı** - Kolay bakım ve geliştirme

## 📁 Proje Yapısı

```
vocaify-react/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # Temel bileşenler
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   └── Loader.jsx
│   ├── tabs/                   # Sekme bileşenleri
│   │   ├── Dashboard.jsx
│   │   ├── Candidates.jsx
│   │   ├── Employees.jsx
│   │   ├── Search.jsx
│   │   └── Analytics.jsx
│   ├── modal/                  # Modal bileşenleri
│   │   ├── Modal.jsx
│   │   └── ModalTabs/
│   │       ├── DetailTab.jsx
│   │       ├── EvaluationTab.jsx
│   │       ├── OfferTab.jsx
│   │       ├── DocumentsTab.jsx
│   │       ├── ActionsTab.jsx
│   │       ├── HistoryTab.jsx
│   │       └── PerformanceTab.jsx
│   ├── context/                # State management
│   │   └── AppContext.js
│   ├── config/                 # Konfigürasyon
│   │   └── constants.js
│   ├── utils/                  # Yardımcı fonksiyonlar
│   │   ├── helpers.js
│   │   └── dataManager.js
│   ├── App.js                  # Ana uygulama
│   ├── App.css                 # Component stilleri
│   ├── index.js                # React entry point
│   └── index.css               # Global stiller
└── package.json                # Dependencies

## 🛠️ Kurulum

1. **Proje klasörüne gidin:**
   ```bash
   cd vocaify-react
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm start
   ```

4. **Tarayıcıda açın:**
   ```
   http://localhost:3000
   ```

## 📦 Production Build

```bash
npm run build
```

Build klasörü `build/` dizininde oluşturulacaktır.

## 🎯 Kullanılan Teknolojiler

- **React 18.2** - UI Framework
- **Context API** - State Management
- **Chart.js 4.4** - Data Visualization
- **Lucide React** - Icon Library
- **Tailwind CSS** - Utility-first CSS Framework
- **localStorage API** - Client-side Storage

## 📚 Ana Bileşenler

### Context API (AppContext)
Global state management için kullanılır:
- Candidates & Employees state
- Modal state
- Active tab state
- Filters state

### Tabs
- **Dashboard**: Genel bakış ve istatistikler
- **Candidates**: Aday yönetimi ve filtreleme
- **Employees**: Personel yönetimi
- **Search**: AI destekli akıllı arama
- **Analytics**: Chart.js ile görsel raporlar

### Modal Tabs
- **Detail**: Kişi bilgileri ve notlar
- **Evaluation**: KPI değerlendirme (10 kategori)
- **Offer**: İş teklifi yönetimi
- **Documents**: Özlük dosyaları
- **Actions**: İK aksiyonları
- **History**: Süreç geçmişi
- **Performance**: Performans değerlendirmeleri

## 🔄 Vanilla JS'den React'e Dönüşüm

### Önemli Değişiklikler:
- ✅ `window.functionName` → React props/context
- ✅ `onclick="..."` → `onClick={...}`
- ✅ String template rendering → JSX components
- ✅ Global state → Context API
- ✅ Direct DOM manipulation → React state
- ✅ Inline event handlers → Component methods

## 🎨 Stil ve Tema

- Glass-morphism tasarım
- Purple-pink gradient renk paleti
- Smooth animasyonlar ve transitions
- Responsive mobile-first yaklaşım

## 📄 Lisans

Bu proje Vocaify AI tarafından geliştirilmiştir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Vocaify AI - AI Destekli İnsan Kaynakları Sistemi

---

**Not**: Bu React versiyonu, orijinal vanilla JavaScript uygulamasından dönüştürülmüştür ve tüm özellikleri içermektedir.
