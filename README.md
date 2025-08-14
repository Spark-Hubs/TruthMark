# TruthMark

Web'de okuduğunuz her türlü metin için anında doğruluk kontrolü sağlayan AI destekli bir fact-checking platformu. TruthMark, herhangi bir web sayfasında metin seçip anında analiz yapabileceğiniz bir Chrome eklentisi ve güçlü bir backend hizmetinden oluşmaktadır.

## 🎯 Ne İşe Yarar?

TruthMark, günümüzün bilgi kirliliği sorununa teknolojik bir çözüm sunar. İnternette karşılaştığınız haberleri, iddiaları ve bilgileri anında kontrol edebilir, güvenilirliklerini öğrenebilirsiniz.

### Temel Özellikler

- **Anında Analiz**: Herhangi bir web sayfasında metin seçin ve anında AI destekli doğruluk analizi alın
- **Kolay Kullanım**: Çift tıklama, sağ tık veya Ctrl+tık ile analizi başlatın
- **Detaylı Sonuçlar**: Doğruluk skoru, güvenilirlik seviyesi ve detaylı açıklama
- **Türkçe Destek**: Türkçe içerik analizi ve Türkçe sonuçlar
- **Kaynak Gösterimi**: Analiz sonuçlarında güvenilir kaynaklara referanslar

## 📊 Nasıl Çalışır?

1. **Chrome Eklentisi**: Tarayıcınıza kurduğunuz eklenti, web sayfalarındaki metinleri analiz etmenizi sağlar
2. **AI Analizi**: Seçtiğiniz metin, gelişmiş AI algoritmaları ile analiz edilir
3. **Kaynak Kontrolü**: Bilgiler güncel kaynaklardan kontrol edilir ve doğrulanır
4. **Anında Sonuç**: Saniyeler içinde detaylı analiz sonucu alırsınız

## Ölçümlenme sonuçları

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/95d60ede-4b83-4f88-9af8-b6d9a849eb10" width="200"/>
  <img src="https://github.com/user-attachments/assets/8da92acd-ab7e-4d2f-9b62-dc8ae5e3b596" width="200"/>
  <img src="https://github.com/user-attachments/assets/aed2c034-ab82-4068-aa04-8ab890bf2af7" width="200"/>
  <img src="https://github.com/user-attachments/assets/50937ecd-e91f-49f1-baaa-8661436f3824" width="200"/>
</div>

