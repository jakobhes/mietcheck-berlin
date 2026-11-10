import type { FeatureTexts } from './types';

const tr: FeatureTexts = {
  /* ---------------- Banyo ---------------- */
  bad_kein_waschbecken: {
    q: 'Banyoda (veya tuvalette) yaklaşık 50 cm’den geniş bir lavabo var mı?',
    help: 'Lavabonun dış kenarını ölçün. Hiç lavabo yoksa veya yalnızca küçük bir el lavabosu varsa (yaklaşık 50 cm’ye kadar, eski formlarda: 50 × 25 cm) “hayır”.',
  },
  bad_wc_keine_lueftung: {
    q: 'Tuvalet odasında pencere veya havalandırma var mı?',
    help: 'Açılabilen bir pencere ya da aspiratör / havalandırma bacası. İkisi de yoksa “hayır”.',
  },
  bad_dielen: {
    q: 'Banyoda ıslak alanlara uygun olmayan ahşap döşeme tahtaları mı var?',
    help: 'Yalıtımsız veya fayanssız klasik ahşap tahtalar. Yalıtılmış, neme dayanıklı zeminler sayılmaz.',
  },
  bad_nicht_beheizbar: {
    q: 'Banyoda kalorifer peteği var mı?',
    help: 'Banyo hiç ısıtılamıyorsa, yalnızca odun/kömür sobasıyla ya da yalnızca elektrikli ısıtıcıyla ısıtılabiliyorsa “hayır”.',
  },
  bad_kein_warmwasser: {
    q: 'Banyoda yeterli sıcak su var mı?',
    help: 'Örneğin merkezi sıcak su veya şofben (Durchlauferhitzer). En fazla küçük bir termosifon (60 litreye kadar) varsa “hayır”.',
  },
  bad_freistehende_wanne: {
    q: 'Yenilenmemiş bir banyoda: eski, serbest duran bir küvet var ve ayrı duş yok mu?',
    help: 'Yenilenmemiş eski binalar için tipik: ayaklı veya serbest duran bir küvet (kaplamalı olsa bile), ayrı duş yok. Modern bir tasarım küveti kastedilmiyor.',
  },
  bad_waende_nicht_gefliest: {
    q: 'Lavabo, küvet ve duş çevresindeki duvarlar fayanslı mı?',
    help: 'Suyun sıçradığı alan. Yalnızca boya veya duvar kâğıdı varsa “hayır”.',
  },
  bad_ohne_fenster: {
    q: 'Banyonun penceresi var mı?',
    help: 'Tuvaletli banyo. Doğu Berlin’de 1973–1990 yapımı prefabrik binalarda pencere olmaması sayılmaz.',
  },
  bad_keine_dusche: {
    q: 'Banyoda düzgün bir şekilde duş alabiliyor musunuz?',
    help: 'Duş başlığı tutucusu, sıçrama koruması (perde veya cam) ve ayakta durmak için yeterli alan var. Bunlardan biri eksikse “hayır”.',
  },
  bad_klein: {
    q: 'Banyo 4 m²’den küçük mü?',
    help: 'Hızlı bir kontrol: banyoda durun ve kollarınızı yana açın. İki duvara da dokunabiliyor musunuz – ve oda yaklaşık iki büyük adımdan uzun değil mi? O zaman muhtemelen 4 m²’den küçüktür. Kesin bilmek için uzunluk × genişliği ölçün. Doğu Berlin’de 1973–1990 yapımı binalar için geçerli değildir.',
  },
  bad_grosses_waschbecken: {
    q: 'Çok büyük bir lavabo (en az 80 cm genişliğinde), çift lavabo veya iki lavabo var mı?',
    help: 'Değeri artırır. Lavabonun dış genişliğini ölçün.',
  },
  bad_hochwertig: {
    q: 'Banyo özellikle yüksek standartta mı donatılmış?',
    help: 'Örneğin üst kalite armatürler, kaliteli banyo mobilyaları, köşe veya yuvarlak küvet, cam duş duvarı, yağmur duşu. Standart donanım sayılmaz.',
  },
  bad_innen_lueftung: {
    q: 'İç banyoda modern, otomatik kontrollü havalandırma var mı?',
    help: 'Örneğin nem sensörlü veya gecikmeli kapanan aspiratör. Basit bir baca sayılmaz.',
  },
  bad_zweites_wc: {
    q: 'İkinci bir tuvalet var mı – ya da banyo ve tuvalet ayrı odalarda mı?',
    help: 'Misafir tuvaleti varsa veya tuvalet ayrı bir odadaysa değeri artırır.',
  },
  bad_gross: {
    q: 'En az bir banyo 8 m²’den büyük mü?',
    help: 'Banyonun taban alanını ölçün. Misafir tuvaletleri sayılmaz.',
  },
  bad_fussbodenheizung: {
    q: 'Banyoda yerden ısıtma var mı?',
    help: 'Banyoda sulu veya elektrikli yerden ısıtma.',
  },
  bad_fliesen_hochwertig: {
    q: 'Banyonun duvar ve zemin kaplamaları kaliteli mi?',
    help: 'Örneğin doğal taş, büyük formatlı porselen seramik veya mozaik. Basit standart fayanslar kaliteli sayılmaz. Kira endeksine göre yeni binalar için geçerli değildir.',
  },
  bad_wandhaengendes_wc: {
    q: 'Tuvalet, rezervuarı duvara gömülü asma klozet mi (veya kaliteli bir yer klozeti mi)?',
    help: 'Yalnızca seramik hazneyi ve sifon düğmesini görürsünüz. Yeni binalarda (endekse göre 2002/2003’ten itibaren) bu standarttır ve sayılmaz – kaliteli bir yer klozeti ise sayılır (2024’ten itibaren).',
  },
  bad_strukturheizkoerper: {
    q: 'Banyoda havlupan var mı?',
    help: 'Havlu asmak için merdiven şeklinde bir petek. 2024’ten itibaren yalnızca 2001’e kadar yapılmış binalarda sayılır – elektrikle de çalışabiliyorsa hariç.',
  },
  bad_separate_dusche: {
    q: 'Küvete ek olarak ayrı bir duş var mı?',
    help: 'Küvetin yanında ayrı bir duş teknesi veya kabini.',
  },
  bad_bodengleiche_dusche: {
    q: 'Duş zeminle aynı seviyede mi (basamaksız veya en fazla 3 cm)?',
    help: 'Yüksek bir tekneyi aşmadan duşa girebilirsiniz.',
  },
  bad_einhebelmischer: {
    q: 'Tek kollu batarya var mı?',
    help: 'Akış ve sıcaklık için tek kollu bir musluk. (Yalnızca kira endeksi 2015, “modern banyo” geçerli değilse.)',
  },

  /* ---------------- Mutfak ---------------- */
  kueche_ohne_fenster: {
    q: 'Mutfakta pencere veya havalandırma var mı?',
    help: 'Bir pencere veya çalışan bir havalandırma sistemi. İkisi de yoksa “hayır”.',
  },
  kueche_kein_herd: {
    q: 'Ev sahibi fırınlı bir ocak sağlıyor mu?',
    help: 'Ev sahibinden ocak yoksa veya ocağın fırını yoksa “hayır”.',
  },
  kueche_keine_spuele: {
    q: 'Mutfakta evye var mı?',
    help: 'Ev sahibinin sağladığı bir evye.',
  },
  kueche_kein_warmwasser: {
    q: 'Mutfak evyesinde sıcak su var mı?',
    help: 'Örneğin merkezi sıcak su, şofben veya evyede küçük bir termosifon.',
  },
  kueche_nicht_beheizbar: {
    q: 'Mutfakta kalorifer peteği var mı?',
    help: 'Mutfak hiç ısıtılamıyorsa veya yalnızca kömür sobasıyla ısıtılabiliyorsa “hayır”.',
  },
  kueche_kein_geschirrspueler: {
    q: 'Mutfakta bulaşık makinesi bağlayabilir misiniz – ya da ev sahibi zaten bir tane taktı mı?',
    help: 'Yer ve su ile gider bağlantısı varsa ya da ev sahibine ait bir bulaşık makinesi zaten bağlıysa “evet”.',
  },
  kueche_keine_wandfliesen: {
    q: 'Ocak ve evyenin arkasındaki duvarda fayans veya sıçrama koruması var mı?',
    help: 'Fayans ya da cam veya plastik bir panel. Yalnızca boya veya duvar kâğıdı varsa “hayır”.',
  },
  kueche_boden: {
    q: 'Mutfağın zemini kaliteli ve iyi durumda mı?',
    help: 'Kaliteli fayans, linolyum, ıslak alan laminatı, parke veya mozaik karo. Basit PVC sayılmaz. 2024’ten itibaren yalnızca 2009’a kadar yapılmış binalarda.',
  },
  kueche_gross: {
    q: 'Mutfak en az 14 m² olan ayrı bir oda mı?',
    help: 'Lütfen mutfağın büyüklüğünü m² olarak belirtin.',
  },
  kueche_einbaukueche: {
    q: 'Ev sahibi üst ve alt dolaplı, ocaklı ve evyeli bir ankastre mutfak sağlıyor mu?',
    help: 'Yalnızca mutfak ev sahibine aitse sayılır – sizin veya önceki kiracının satın aldığı bir mutfak sayılmaz.',
  },
  kueche_ceran: {
    q: 'Seramik cam (vitroseramik) veya indüksiyon ocak var mı?',
    help: 'Pürüzsüz cam seramik pişirme yüzeyi. 2024’ten itibaren yalnızca 2001’e kadar yapılmış binalarda sayılır.',
  },
  kueche_dunstabzug: {
    q: 'Davlumbaz var mı?',
    help: 'Ocağın üstünde, ev sahibinin sağladığı.',
  },
  kueche_kuehlschrank: {
    q: 'Ev sahibi buzdolabı sağlıyor mu (2024’ten itibaren ayrıca: dondurucu veya bulaşık makinesi)?',
    help: 'Yalnızca daireye ait cihazlar, sizinkiler değil.',
  },
  kueche_kochinsel: {
    q: 'Tezgâhlı ve ocaklı veya evyeli serbest duran bir mutfak adası var mı?',
    help: 'Duvara dayalı olmayan bir mutfak bloğu.',
  },

  /* ---------------- Daire ---------------- */
  wohnung_einfachverglasung: {
    q: 'Pencerelerin çoğu yalnızca tek camlı mı?',
    help: 'Tek cam: her pencere kanadında bir cam. Dikkat: kutu pencereler (arka arkaya iki pencere) kastedilmiyor. Lütfen hangi odalar olduğunu belirtin.',
  },
  wohnung_elektro_unzureichend: {
    q: 'Elektrik tesisatı eski veya yetersiz mi?',
    help: 'Örneğin çamaşır makinesi ve elektrik süpürgesi aynı anda çalışınca sigorta atıyor; sigorta kutusunda kaçak akım rölesi (FI-Schalter) yok veya çok az priz var.',
  },
  wohnung_elektro_aufputz: {
    q: 'Elektrik kabloları çoğunlukla duvar üzerinden açıkta mı gidiyor?',
    help: 'Kablolar veya kablo kanalları duvarın içinde değil, sıva üzerinde görünüyor. Lütfen hangi odalar olduğunu belirtin.',
  },
  wohnung_leitungen_aufputz: {
    q: 'Su ve atık su boruları çoğunlukla duvar üzerinden açıkta mı gidiyor?',
    help: 'Banyo, mutfak veya diğer odalarda görünür tesisat. Lütfen hangi odalar olduğunu belirtin.',
  },
  wohnung_keine_waschmaschine: {
    q: 'Banyoda veya mutfakta çamaşır makinesi bağlayabilir misiniz – ya da orada zaten bir tane var mı?',
    help: 'Banyoda veya mutfakta yer ve bağlantı varsa ya da orada zaten bir çamaşır makinesi bağlıysa “evet”. İki odada da mümkün değilse “hayır”.',
  },
  wohnung_schlechter_schnitt: {
    q: 'Dairenin planı kötü mü?',
    help: 'Örneğin “sıkışık oda” (yalnızca başka bir odadan geçilerek ulaşılan) veya geçiş odası.',
  },
  wohnung_kein_balkon: {
    q: 'Balkon, teras, loggia veya kış bahçesi var mı?',
    help: 'Yoksa: balkon yapısal veya hukuki nedenlerle mi mümkün değil (örn. tescilli bina)? O zaman biliyorsanız nedenini belirtin.',
  },
  wohnung_eg_kein_einbruchschutz: {
    q: 'Zemin kat: pencerelerde hırsızlığa veya dışarıdan görünmeye karşı koruma eksik mi?',
    help: 'Zemin kat dairesinin tüm pencerelerinde parmaklık, panjur, pencere alarmı veya benzeri yok.',
  },
  wohnung_kein_kabel: {
    q: 'Kablo TV veya ortak uydu/anten sistemi var mı?',
    help: 'Yalnızca kira endeksi 2015.',
  },
  wohnung_einbauschrank: {
    q: 'Dairede kiler veya gömme dolap var mı?',
    help: 'Ev sahibinin sağladığı bir kiler veya sabit gömme dolap. 2026’dan itibaren: kiler en az 1 m².',
  },
  wohnung_balkon: {
    q: 'Büyük bir balkon, teras, loggia veya kış bahçesi (en az 4 m²) var mı?',
    help: 'Taban alanını ölçün. Daha küçük balkonlar değeri artırmaz.',
  },
  wohnung_fussbodenheizung: {
    q: 'Daire ağırlıklı olarak yerden ısıtmayla mı ısıtılıyor?',
    help: 'Odaların çoğunda. Lütfen hangi odalar olduğunu belirtin.',
  },
  wohnung_stuck: {
    q: 'Oturma odalarının çoğunda iyi durumda alçı süsleme (Stuck) veya ahşap kaplama var mı?',
    help: 'Özenli tavan süslemeleri veya duvar lambrileri. Lütfen hangi odalar olduğunu belirtin.',
  },
  wohnung_heizungsrohre: {
    q: 'Kalorifer boruları çoğunlukla gizli mi (duvarda veya zeminde)?',
    help: '2024’ten itibaren yalnızca 1990’a kadar yapılmış binalarda sayılır.',
  },
  wohnung_rolllaeden: {
    q: 'Pencerelerin çoğunda panjur (veya dış gölgelendirme) var mı?',
    help: 'Oturma odası pencerelerinin çoğunda dış panjur, jaluzi veya tente.',
  },
  wohnung_kaltwasserzaehler: {
    q: 'Dairenin kendi soğuk su sayacı var mı?',
    help: 'Yalnızca eski binalarda ve yalnızca bunun için yan giderler üzerinden kira/leasing bedeli ödemiyorsanız.',
  },
  wohnung_raum_40: {
    q: 'Oturma odalarından biri 40 m²’den büyük mü?',
    help: 'Taban alanı 40 m²’den fazla olan tek bir oda.',
  },
  wohnung_barrierearm: {
    q: 'Daire az engelli / erişilebilir mi?',
    help: 'Daire içinde eşik yok, balkona/terasa alçak eşik, hareket için yeterli alan (örn. yürüteçle).',
  },
  wohnung_parkett: {
    q: 'Oturma odalarının çoğunda kaliteli parke, doğal taş, fayans veya benzeri var mı?',
    help: 'Masif ahşap parke, doğal taş, kaliteli fayans. Laminat veya yıpranmış döşeme tahtaları kaliteli sayılmaz.',
  },
  wohnung_waermeschutzfenster: {
    q: 'Pencerelerin çoğunda modern ısı veya ses yalıtımlı cam var mı?',
    help: 'Yalnızca eski binalarda önemlidir; pencereler orijinal metinde belirtilen yıldan sonra takılmış olmalıdır. Yıl genellikle camlar arasındaki ara çıtaya basılıdır.',
  },
  wohnung_einbruchschutz_tuer: {
    q: 'Daire kapısında ek hırsızlık koruması var mı?',
    help: 'Güçlendirilmiş kapı ve ayrıca örn. emniyet çubuğu veya çok noktalı kilit.',
  },
  wohnung_breitband: {
    q: 'Çift yönlü kablo bağlantısı (kablo üzerinden internet) var mı?',
    help: 'Yalnızca kira endeksi 2015.',
  },

  /* ---------------- Bina ---------------- */
  gebaeude_treppenhaus_schlecht: {
    q: 'Merdiven boşluğu / giriş alanı çoğunlukla kötü durumda mı?',
    help: 'Örneğin dökülen boya, grafiti, bozuk aydınlatma, hasarlı basamaklar. Lütfen son yenileme tarihini ve kusurları belirtin.',
  },
  gebaeude_kein_keller: {
    q: 'Daire dışında size ait bir bodrum veya depo var mı?',
    help: 'Yalnızca size ait (kilitlenebilir) bir alan, ek ücret olmadan.',
  },
  gebaeude_haustuer_offen: {
    q: 'Binanın giriş kapısı kilitlenebiliyor mu?',
    help: 'Herkes her zaman merdiven boşluğuna girebiliyorsa “hayır”.',
  },
  gebaeude_instandhaltung_schlecht: {
    q: 'Binanın bakımı kötü mü?',
    help: 'Örneğin sürekli nemli duvarlar (bodrumda da), cephede büyük sıva hasarları, ciddi çatı hasarları. Lütfen kusurları ve yerlerini açıklayın.',
  },
  gebaeude_seitenfluegel: {
    q: 'Daire, yoğun yapılaşmış bir avludaki yan kanatta veya arka binada mı?',
    help: 'Arka avlulu Berlin eski binaları için tipiktir. Lütfen orada hangi odalar olduğunu belirtin.',
  },
  gebaeude_kein_aufzug_ab5: {
    q: 'Daire 5. katta veya daha yukarıda mı – asansörsüz?',
    help: '2024’ten itibaren: 1949’a kadar yapılmış binalar için geçerli değildir.',
  },
  gebaeude_keine_sprechanlage: {
    q: 'Kapı açma düğmeli bir diafon var mı?',
    help: 'Giriş kapısındaki ziyaretçilerle konuşabilir ve kapıyı dairenizden açabilirsiniz.',
  },
  gebaeude_daemmung_schlecht: {
    q: 'Bina kötü yalıtılmış mı ya da ısıtma sistemi eski ve verimsiz mi?',
    help: 'Isıtma sistemi orijinal metinde belirtilen yıldan önce kurulmuş veya yalıtım yetersiz. Alan ve ısıtma sisteminin yaşı hakkında ayrıntılar yardımcı olur.',
  },
  gebaeude_fahrradraum: {
    q: 'Arsada kilitlenebilir bir bisiklet odası veya bisiklet parkı var mı?',
    help: 'Kolay ulaşılabilir ve yeterince büyük.',
  },
  gebaeude_zusatzraeume: {
    q: 'Ek ortak alanlar var mı (örn. ortak salon, çamaşır kurutma odası, misafir dairesi)?',
    help: 'Daire dışında ortak kullanabileceğiniz alanlar. Lütfen hangileri olduğunu belirtin.',
  },
  gebaeude_garage: {
    q: 'Daireyle birlikte ek ücretsiz bir garaj veya park yeri var mı?',
    help: 'Yalnızca kira endeksi 2015.',
  },
  gebaeude_eingang_repraesentativ: {
    q: 'Giriş / merdiven boşluğu gösterişli mi veya yüksek standartta yenilenmiş mi?',
    help: 'Örneğin mermer, aynalar, özel aydınlatma, merdiven boyunca halı.',
  },
  gebaeude_instandhaltung_gut: {
    q: 'Bina ortalamanın üzerinde iyi durumda mı (örn. yeni cephe, yeni çatı)?',
    help: '2024’ten itibaren: yalnızca 2015’e kadar yapılmış binalarda.',
  },
  gebaeude_einbruchschutz: {
    q: 'Hırsızlığa dayanıklı daire ve bina kapıları var mı?',
    help: 'Yalnızca kira endeksi 2015.',
  },
  gebaeude_videosprechanlage: {
    q: 'Görüntülü diafon var mı?',
    help: 'Dairede ekranlı ve elektrikli kapı açıcılı.',
  },
  gebaeude_aufzug: {
    q: 'Binanın beşten az üst katı olmasına rağmen asansör var mı?',
    help: '2024’ten itibaren: 2010 ve sonrası yapılmış binalarda sayılmaz.',
  },
  gebaeude_schwellenarm: {
    q: 'Binaya ve daireye en fazla bir basamakla ulaşabiliyor musunuz?',
    help: 'Girişte ve daire kapısına kadar en fazla bir basamak.',
  },
  gebaeude_daemmung_gut: {
    q: 'Sonradan yalıtım yapıldı mı veya modern bir ısıtma sistemi kuruldu mu?',
    help: 'Yalnızca eski binalar: orijinal metinde belirtilen tarihten sonra ek cephe/çatı yalıtımı veya yeni ısıtma sistemi.',
  },
  energie_minus_1: {
    q: 'Enerji değeri {{n}} kWh/(m²a) üzerinde',
    help: 'Değeri enerji kimlik belgesinde veya ısınma gideri hesabında bulursunuz. Yalnızca geçerli olan en yüksek kademe sayılır.',
  },
  energie_minus_2: {
    q: 'Enerji değeri {{n}} kWh/(m²a) üzerinde',
    help: 'Değeri enerji kimlik belgesinde veya ısınma gideri hesabında bulursunuz. Yalnızca geçerli olan en yüksek kademe sayılır.',
  },
  energie_minus_3: {
    q: 'Enerji değeri {{n}} kWh/(m²a) üzerinde',
    help: 'Değeri enerji kimlik belgesinde veya ısınma gideri hesabında bulursunuz. Yalnızca geçerli olan en yüksek kademe sayılır.',
  },
  energie_plus_1: {
    q: 'Enerji değeri {{n}} kWh/(m²a) altında',
    help: 'Bina enerji açısından çok verimliyse değeri artırır.',
  },
  energie_plus_2: {
    q: 'Enerji değeri {{n}} kWh/(m²a) altında',
    help: 'Bina enerji açısından çok verimliyse değeri artırır.',
  },
  energie_plus_3: {
    q: 'Enerji değeri {{n}} kWh/(m²a) altında',
    help: 'Bina enerji açısından çok verimliyse değeri artırır.',
  },

  /* ---------------- Çevre ---------------- */
  umfeld_vernachlaessigt: {
    q: 'Daire çok bakımsız bir mahallede mi?',
    help: 'Örneğin harap binalar, çok sayıda boş daire, çöp. Lütfen açıklayın.',
  },
  umfeld_laerm: {
    q: 'Konum özellikle gürültülü mü?',
    help: 'Örneğin ana cadde, demiryolu, havalimanı yakını, ticari veya eğlence gürültüsü. Senato’nun stratejik gürültü haritaları her binanın maruz kaldığı gürültüyü gösterir. Lütfen gürültü türünü belirtin.',
  },
  umfeld_geruch: {
    q: 'Konum özellikle kokulardan etkileniyor mu?',
    help: 'Örneğin işletmelerden, restoranlardan veya sanayiden. Lütfen ne zaman olduğunu belirtin.',
  },
  umfeld_keine_fahrradplaetze: {
    q: 'Arsada bisiklet park edebiliyor musunuz?',
    help: 'Örneğin bisiklet odası veya bisiklet parkı.',
  },
  umfeld_muell: {
    q: 'Çöp alanı dağınık ve açık mı?',
    help: 'Yalnızca kira endeksi 2015.',
  },
  umfeld_citylage: {
    q: 'Daire tercih edilen bir şehir merkezi konumunda mı?',
    help: 'Gösterişli, ülke çapında tanınan alışveriş ve iş caddelerine yakın (örn. Kurfürstendamm, Friedrichstraße).',
  },
  umfeld_ruhig: {
    q: 'Konum özellikle sakin mi?',
    help: 'Örneğin trafiği yavaşlatılmış bir sokak, park kenarı, bariyer babaları veya yol daraltması.',
  },
  umfeld_gestaltet: {
    q: 'Arsa özenle düzenlenmiş mi (oyun alanı, banklar, yeşil alanlar, aydınlatma)?',
    help: 'Basit bir avludan belirgin şekilde fazlası. Lütfen açıklayın.',
  },
  umfeld_parkplatz: {
    q: 'Ev sahibi yakında yeterli otopark sağlıyor mu?',
    help: 'Ev sahibinin sunduğu park yerleri (kamusal sokak parkı değil).',
  },
  umfeld_garten: {
    q: 'Yalnızca size ait bir bahçe – ya da ücretsiz bir kiracı bahçesi var mı?',
    help: 'Daireye ait, doğrudan erişimli bir bahçe veya ücretsiz bir kiracı bahçesi.',
  },
  umfeld_muell_gepflegt: {
    q: 'Yalnızca kiracılara ait, bakımlı ve perdelenmiş bir çöp alanı var mı?',
    help: 'Yalnızca kira endeksi 2015.',
  },
  umfeld_villa: {
    q: 'Villa tarzı bir apartmanda mı oturuyorsunuz?',
    help: 'Yalnızca kira endeksi 2015.',
  },

  /* ---------------- Özel özellikler 2015 ---------------- */
  sm_parkett: {
    q: 'Oturma odalarının çoğunda kaliteli zemin kaplaması?',
    help: 'Parke, doğal taş, kaliteli fayans veya benzeri.',
  },
  sm_kueche: {
    q: 'Modern mutfak donanımı?',
    help: 'Hepsi: dolaplar, ankastre evye, davlumbaz, vitroseramik veya indüksiyon ocak, fırın, çalışma alanında duvar fayansı, buzdolabı.',
  },
  sm_dusche: {
    q: 'Küvetten ayrı duş?',
    help: 'Küvete ek olarak ayrı bir duş.',
  },
  sm_kleines_bad: {
    q: 'Banyo 4 m²’den küçük mü?',
    help: 'Kollarınızı açın: iki duvara da dokunabiliyorsanız ve oda yaklaşık iki büyük adımdan uzun değilse, muhtemelen 4 m²’den küçüktür. Özel özellik olarak yalnızca 1991–2002 yapımı binalarda etkilidir.',
  },
  sm_modernes_bad: {
    q: 'Modern banyo?',
    help: 'Sıçrama alanları fayanslı, zemin fayansı, ankastre küvet/duş, tek kollu batarya, havlupan.',
  },
  sm_isolierverglasung: {
    q: 'Ağırlıklı olarak yalıtımlı cam (1987’den itibaren) veya ses yalıtımlı pencereler?',
    help: '1987’den itibaren takılmış çift camlı pencereler.',
  },
  sm_aufzug: {
    q: 'Binada asansör var mı?',
    help: 'Yolcu asansörü.',
  },
};

export default tr;
