import type { FeatureTexts } from './types';

const es: FeatureTexts = {
  /* ---------------- Baño ---------------- */
  bad_kein_waschbecken: {
    q: '¿Hay en el baño (o en el aseo) un lavabo de más de unos 50 cm de ancho?',
    help: 'Mida el borde exterior del lavabo. «No» si no hay lavabo o solo un pequeño lavamanos (hasta unos 50 cm; en formularios antiguos: 50 × 25 cm).',
  },
  bad_wc_keine_lueftung: {
    q: '¿Tiene el aseo una ventana o ventilación?',
    help: 'Una ventana que se abre, o un extractor / conducto de ventilación. «No» si no hay ninguna de las dos cosas.',
  },
  bad_dielen: {
    q: '¿Tiene el baño un suelo de tablas de madera no apto para zonas húmedas?',
    help: 'Tablas de madera clásicas sin sellar ni azulejos. Los suelos sellados y resistentes a la humedad no cuentan.',
  },
  bad_nicht_beheizbar: {
    q: '¿Hay un radiador en el baño?',
    help: '«No» si el baño no se puede calentar en absoluto, solo con una estufa de leña/carbón o solo con un calefactor eléctrico de infrarrojos.',
  },
  bad_kein_warmwasser: {
    q: '¿Hay suficiente agua caliente en el baño?',
    help: 'Por ejemplo agua caliente central o un calentador instantáneo (Durchlauferhitzer). «No» si como mucho hay un termo pequeño (hasta 60 litros).',
  },
  bad_freistehende_wanne: {
    q: 'En un baño sin renovar: ¿hay una bañera antigua exenta y ninguna ducha aparte?',
    help: 'Típico de edificios antiguos sin renovar: una bañera con patas o exenta (aunque tenga revestimiento), sin ducha aparte. No se refiere a una bañera de diseño moderna.',
  },
  bad_waende_nicht_gefliest: {
    q: '¿Están alicatadas las paredes alrededor del lavabo, la bañera y la ducha?',
    help: 'La zona donde salpica el agua. «No» si solo hay pintura o papel pintado.',
  },
  bad_ohne_fenster: {
    q: '¿Tiene ventana el baño?',
    help: 'El baño con inodoro. En edificios prefabricados de 1973–1990 en Berlín Este, la falta de ventana no cuenta.',
  },
  bad_keine_dusche: {
    q: '¿Se puede duchar bien en el baño?',
    help: 'Hay soporte para el rociador, protección contra salpicaduras (cortina o mampara) y espacio suficiente para estar de pie. «No» si falta algo de esto.',
  },
  bad_klein: {
    q: '¿Mide el baño menos de 4 m²?',
    help: 'Una comprobación rápida: póngase en el baño y estire los brazos a los lados. ¿Toca ambas paredes y el baño no es más largo que unos dos pasos grandes? Entonces probablemente mide menos de 4 m². Para saberlo con exactitud, mida largo × ancho. No se aplica a edificios de 1973–1990 en Berlín Este.',
  },
  bad_grosses_waschbecken: {
    q: '¿Hay un lavabo muy grande (al menos 80 cm de ancho), un lavabo doble o dos lavabos?',
    help: 'Aumenta el valor. Mida el ancho exterior del lavabo.',
  },
  bad_hochwertig: {
    q: '¿Está el baño equipado con un nivel especialmente alto?',
    help: 'Por ejemplo grifería de primera calidad, muebles de baño de calidad, bañera de esquina o redonda, mampara de cristal, ducha de lluvia. El equipamiento estándar no cuenta.',
  },
  bad_innen_lueftung: {
    q: '¿Tiene el baño interior una ventilación moderna con control automático?',
    help: 'Por ejemplo un extractor con sensor de humedad o temporizador. Un simple conducto no cuenta.',
  },
  bad_zweites_wc: {
    q: '¿Hay un segundo inodoro, o están el baño y el inodoro en habitaciones separadas?',
    help: 'Aumenta el valor si hay un aseo de invitados o el inodoro está en un cuarto propio.',
  },
  bad_gross: {
    q: '¿Mide al menos un baño más de 8 m²?',
    help: 'Mida la superficie del suelo del baño. Los aseos de invitados no cuentan.',
  },
  bad_fussbodenheizung: {
    q: '¿Tiene el baño calefacción por suelo radiante?',
    help: 'Suelo radiante de agua o eléctrico en el baño.',
  },
  bad_fliesen_hochwertig: {
    q: '¿Son de alta calidad los revestimientos de paredes y suelo del baño?',
    help: 'Por ejemplo piedra natural, gres porcelánico de gran formato o mosaico. Los azulejos estándar sencillos no son de alta calidad. Según el índice de alquileres, no se aplica a edificios más nuevos.',
  },
  bad_wandhaengendes_wc: {
    q: '¿Es el inodoro suspendido con la cisterna empotrada en la pared (o un inodoro de pie de alta calidad)?',
    help: 'Solo se ven la taza de cerámica y el pulsador. En edificios más nuevos (desde 2002/2003 según el índice) es estándar y no cuenta; un inodoro de pie de alta calidad sí (desde 2024).',
  },
  bad_strukturheizkoerper: {
    q: '¿Hay un radiador toallero en el baño?',
    help: 'Un radiador en forma de escalera para colgar toallas. Desde 2024 solo cuenta en edificios hasta 2001, salvo que también funcione eléctricamente.',
  },
  bad_separate_dusche: {
    q: '¿Hay una ducha aparte además de la bañera?',
    help: 'Un plato o cabina de ducha propios, además de la bañera.',
  },
  bad_bodengleiche_dusche: {
    q: '¿Está la ducha a ras de suelo (sin escalón o como máximo 3 cm)?',
    help: 'Se puede entrar en la ducha sin pasar por encima de un plato alto.',
  },
  bad_einhebelmischer: {
    q: '¿Hay un grifo monomando?',
    help: 'Un grifo con una sola palanca para caudal y temperatura. (Solo índice de alquileres 2015, si no se aplica «baño moderno».)',
  },

  /* ---------------- Cocina ---------------- */
  kueche_ohne_fenster: {
    q: '¿Tiene la cocina una ventana o ventilación?',
    help: 'Una ventana o un sistema de extracción que funcione. «No» si no hay ninguna de las dos cosas.',
  },
  kueche_kein_herd: {
    q: '¿Pone el arrendador una cocina con horno?',
    help: '«No» si el arrendador no pone cocina o la cocina no tiene horno.',
  },
  kueche_keine_spuele: {
    q: '¿Hay un fregadero en la cocina?',
    help: 'Un fregadero puesto por el arrendador.',
  },
  kueche_kein_warmwasser: {
    q: '¿Hay agua caliente en el fregadero de la cocina?',
    help: 'Por ejemplo agua caliente central, un calentador instantáneo o un termo pequeño en el fregadero.',
  },
  kueche_nicht_beheizbar: {
    q: '¿Hay un radiador en la cocina?',
    help: '«No» si la cocina no se puede calentar en absoluto o solo con una estufa de carbón.',
  },
  kueche_kein_geschirrspueler: {
    q: '¿Se puede conectar un lavavajillas en la cocina, o ya lo ha instalado el arrendador?',
    help: '«Sí» si hay espacio y toma de agua y desagüe, o si ya hay conectado un lavavajillas del arrendador.',
  },
  kueche_keine_wandfliesen: {
    q: '¿Hay azulejos o protección contra salpicaduras en la pared detrás de la cocina y el fregadero?',
    help: 'Azulejos o un panel de cristal o plástico. «No» si solo hay pintura o papel pintado.',
  },
  kueche_boden: {
    q: '¿Tiene la cocina un suelo de alta calidad en buen estado?',
    help: 'Azulejos de calidad, linóleo, laminado para zonas húmedas, parqué o terrazo. El PVC sencillo no cuenta. Desde 2024 solo en edificios hasta 2009.',
  },
  kueche_gross: {
    q: '¿Es la cocina una habitación aparte de al menos 14 m²?',
    help: 'Indique el tamaño de la cocina en m², por favor.',
  },
  kueche_einbaukueche: {
    q: '¿Pone el arrendador una cocina equipada con muebles altos y bajos, cocina y fregadero?',
    help: 'Solo cuenta si la cocina pertenece al arrendador, no si la compró usted o el inquilino anterior.',
  },
  kueche_ceran: {
    q: '¿Hay una placa vitrocerámica o de inducción?',
    help: 'Una superficie de cocción lisa de vitrocerámica. Desde 2024 solo cuenta en edificios hasta 2001.',
  },
  kueche_dunstabzug: {
    q: '¿Hay una campana extractora?',
    help: 'Encima de la cocina, puesta por el arrendador.',
  },
  kueche_kuehlschrank: {
    q: '¿Pone el arrendador un frigorífico (desde 2024 también: congelador o lavavajillas)?',
    help: 'Solo aparatos que pertenecen a la vivienda, no los suyos propios.',
  },
  kueche_kochinsel: {
    q: '¿Hay una isla de cocina independiente con encimera y placa o fregadero?',
    help: 'Un bloque de cocina que no está pegado a la pared.',
  },

  /* ---------------- Vivienda ---------------- */
  wohnung_einfachverglasung: {
    q: '¿Tienen la mayoría de las ventanas un solo cristal?',
    help: 'Vidrio simple: un cristal por hoja de ventana. Ojo: no se refiere a las ventanas dobles de cajón (dos ventanas una detrás de otra). Indique en qué habitaciones, por favor.',
  },
  wohnung_elektro_unzureichend: {
    q: '¿Es la instalación eléctrica anticuada o insuficiente?',
    help: 'Por ejemplo salta el fusible cuando funcionan a la vez la lavadora y la aspiradora; no hay diferencial (FI-Schalter) en el cuadro eléctrico, o hay muy pocos enchufes.',
  },
  wohnung_elektro_aufputz: {
    q: '¿Van los cables eléctricos mayoritariamente vistos sobre la pared?',
    help: 'Los cables o canaletas se ven sobre el revoque en lugar de ir dentro de la pared. Indique en qué habitaciones, por favor.',
  },
  wohnung_leitungen_aufputz: {
    q: '¿Van las tuberías de agua y desagüe mayoritariamente vistas sobre la pared?',
    help: 'Tuberías visibles en el baño, la cocina u otras habitaciones. Indique en qué habitaciones, por favor.',
  },
  wohnung_keine_waschmaschine: {
    q: '¿Se puede conectar una lavadora en el baño o en la cocina, o ya hay una allí?',
    help: '«Sí» si hay espacio y toma en el baño o en la cocina, o si ya hay una lavadora conectada allí. «No» si no es posible en ninguno de los dos.',
  },
  wohnung_schlechter_schnitt: {
    q: '¿Tiene la vivienda una mala distribución?',
    help: 'Por ejemplo una «habitación cautiva» (solo accesible a través de otra habitación) o una habitación de paso.',
  },
  wohnung_kein_balkon: {
    q: '¿Hay un balcón, terraza, loggia o galería acristalada?',
    help: 'Si no: ¿sería imposible un balcón por motivos constructivos o legales (p. ej. edificio protegido)? Entonces indique el motivo si lo conoce.',
  },
  wohnung_eg_kein_einbruchschutz: {
    q: 'Planta baja: ¿faltan protecciones antirrobo o contra miradas en las ventanas?',
    help: 'Ni rejas, ni persianas, ni alarma de ventana ni similar en todas las ventanas de la vivienda de planta baja.',
  },
  wohnung_kein_kabel: {
    q: '¿Hay televisión por cable o una instalación colectiva de satélite/antena?',
    help: 'Solo índice de alquileres 2015.',
  },
  wohnung_einbauschrank: {
    q: '¿Hay un trastero o un armario empotrado en la vivienda?',
    help: 'Un trastero o un armario empotrado fijo puesto por el arrendador. Desde 2026: trastero de al menos 1 m².',
  },
  wohnung_balkon: {
    q: '¿Hay un balcón, terraza, loggia o galería acristalada grande (al menos 4 m²)?',
    help: 'Mida la superficie. Los balcones más pequeños no aumentan el valor.',
  },
  wohnung_fussbodenheizung: {
    q: '¿Se calienta la vivienda principalmente con suelo radiante?',
    help: 'En la mayoría de las habitaciones. Indique en qué habitaciones, por favor.',
  },
  wohnung_stuck: {
    q: '¿Tienen la mayoría de las habitaciones estucos o revestimientos de madera en buen estado?',
    help: 'Decoraciones de techo elaboradas o paneles de pared. Indique en qué habitaciones, por favor.',
  },
  wohnung_heizungsrohre: {
    q: '¿Van los tubos de calefacción mayoritariamente ocultos (en pared o suelo)?',
    help: 'Desde 2024 solo cuenta en edificios hasta 1990.',
  },
  wohnung_rolllaeden: {
    q: '¿Hay persianas (o protección solar exterior) en la mayoría de las ventanas?',
    help: 'Persianas exteriores, estores o toldos en la mayoría de las ventanas de las habitaciones.',
  },
  wohnung_kaltwasserzaehler: {
    q: '¿Tiene la vivienda su propio contador de agua fría?',
    help: 'Solo en edificios más antiguos y solo si usted no paga alquiler/leasing por él a través de los gastos de comunidad.',
  },
  wohnung_raum_40: {
    q: '¿Mide alguna habitación más de 40 m²?',
    help: 'Una sola habitación con más de 40 m² de superficie.',
  },
  wohnung_barrierearm: {
    q: '¿Es la vivienda de pocas barreras / accesible?',
    help: 'Sin umbrales dentro de la vivienda, umbral bajo hacia el balcón/terraza, espacio suficiente para moverse (p. ej. con andador).',
  },
  wohnung_parkett: {
    q: '¿Tienen la mayoría de las habitaciones parqué de calidad, piedra natural, azulejos o similar?',
    help: 'Parqué macizo, piedra natural, azulejos de calidad. El laminado o las tablas desgastadas no son de alta calidad.',
  },
  wohnung_waermeschutzfenster: {
    q: '¿Tienen la mayoría de las ventanas un acristalamiento moderno con aislamiento térmico o acústico?',
    help: 'Solo relevante en edificios más antiguos; las ventanas deben haberse instalado después del año indicado en el texto original. El año suele estar grabado en el separador entre los cristales.',
  },
  wohnung_einbruchschutz_tuer: {
    q: '¿Tiene la puerta de la vivienda protección antirrobo adicional?',
    help: 'Puerta reforzada y además p. ej. barra de seguridad o cierre multipunto.',
  },
  wohnung_breitband: {
    q: '¿Hay una conexión de cable bidireccional (internet por cable)?',
    help: 'Solo índice de alquileres 2015.',
  },

  /* ---------------- Edificio ---------------- */
  gebaeude_treppenhaus_schlecht: {
    q: '¿Están la escalera / la zona de entrada mayoritariamente en mal estado?',
    help: 'Por ejemplo pintura desconchada, grafitis, iluminación rota, escalones dañados. Indique la fecha de la última renovación y los defectos, por favor.',
  },
  gebaeude_kein_keller: {
    q: '¿Tiene usted su propio sótano o trastero fuera de la vivienda?',
    help: 'Un espacio (con cerradura) solo para usted, sin coste adicional.',
  },
  gebaeude_haustuer_offen: {
    q: '¿Se puede cerrar con llave la puerta de entrada del edificio?',
    help: '«No» si cualquiera puede entrar en la escalera en cualquier momento.',
  },
  gebaeude_instandhaltung_schlecht: {
    q: '¿Está el edificio en mal estado de conservación?',
    help: 'Por ejemplo paredes permanentemente húmedas (también en el sótano), grandes daños de revoque en la fachada, daños considerables en el tejado. Describa los defectos y su ubicación, por favor.',
  },
  gebaeude_seitenfluegel: {
    q: '¿Está la vivienda en un ala lateral o un edificio trasero de un patio densamente edificado?',
    help: 'Típico de los edificios antiguos de Berlín con patios traseros. Indique qué habitaciones están allí, por favor.',
  },
  gebaeude_kein_aufzug_ab5: {
    q: '¿Está la vivienda en la 5.ª planta o más arriba, sin ascensor?',
    help: 'Desde 2024: no se aplica a edificios construidos hasta 1949.',
  },
  gebaeude_keine_sprechanlage: {
    q: '¿Hay un portero automático con abrepuertas?',
    help: 'Puede hablar con las visitas en la puerta de entrada y abrirla desde su vivienda.',
  },
  gebaeude_daemmung_schlecht: {
    q: '¿Está el edificio mal aislado o la calefacción es vieja e ineficiente?',
    help: 'La calefacción se instaló antes del año indicado en el texto original, o el aislamiento es insuficiente. Ayudan los detalles sobre la zona y la antigüedad de la calefacción.',
  },
  gebaeude_fahrradraum: {
    q: '¿Hay un cuarto para bicicletas con cerradura o aparcabicis en la finca?',
    help: 'De fácil acceso y suficientemente grande.',
  },
  gebaeude_zusatzraeume: {
    q: '¿Hay espacios comunes adicionales (p. ej. sala común, tendedero, vivienda de invitados)?',
    help: 'Espacios utilizables fuera de la vivienda que puede usar compartidos. Indique cuáles, por favor.',
  },
  gebaeude_garage: {
    q: '¿Viene con la vivienda un garaje o plaza de aparcamiento sin coste adicional?',
    help: 'Solo índice de alquileres 2015.',
  },
  gebaeude_eingang_repraesentativ: {
    q: '¿Es la entrada / escalera representativa o renovada con un nivel alto?',
    help: 'Por ejemplo mármol, espejos, iluminación especial, alfombra en toda la escalera.',
  },
  gebaeude_instandhaltung_gut: {
    q: '¿Está el edificio en un estado por encima de la media (p. ej. fachada nueva, tejado nuevo)?',
    help: 'Desde 2024: solo en edificios hasta 2015.',
  },
  gebaeude_einbruchschutz: {
    q: '¿Hay puertas de vivienda y de edificio antirrobo?',
    help: 'Solo índice de alquileres 2015.',
  },
  gebaeude_videosprechanlage: {
    q: '¿Hay un videoportero?',
    help: 'Con pantalla en la vivienda y abrepuertas eléctrico.',
  },
  gebaeude_aufzug: {
    q: '¿Hay ascensor aunque el edificio tenga menos de cinco plantas altas?',
    help: 'Desde 2024: no cuenta en edificios a partir de 2010.',
  },
  gebaeude_schwellenarm: {
    q: '¿Se puede llegar al edificio y a la vivienda con como máximo un escalón?',
    help: 'Como máximo un escalón en la entrada y hasta la puerta de la vivienda.',
  },
  gebaeude_daemmung_gut: {
    q: '¿Se añadió aislamiento posteriormente o se instaló una calefacción moderna?',
    help: 'Solo edificios más antiguos: aislamiento adicional de fachada/tejado o una calefacción nueva después de la fecha indicada en el texto original.',
  },
  energie_minus_1: {
    q: 'Valor energético superior a {{n}} kWh/(m²a)',
    help: 'El valor figura en el certificado energético o en la liquidación de calefacción. Solo cuenta el nivel más alto que se aplique.',
  },
  energie_minus_2: {
    q: 'Valor energético superior a {{n}} kWh/(m²a)',
    help: 'El valor figura en el certificado energético o en la liquidación de calefacción. Solo cuenta el nivel más alto que se aplique.',
  },
  energie_minus_3: {
    q: 'Valor energético superior a {{n}} kWh/(m²a)',
    help: 'El valor figura en el certificado energético o en la liquidación de calefacción. Solo cuenta el nivel más alto que se aplique.',
  },
  energie_plus_1: {
    q: 'Valor energético inferior a {{n}} kWh/(m²a)',
    help: 'Aumenta el valor si el edificio es muy eficiente energéticamente.',
  },
  energie_plus_2: {
    q: 'Valor energético inferior a {{n}} kWh/(m²a)',
    help: 'Aumenta el valor si el edificio es muy eficiente energéticamente.',
  },
  energie_plus_3: {
    q: 'Valor energético inferior a {{n}} kWh/(m²a)',
    help: 'Aumenta el valor si el edificio es muy eficiente energéticamente.',
  },

  /* ---------------- Entorno ---------------- */
  umfeld_vernachlaessigt: {
    q: '¿Está la vivienda en un barrio muy descuidado?',
    help: 'Por ejemplo edificios en ruinas, muchas viviendas vacías, basura. Descríbalo, por favor.',
  },
  umfeld_laerm: {
    q: '¿Es la ubicación especialmente ruidosa?',
    help: 'Por ejemplo una calle principal, vías de tren, cerca de un aeropuerto, ruido comercial o de ocio nocturno. Los mapas estratégicos de ruido del Senado muestran la exposición de cada edificio. Indique el tipo de ruido, por favor.',
  },
  umfeld_geruch: {
    q: '¿Es la ubicación especialmente afectada por olores?',
    help: 'Por ejemplo de comercios, restaurantes o industria. Indique cuándo, por favor.',
  },
  umfeld_keine_fahrradplaetze: {
    q: '¿Se pueden aparcar bicicletas en la finca?',
    help: 'Por ejemplo un cuarto para bicicletas o aparcabicis.',
  },
  umfeld_muell: {
    q: '¿Está la zona de contenedores desordenada y abierta?',
    help: 'Solo índice de alquileres 2015.',
  },
  umfeld_citylage: {
    q: '¿Está la vivienda en una ubicación céntrica preferente?',
    help: 'Cerca de calles comerciales y de negocios representativas y conocidas en todo el país (p. ej. Kurfürstendamm, Friedrichstraße).',
  },
  umfeld_ruhig: {
    q: '¿Es la ubicación especialmente tranquila?',
    help: 'Por ejemplo una calle de tráfico calmado, junto a un parque, bolardos o estrechamiento de calzada.',
  },
  umfeld_gestaltet: {
    q: '¿Está la finca cuidadosamente ajardinada (parque infantil, bancos, zonas verdes, iluminación)?',
    help: 'Claramente más que un patio sencillo. Descríbalo, por favor.',
  },
  umfeld_parkplatz: {
    q: '¿Pone el arrendador suficientes plazas de aparcamiento cerca?',
    help: 'Aparcamiento ofrecido por el arrendador (no aparcamiento público en la calle).',
  },
  umfeld_garten: {
    q: '¿Hay un jardín solo para usted, o un jardín de inquilinos gratuito?',
    help: 'Un jardín que pertenece a la vivienda con acceso directo, o un jardín de inquilinos sin coste.',
  },
  umfeld_muell_gepflegt: {
    q: '¿Hay una zona de contenedores cuidada y protegida solo para los inquilinos?',
    help: 'Solo índice de alquileres 2015.',
  },
  umfeld_villa: {
    q: '¿Vive usted en un edificio de viviendas de estilo villa?',
    help: 'Solo índice de alquileres 2015.',
  },

  /* ---------------- Características especiales 2015 ---------------- */
  sm_parkett: {
    q: '¿Suelo de alta calidad en la mayoría de las habitaciones?',
    help: 'Parqué, piedra natural, azulejos de calidad o similar.',
  },
  sm_kueche: {
    q: '¿Equipamiento de cocina moderno?',
    help: 'Todo lo siguiente: armarios, fregadero empotrado, campana extractora, cocina con placa vitrocerámica o de inducción, horno, azulejos en la zona de trabajo, frigorífico.',
  },
  sm_dusche: {
    q: '¿Ducha separada de la bañera?',
    help: 'Una ducha propia además de la bañera.',
  },
  sm_kleines_bad: {
    q: '¿Mide el baño menos de 4 m²?',
    help: 'Estire los brazos: si toca ambas paredes y el baño no es más largo que unos dos pasos grandes, probablemente mide menos de 4 m². Solo tiene efecto como característica especial en edificios de 1991–2002.',
  },
  sm_modernes_bad: {
    q: '¿Baño moderno?',
    help: 'Zonas de salpicadura alicatadas, suelo de azulejos, bañera/ducha empotrada, grifo monomando, radiador toallero.',
  },
  sm_isolierverglasung: {
    q: '¿Mayoritariamente doble acristalamiento (desde 1987) o ventanas insonorizadas?',
    help: 'Ventanas de doble cristal instaladas a partir de 1987.',
  },
  sm_aufzug: {
    q: '¿Hay ascensor en el edificio?',
    help: 'Ascensor de personas.',
  },
};

export default es;