## Proje diaqrami
![WhatsApp Image 2025-08-14 at 21 17 48](https://github.com/user-attachments/assets/42ffdbc4-318e-4349-910d-342081e3010e)


## Gelişim sürecinde karşılaşılan zorluklar ve çözümleri

Kullandığımız LLM modeli, küçük bir sunucu üzerinde çalıştığı için boyut olarak küçük bir modeldir.
Modelin performansını artırmak amacıyla _fine-tuning_ yapmamız gerekmektedir.
Ancak elimizde yeterli miktarda gerçek veri bulunmadığı için, _sentetik veri üretimi_ yöntemini tercih ettik.

Veri üretim süreci şu şekilde ilerlemektedir:

1.⁠ ⁠*Web Scraping*

- İlgili konularda web üzerinden veri toplanır.

2.⁠ ⁠*Veri Dönüşümü (Synthetic Data Generation)*

- Toplanan ham veriler, GPT ve Claude gibi yapay zeka araçlarına gönderilerek _sentetik veriye_ dönüştürülür.

3.⁠ ⁠*Veri Yapılandırma*

- Üretilen veriler, tarafımızca belirlenen _özel bir veri yapısına (structure)_ oturtulur.

Bu süreç sonunda elde edilen veriler, LLM modelimizin _fine-tuning_ aşamasında kullanılmaktadır.

## Gereksinimler

TruthMark, Türkçe ve İngilizce metinlerin doğruluğunu kontrol eden, Chrome eklentisi + backend API yapısında çalışan bir platformdur. 
Sistem, gerçek zamanlı web scraping ile güvenilir kaynaklardan veri toplar ve LLM tabanlı analiz yapar.

### 1. Donanım Gereksinimleri
| Ortam            | Minimum                  | Önerilen                     | Açıklama |
|------------------|--------------------------|-------------------------------|----------|
| **Production**   | 4 vCPU, 8GB RAM, 50GB SSD | 8 vCPU, 16GB RAM, 100GB SSD    | Yalnızca scraping + API servisleri çalışır, GPU gerekmez |
| **Fine-Tuning**  | RTX 3060 (12GB) GPU       | RTX 3090 / A100 (40GB) GPU     | Sentetik + gerçek veri ile offline model eğitimi |
| **Depolama**     | 50GB SSD                  | 200GB NVMe SSD                 | Veri geçmişi + scraping logları |

### 2. Dataset Gereksinimleri
| Model Boyutu     | Minimum Veri (örnek sayısı) | Açıklama |
|------------------|----------------------------|--------------|
| Küçük     | 1,000–10,000                    | Türkçe + İngilizce karışık |
| Orta       | 10,000–50,000                             | Daha geniş konu çeşitliliği gerekir |
| Büyük    | 50,000+                           | Çoklu dil ve çok kaynaklı veri |

### 3. Operasyonel Gereksinimler
- **Scraping Frekansı:** 1–3 saatte bir veri güncelleme
- **Dil Desteği:** Türkçe (optimizasyonlu), İngilizce
- **Veri Kaynakları:** Fact-check siteleri, haber ajansları, resmi açıklamalar
- **Güncelleme Süreci:**  
  - Günlük scraping + veri temizleme  
  - Haftalık LoRA/incremental fine-tuning  
  - Aylık model değerlendirme ve iyileştirme
  - 
## 📁 Proje Yapısı

```
truthmark/
├── chrome-extension/     # Tarayıcı eklentisi
├── backend/              # Backend API servisi
├── landing-page/         # Tanıtım web sitesi
└── README.md             # Bu dosya
```

## 📚 Detaylı Dokümantasyon

Her bileşen için detaylı teknik bilgiler ve kurulum talimatları:

- **Chrome Eklentisi**: [chrome-extension/README.md](chrome-extension/README.md)
- **Backend Servisi**: [backend/README.md](backend/README.md)

## 🚀 Hızlı Başlangıç

### Kullanıcılar İçin

1. Chrome eklentisini yükleyin
2. Herhangi bir web sayfasında metin seçin
3. Çift tıklayın veya sağ tıklayıp "Analiz Et" seçin
4. Anında sonuçları görün

### Geliştiriciler İçin

1. Projeyi klonlayın: `git clone https://github.com/Spark-Hubs/Teknofest2025-TruthMark.git`
2. Backend servisi için: [backend/README.md](backend/README.md) talimatlarını takip edin
3. Chrome eklentisi için: [chrome-extension/README.md](chrome-extension/README.md) talimatlarını takip edin

## Veri setimiz

[ai-model/fine-tuning-dataset.jsonl](ai-model/fine-tuning-dataset.jsonl)

## 🌍 Dil Desteği

TruthMark şu anda Türkçe ve İngilizce dillerini desteklemektedir. Türkçe içerik analizi ve Türkçe kullanıcı arayüzü ile Türk kullanıcılar için optimize edilmiştir.

## 🎯 Kullanım Alanları

- **Haber Doğrulama**: Sosyal medyada gördüğünüz haberlerin doğruluğunu kontrol edin
- **Araştırma**: Akademik çalışmalarınızda karşılaştığınız bilgileri doğrulayın
- **Eğitim**: Öğrenciler güvenilir kaynak kontrolü yapabilir
- **İş Hayatı**: Raporlarda kullanacağınız bilgilerin doğruluğunu teyit edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**Daha doğru bir internet için ❤️ ile yapıldı**
