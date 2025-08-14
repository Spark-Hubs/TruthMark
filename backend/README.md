# Backend Service

Bu proje, Google Search API kullanarak haber verilerini çeken ve haberlerin detaylarını scraping ile zenginleştiren FastAPI tabanlı bir backend servisidir.

---

## Teknolojiler

- **Python 3.12+**
- **FastAPI**: Hızlı ve modern API geliştirme çatısı
- **HTTPX**: Asenkron HTTP istemcisi, Google API çağrıları ve scraping için kullanılır
- **BeautifulSoup4**: HTML parsing ve scraping işlemleri için
- **Pydantic**: Veri doğrulama ve şema tanımlama için
- **Uvicorn**: ASGI server, uygulamanın çalıştırılması için
- **dotenv**: Ortam değişkenleri yönetimi (`.env` dosyası)

---

## Proje Yapısı

```
backend/
├── app/
│   ├── api/
│   │   └── routes.py          # API route tanımları
│   ├── core/
│   │   └── config.py          # Ortam değişkenleri ve konfigürasyon
│   ├── schemas/
│   │   └── search_news.py     # Pydantic modelleri (response ve request şemaları)
│   ├── services/
│   │   └── search_news.py     # Google API çağrıları ve scraping servisleri
│   ├── main.py                # FastAPI uygulaması giriş noktası
├── Makefile                   # Makefile komutları (geliştirme ve test için)
├── pyproject.toml             # Proje bağımlılıkları ve yapılandırma
└── README.md                  # Proje açıklaması (bu dosya)
```

---

## Kurulum ve Kullanım

### 1. Ortam Değişkenlerini Ayarlayın

`.env` dosyanıza Google API anahtarınızı ekleyin:

```env
GOOGLE_API_KEY=your_api_key_here
```

### 2. Bağımlılıkları Yükleyin

```bash
uv sync
```

### 3. Uygulamayı Başlatın

```bash
make start
```

### 4. API'yi Test Edin

```bash
GET /news?q=arama_kelimesi
```

---

## Özellikler

- **Asenkron Haber Çekme**: Google Search API ile güncel haberleri asenkron olarak çekme
- **İçerik Zenginleştirme**: Haber içeriklerini scraping ile detaylandırma (HTML parsing ile metin çekme)
- **Veri Doğrulama**: Sağlam Pydantic modelleri ile veri doğrulama ve otomatik dökümantasyon
- **Modüler Yapı**: Basit ve modüler proje yapısı sayesinde kolay genişletilebilirlik

---
