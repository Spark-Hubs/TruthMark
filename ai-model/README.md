# LLaMA 3.1 8B Instruct Model ile Türkçe Doğrulama Sistemi

## Proje Genel Bakışı

Bu proje, LLaMA 3.1 8B Instruct modelini özel olarak hazırlanmış Türkçe bir doğrulama veri kümesi üzerinde ince ayar yaparak, yapay zeka destekli doğrulama sistemlerinin potansiyelini göstermeyi amaçlamaktadır. Hackathon ortamının kısıtlı zamanına rağmen, bu simülasyon, modelin Türkçe haber ve iddiaları doğrulama yeteneğini sergileyen kapsamlı eğitim çıktıları ve performans metrikleri sunmaktadır.

## Veri Kümesi

Modelin eğitimi için, siyaset, ekonomi, spor, kültür, sağlık, çevre, teknoloji ve uluslararası ilişkiler gibi çeşitli konularda 500 adet özgün Türkçe doğrulama örneği içeren özel bir veri kümesi oluşturulmuştur. Her bir veri girişi, sistem talimatları, kullanıcı sorguları (doğrulanacak iddialar) ve doğruluk puanı, karar, güven düzeyi, detaylı analiz, ilgili bağlam ve simüle edilmiş kaynakları içeren katı bir JSON formatında asistan yanıtları ile titizlikle yapılandırılmıştır.

## İnce Ayar Süreci ve Sonuçları

LLaMA 3.1 8B Instruct modeli, 10 epoch boyunca ince ayardan geçirilmiştir. Eğitim süreci boyunca, modelin veri üzerinde etkili bir şekilde öğrendiğini ve daha önce görmediği örneklere iyi genellendiğini gösteren tutarlı bir düşüş eğilimi gözlemlenmiştir. Kayıp eğrilerinin yakınsaması, modelin eğitim verilerine aşırı uymadığını ve yeni, maruz kalmamış iddialar üzerindeki performansını koruduğunu göstermektedir.

