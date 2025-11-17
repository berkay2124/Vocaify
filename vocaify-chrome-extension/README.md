# 🎯 Vocaify Chrome Extension

## AŞAMA 29: LinkedIn AI Sourcing Tool

Vocaify için Chrome Extension! LinkedIn profillerinden tek tıkla aday eklemenizi sağlar.

---

## 🚀 Özellikler

✅ **LinkedIn Profil Scraping**: LinkedIn profil sayfalarından otomatik veri çekme
✅ **AI Analizi**: Claude API ile CV analizi (AŞAMA 8 entegrasyonu)
✅ **Firebase Entegrasyonu**: Doğrudan Vocaify veritabanına ekleme (AŞAMA 7)
✅ **Akıllı Veri Çıkarma**: İsim, pozisyon, lokasyon, yetenekler, deneyim, eğitim
✅ **Güvenli**: API keyleriniz yalnızca tarayıcınızda saklanır

---

## 📁 Dosya Yapısı

```
vocaify-chrome-extension/
├── manifest.json           # Chrome Extension yapılandırması (Manifest V3)
├── popup.html             # Extension popup arayüzü
├── popup.js               # Popup mantığı
├── content_script.js      # LinkedIn sayfasında çalışan script
├── background.js          # Service worker (Firebase + AI entegrasyonu)
├── options.html           # Ayarlar sayfası
├── options.js             # Ayarlar mantığı
├── README.md              # Bu dosya
└── icons/                 # Extension ikonları (eklenecek)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ Kurulum

### 1. Extension'ı Yükle

1. Chrome tarayıcıda `chrome://extensions/` adresine git
2. Sağ üstten **"Geliştirici modu"** aktif et
3. **"Paketlenmemiş uzantı yükle"** butonuna tıkla
4. `vocaify-chrome-extension` klasörünü seç

### 2. İkonları Ekle

`icons/` klasörüne aşağıdaki dosyaları ekleyin:
- `icon16.png` (16x16 px)
- `icon48.png` (48x48 px)
- `icon128.png` (128x128 px)

**Öneri**: Vocaify logosunu kullanın (mor-pembe gradient, 🎯 ikonu)

### 3. Ayarları Yapılandır

1. Extension ikonuna sağ tıklayın
2. **"Seçenekler"** menüsünü açın
3. Firebase bilgilerinizi girin:
   - **API Key**: Firebase Console > Project Settings > Web API Key
   - **Database URL**: `https://your-project.firebaseio.com`
4. (Opsiyonel) Claude API Key girin
5. **"Ayarları Kaydet"** butonuna tıklayın

---

## 📖 Kullanım

1. **LinkedIn'e gidin**: Bir profil sayfasını açın (örn: linkedin.com/in/john-doe)
2. **Extension'ı açın**: Toolbar'daki Vocaify ikonuna tıklayın
3. **Profil bilgilerini kontrol edin**: Otomatik olarak çekilecek
4. **Vocaify'a ekleyin**: "Vocaify'a Ekle" butonuna tıklayın

Aday, Firebase veritabanınıza `candidates/` koleksiyonuna eklenecek!

---

## 🔧 Teknik Detaylar

### Manifest V3
Chrome'un en güncel extension standardı kullanılıyor.

### Content Script (content_script.js)
- LinkedIn sayfasında çalışır
- DOM'dan profil bilgilerini çeker
- Birden fazla selector ile uyumluluk sağlar

### Background Service Worker (background.js)
- Firebase REST API kullanır
- Claude API ile CV analizi yapar
- Asenkron işlemleri yönetir

### Popup (popup.html/js)
- Kullanıcı arayüzü
- LinkedIn kontrolü
- Veri görüntüleme ve ekleme

### Options Page (options.html/js)
- Firebase ve Claude API yapılandırması
- Chrome Storage ile güvenli saklama

---

## 🔒 Güvenlik

- API keyleriniz **yalnızca tarayıcınızda** saklanır (Chrome Storage Sync)
- Sunuculara gönderilmez
- HTTPS üzerinden şifreli iletişim
- Firebase Security Rules uygulanır

---

## 🐛 Sorun Giderme

### "Content script hatası" alıyorum
➡️ LinkedIn sayfasını yenileyin (F5)

### "Profil bilgileri alınamadı"
➡️ LinkedIn'in DOM yapısı değişmiş olabilir. Console'u kontrol edin.

### "Firebase yapılandırması bulunamadı"
➡️ Options sayfasından Firebase bilgilerinizi girin.

### "Claude API hatası"
➡️ API key doğru mu? Kota dolmuş olabilir. Demo modu kullanılacak.

---

## 📊 LinkedIn'den Çekilen Bilgiler

- ✅ İsim
- ✅ Pozisyon/Unvan
- ✅ Lokasyon
- ✅ Hakkında (About)
- ✅ Deneyim (ilk pozisyon)
- ✅ Eğitim (ilk okul)
- ✅ Yetenekler (ilk 10)
- ✅ Profil URL'si

---

## 🎨 UI/UX Özellikleri

- Modern gradient tasarım (Vocaify renkleri)
- Responsive layout
- Loading animasyonları
- Hata/başarı mesajları
- Status indicator (online/offline)

---

## 🔗 Entegrasyonlar

### AŞAMA 7: Firebase Entegrasyonu
Firebase REST API ile direkt veritabanına yazma.

### AŞAMA 8: Claude AI Entegrasyonu
CV analizi için Claude 3.5 Sonnet kullanımı.

### AŞAMA 11: AI Sourcing Geliştirmesi
Web sayfasından Chrome Extension'a dönüşüm.

---

## 📈 Gelecek Özellikler

- [ ] Toplu aday ekleme (arama sonuçlarından)
- [ ] LinkedIn mesajlaşma entegrasyonu
- [ ] Aday notları ekleme
- [ ] Dashboard widget
- [ ] Diğer platformlar (GitHub, Stack Overflow)

---

## 🤝 Katkıda Bulunma

1. Bu extension'ı fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje Vocaify ATS sisteminin bir parçasıdır.

---

## 👨‍💻 Geliştirici Notları

### Manifest V3 Migration
- Service Worker kullanımı zorunlu (background.html yerine)
- `host_permissions` ayrı tanımlanmalı
- `web_accessible_resources` yeni format

### LinkedIn Selectors
LinkedIn sık sık DOM yapısını değiştirir. `content_script.js` içinde birden fazla selector kullanılıyor:

```javascript
const nameSelectors = [
    'h1.text-heading-xlarge',
    'h1.inline.t-24.v-align-middle.break-words',
    // ...
];
```

### Demo Mode
Claude API yoksa otomatik demo moda geçer:
- Basit yetenekler çıkarımı
- Deneyim tahmin edilir
- Standart summary oluşturulur

---

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Vocaify Documentation
- İletişim: vocaify@example.com

---

**Geliştirici**: Vocaify Team
**Versiyon**: 1.0.0
**Tarih**: Kasım 2025
**AŞAMA**: 29
