import type { FeatureTexts } from './types';

const en: FeatureTexts = {
  /* ---------------- Bathroom ---------------- */
  bad_kein_waschbecken: {
    q: 'Is there a washbasin in the bathroom (or toilet) wider than about 50 cm?',
    help: 'Measure the outer edge of the basin. “No” if there is no basin at all or only a small hand basin (up to about 50 cm, older forms: 50 × 25 cm).',
  },
  bad_wc_keine_lueftung: {
    q: 'Does the toilet room have a window or ventilation?',
    help: 'A window that opens, or an extractor fan / ventilation shaft. “No” if there is neither.',
  },
  bad_dielen: {
    q: 'Does the bathroom have wooden floorboards that are not suitable for wet rooms?',
    help: 'Classic wooden boards without sealing or tiles. Sealed, moisture-proof floors do not count.',
  },
  bad_nicht_beheizbar: {
    q: 'Is there a radiator in the bathroom?',
    help: '“No” if the bathroom cannot be heated at all, only with a wood/coal stove, or only with an electric radiant heater.',
  },
  bad_kein_warmwasser: {
    q: 'Is there enough hot water in the bathroom?',
    help: 'For example central hot water or an instantaneous water heater (Durchlauferhitzer). “No” if there is at most a small boiler (up to 60 litres).',
  },
  bad_freistehende_wanne: {
    q: 'In an unrenovated bathroom: is there an old free-standing bathtub and no separate shower?',
    help: 'Typical for unrenovated old buildings: a tub on feet or standing free (even with panelling), no separate shower. A modern designer tub is not meant.',
  },
  bad_waende_nicht_gefliest: {
    q: 'Are the walls around the basin, tub and shower tiled?',
    help: 'The area where water splashes. “No” if there is only paint or wallpaper.',
  },
  bad_ohne_fenster: {
    q: 'Does the bathroom have a window?',
    help: 'The bathroom with toilet. For prefab buildings built 1973–1990 in East Berlin a missing window does not count.',
  },
  bad_keine_dusche: {
    q: 'Can you take a proper shower in the bathroom?',
    help: 'There is a shower-head holder, a splash guard (curtain or glass) and enough room to stand. “No” if any of this is missing.',
  },
  bad_klein: {
    q: 'Is the bathroom smaller than 4 m²?',
    help: 'A quick check: stand in the bathroom and stretch your arms out to the sides. Can you touch both walls – and is the room no longer than about two big steps? Then it is probably smaller than 4 m². To be exact, measure length × width. Does not apply to buildings from 1973–1990 in East Berlin.',
  },
  bad_grosses_waschbecken: {
    q: 'Is there a very large basin (at least 80 cm wide), a double basin or two basins?',
    help: 'Increases the value. Measure the outer width of the basin.',
  },
  bad_hochwertig: {
    q: 'Is the bathroom fitted to a particularly high standard?',
    help: 'For example premium fittings, high-quality bathroom furniture, corner or round tub, glass shower wall, rain shower. Standard fittings do not count.',
  },
  bad_innen_lueftung: {
    q: 'Does the interior bathroom have modern, automatically controlled ventilation?',
    help: 'For example a fan with humidity sensor or run-on timer. A simple shaft does not count.',
  },
  bad_zweites_wc: {
    q: 'Is there a second toilet – or are bathroom and toilet in separate rooms?',
    help: 'Increases the value if there is a guest toilet or the toilet is in its own room.',
  },
  bad_gross: {
    q: 'Is at least one bathroom larger than 8 m²?',
    help: 'Measure the bathroom floor area. Guest toilets do not count.',
  },
  bad_fussbodenheizung: {
    q: 'Does the bathroom have underfloor heating?',
    help: 'Water-based or electric underfloor heating in the bathroom.',
  },
  bad_fliesen_hochwertig: {
    q: 'Are the bathroom wall and floor coverings of high quality?',
    help: 'For example natural stone, large-format porcelain tiles or mosaic. Basic standard tiles are not high quality. Depending on the rent index this does not apply to newer buildings.',
  },
  bad_wandhaengendes_wc: {
    q: 'Is the toilet wall-hung with the cistern hidden in the wall (or a high-quality floor-standing toilet)?',
    help: 'You only see the ceramic bowl and the flush plate. In newer buildings (from 2002/2003 depending on the index) this is standard and does not count – a high-quality floor-standing toilet does (from 2024).',
  },
  bad_strukturheizkoerper: {
    q: 'Is there a towel radiator (ladder radiator) in the bathroom?',
    help: 'A ladder-style radiator for hanging towels. From 2024 it only counts for buildings up to 2001 – unless it can also be run electrically.',
  },
  bad_separate_dusche: {
    q: 'Is there a separate shower in addition to the bathtub?',
    help: 'Its own shower tray or cubicle, besides the tub.',
  },
  bad_bodengleiche_dusche: {
    q: 'Is the shower level with the floor (no step or max. 3 cm)?',
    help: 'You can walk into the shower without stepping over a high tray.',
  },
  bad_einhebelmischer: {
    q: 'Is there a single-lever mixer tap?',
    help: 'A tap with one lever for flow and temperature. (Rent index 2015 only, if “modern bathroom” does not apply.)',
  },

  /* ---------------- Kitchen ---------------- */
  kueche_ohne_fenster: {
    q: 'Does the kitchen have a window or ventilation?',
    help: 'A window or a working extraction system. “No” if there is neither.',
  },
  kueche_kein_herd: {
    q: 'Does the landlord provide a cooker with an oven?',
    help: '“No” if there is no cooker from the landlord or the cooker has no oven.',
  },
  kueche_keine_spuele: {
    q: 'Is there a sink in the kitchen?',
    help: 'A sink provided by the landlord.',
  },
  kueche_kein_warmwasser: {
    q: 'Is there hot water at the kitchen sink?',
    help: 'For example central hot water, an instantaneous water heater or a small boiler at the sink.',
  },
  kueche_nicht_beheizbar: {
    q: 'Is there a radiator in the kitchen?',
    help: '“No” if the kitchen cannot be heated at all or only with a coal stove.',
  },
  kueche_kein_geschirrspueler: {
    q: 'Can you connect a dishwasher in the kitchen?',
    help: 'There is space for it and a water and drain connection.',
  },
  kueche_keine_wandfliesen: {
    q: 'Are there tiles or a splash guard on the wall behind the cooker and sink?',
    help: 'Tiles or a glass or plastic panel. “No” if there is only paint or wallpaper.',
  },
  kueche_boden: {
    q: 'Does the kitchen have a high-quality floor in good condition?',
    help: 'High-quality tiles, linoleum, wet-room laminate, parquet or terrazzo. Basic PVC does not count. From 2024 only for buildings up to 2009.',
  },
  kueche_gross: {
    q: 'Is the kitchen a separate room of at least 14 m²?',
    help: 'Please state the kitchen size in m².',
  },
  kueche_einbaukueche: {
    q: 'Does the landlord provide a fitted kitchen with wall and base units, cooker and sink?',
    help: 'Only counts if the kitchen belongs to the landlord – not one you or the previous tenant bought.',
  },
  kueche_ceran: {
    q: 'Is there a ceramic glass or induction hob?',
    help: 'A smooth glass-ceramic cooking surface. From 2024 this only counts for buildings up to 2001.',
  },
  kueche_dunstabzug: {
    q: 'Is there a cooker hood?',
    help: 'Above the cooker, provided by the landlord.',
  },
  kueche_kuehlschrank: {
    q: 'Does the landlord provide a fridge (from 2024 also: freezer or dishwasher)?',
    help: 'Only appliances that belong to the flat, not your own.',
  },
  kueche_kochinsel: {
    q: 'Is there a free-standing kitchen island with worktop and hob or sink?',
    help: 'A kitchen block that does not stand against a wall.',
  },

  /* ---------------- Flat ---------------- */
  wohnung_einfachverglasung: {
    q: 'Do most windows have only a single pane of glass?',
    help: 'Single glazing: one pane per window sash. Note: box windows (two windows one behind the other) are not meant. Please state which rooms.',
  },
  wohnung_elektro_unzureichend: {
    q: 'Is the electrical installation outdated or insufficient?',
    help: 'For example the fuse trips when washing machine and vacuum cleaner run at the same time; there is no residual-current device (RCD/FI switch) in the fuse box, or very few sockets.',
  },
  wohnung_elektro_aufputz: {
    q: 'Do the electric cables mostly run visibly on the wall surface?',
    help: 'Cables or cable ducts are visible on the plaster instead of inside the wall. Please state which rooms.',
  },
  wohnung_leitungen_aufputz: {
    q: 'Do the water and waste pipes mostly run visibly on the wall surface?',
    help: 'Visible plumbing in bathroom, kitchen or other rooms. Please state which rooms.',
  },
  wohnung_keine_waschmaschine: {
    q: 'Can you connect a washing machine in the bathroom or kitchen?',
    help: 'There is space and a connection in the bathroom or kitchen. “No” if this is not possible in either room.',
  },
  wohnung_schlechter_schnitt: {
    q: 'Does the flat have a poor layout?',
    help: 'For example a “trapped room” (only reachable through another room) or a walk-through room.',
  },
  wohnung_kein_balkon: {
    q: 'Is there a balcony, terrace, loggia or conservatory?',
    help: 'If not: would a balcony be impossible for structural or legal reasons (e.g. listed building)? Then please give the reason if known.',
  },
  wohnung_eg_kein_einbruchschutz: {
    q: 'Ground floor: are burglary or privacy protections missing on the windows?',
    help: 'No bars, shutters, window alarm or similar on all windows of the ground-floor flat.',
  },
  wohnung_kein_kabel: {
    q: 'Is there cable TV or a shared satellite/antenna system?',
    help: 'Rent index 2015 only.',
  },
  wohnung_einbauschrank: {
    q: 'Is there a storage room or built-in wardrobe in the flat?',
    help: 'A storage room or fixed built-in cupboard provided by the landlord. From 2026: storage room at least 1 m².',
  },
  wohnung_balkon: {
    q: 'Is there a large balcony, terrace, loggia or conservatory (at least 4 m²)?',
    help: 'Measure the floor area. Smaller balconies do not increase the value.',
  },
  wohnung_fussbodenheizung: {
    q: 'Is the flat mainly heated by underfloor heating?',
    help: 'In most rooms. Please state which rooms.',
  },
  wohnung_stuck: {
    q: 'Do most living rooms have stucco or wood panelling in good condition?',
    help: 'Elaborate ceiling decorations or wall panelling. Please state which rooms.',
  },
  wohnung_heizungsrohre: {
    q: 'Are the heating pipes mostly hidden (in wall or floor)?',
    help: 'From 2024 this only counts for buildings up to 1990.',
  },
  wohnung_rolllaeden: {
    q: 'Are there roller shutters (or external shading) on most windows?',
    help: 'External roller shutters, blinds or awnings on most living-room windows.',
  },
  wohnung_kaltwasserzaehler: {
    q: 'Does the flat have its own cold-water meter?',
    help: 'Only for older buildings and only if you do not pay rental/leasing costs for it via the service charges.',
  },
  wohnung_raum_40: {
    q: 'Is one living room larger than 40 m²?',
    help: 'A single room with more than 40 m² floor area.',
  },
  wohnung_barrierearm: {
    q: 'Is the flat low-barrier / accessible?',
    help: 'No thresholds inside the flat, low threshold to balcony/terrace, enough room to move (e.g. with a walker).',
  },
  wohnung_parkett: {
    q: 'Do most living rooms have high-quality parquet, natural stone, tiles or similar?',
    help: 'Solid wood parquet, natural stone, high-quality tiles. Laminate or worn floorboards are not high quality.',
  },
  wohnung_waermeschutzfenster: {
    q: 'Do most windows have modern thermal or sound-insulating glazing?',
    help: 'Only relevant for older buildings; the windows must have been installed after the year named in the original wording. The year is often stamped on the spacer between the panes.',
  },
  wohnung_einbruchschutz_tuer: {
    q: 'Does the flat door have additional burglary protection?',
    help: 'Reinforced door plus e.g. security bar or multi-point locking.',
  },
  wohnung_breitband: {
    q: 'Is there a bidirectional cable connection (internet via cable)?',
    help: 'Rent index 2015 only.',
  },

  /* ---------------- Building ---------------- */
  gebaeude_treppenhaus_schlecht: {
    q: 'Is the staircase / entrance area mostly in poor condition?',
    help: 'For example peeling paint, graffiti, broken lighting, damaged steps. Please give the last renovation date and the defects.',
  },
  gebaeude_kein_keller: {
    q: 'Do you have your own cellar or storage room outside the flat?',
    help: 'A (lockable) room just for you, without extra cost.',
  },
  gebaeude_haustuer_offen: {
    q: 'Can the front door of the building be locked?',
    help: '“No” if anyone can enter the staircase at any time.',
  },
  gebaeude_instandhaltung_schlecht: {
    q: 'Is the building in poor repair?',
    help: 'For example permanently damp walls (also in the cellar), large plaster damage on the façade, considerable roof damage. Please describe defects and location.',
  },
  gebaeude_seitenfluegel: {
    q: 'Is the flat in a side wing or rear building of a densely built courtyard?',
    help: 'Typical for Berlin old buildings with back courtyards. Please state which rooms are there.',
  },
  gebaeude_kein_aufzug_ab5: {
    q: 'Is the flat on the 5th floor or higher – without a lift?',
    help: 'From 2024: does not apply to buildings built up to 1949.',
  },
  gebaeude_keine_sprechanlage: {
    q: 'Is there an intercom with a door opener?',
    help: 'You can talk to visitors at the front door and open it from your flat.',
  },
  gebaeude_daemmung_schlecht: {
    q: 'Is the building poorly insulated or the heating old and inefficient?',
    help: 'The heating system was installed before the year named in the original wording, or the insulation is inadequate. Details on area and heating age help.',
  },
  gebaeude_fahrradraum: {
    q: 'Is there a lockable bicycle room or bicycle stands on the property?',
    help: 'Easily accessible and large enough.',
  },
  gebaeude_zusatzraeume: {
    q: 'Are there additional shared rooms (e.g. common room, drying room, guest flat)?',
    help: 'Usable rooms outside the flat that you may share. Please state which.',
  },
  gebaeude_garage: {
    q: 'Does a garage or parking space come with the flat at no extra cost?',
    help: 'Rent index 2015 only.',
  },
  gebaeude_eingang_repraesentativ: {
    q: 'Is the entrance / staircase prestigious or renovated to a high standard?',
    help: 'For example marble, mirrors, special lighting, runners throughout the staircase.',
  },
  gebaeude_instandhaltung_gut: {
    q: 'Is the building in above-average condition (e.g. new façade, new roof)?',
    help: 'From 2024: only for buildings up to 2015.',
  },
  gebaeude_einbruchschutz: {
    q: 'Are there burglar-resistant flat and building doors?',
    help: 'Rent index 2015 only.',
  },
  gebaeude_videosprechanlage: {
    q: 'Is there a video intercom?',
    help: 'With a screen in the flat and electric door opener.',
  },
  gebaeude_aufzug: {
    q: 'Is there a lift even though the building has fewer than five upper floors?',
    help: 'From 2024: does not count for buildings from 2010 onwards.',
  },
  gebaeude_schwellenarm: {
    q: 'Can you reach the building and the flat with at most one step?',
    help: 'At most one step at the entrance and up to the flat door.',
  },
  gebaeude_daemmung_gut: {
    q: 'Was insulation added later or a modern heating system installed?',
    help: 'Older buildings only: additional façade/roof insulation or a new heating system after the date named in the original wording.',
  },
  energie_minus_1: {
    q: 'Energy value above {{n}} kWh/(m²a)',
    help: 'You find the value in the energy certificate or the heating cost statement. Only the highest applicable level counts.',
  },
  energie_minus_2: {
    q: 'Energy value above {{n}} kWh/(m²a)',
    help: 'You find the value in the energy certificate or the heating cost statement. Only the highest applicable level counts.',
  },
  energie_minus_3: {
    q: 'Energy value above {{n}} kWh/(m²a)',
    help: 'You find the value in the energy certificate or the heating cost statement. Only the highest applicable level counts.',
  },
  energie_plus_1: {
    q: 'Energy value below {{n}} kWh/(m²a)',
    help: 'Increases the value if the building is very energy-efficient.',
  },
  energie_plus_2: {
    q: 'Energy value below {{n}} kWh/(m²a)',
    help: 'Increases the value if the building is very energy-efficient.',
  },
  energie_plus_3: {
    q: 'Energy value below {{n}} kWh/(m²a)',
    help: 'Increases the value if the building is very energy-efficient.',
  },

  /* ---------------- Surroundings ---------------- */
  umfeld_vernachlaessigt: {
    q: 'Is the flat in a severely neglected neighbourhood?',
    help: 'For example derelict buildings, many vacancies, rubbish. Please describe.',
  },
  umfeld_laerm: {
    q: 'Is the location particularly noisy?',
    help: 'For example a main road, railway, near an airport, commercial or party noise. The Senate’s strategic noise maps show the exposure per building. Please state the type of noise.',
  },
  umfeld_geruch: {
    q: 'Is the location particularly affected by smells?',
    help: 'For example from businesses, restaurants or industry. Please state when.',
  },
  umfeld_keine_fahrradplaetze: {
    q: 'Can you park bicycles on the property?',
    help: 'For example a bike room or bike stands.',
  },
  umfeld_muell: {
    q: 'Is the bin area untidy and open?',
    help: 'Rent index 2015 only.',
  },
  umfeld_citylage: {
    q: 'Is the flat in a preferred city-centre location?',
    help: 'Close to prestigious, nationally known shopping and business streets (e.g. Kurfürstendamm, Friedrichstraße).',
  },
  umfeld_ruhig: {
    q: 'Is the location particularly quiet?',
    help: 'For example a traffic-calmed street, next to a park, bollards or road narrowing.',
  },
  umfeld_gestaltet: {
    q: 'Is the property elaborately landscaped (playground, benches, green areas, lighting)?',
    help: 'Clearly more than a basic courtyard. Please describe.',
  },
  umfeld_parkplatz: {
    q: 'Does the landlord provide enough car parking nearby?',
    help: 'Parking offered by the landlord (not public street parking).',
  },
  umfeld_garten: {
    q: 'Is there a garden just for you – or a free tenants’ garden?',
    help: 'A garden belonging to the flat with direct access, or a tenants’ garden free of charge.',
  },
  umfeld_muell_gepflegt: {
    q: 'Is there a tidy, screened bin area for tenants only?',
    help: 'Rent index 2015 only.',
  },
  umfeld_villa: {
    q: 'Do you live in a villa-style apartment building?',
    help: 'Rent index 2015 only.',
  },

  /* ---------------- Special features 2015 ---------------- */
  sm_parkett: {
    q: 'High-quality flooring in most living rooms?',
    help: 'Parquet, natural stone, high-quality tiles or similar.',
  },
  sm_kueche: {
    q: 'Modern kitchen equipment?',
    help: 'All of: cupboards, built-in sink, cooker hood, cooker with ceramic or induction hob, oven, wall tiles in the work area, fridge.',
  },
  sm_dusche: {
    q: 'Shower separate from the bathtub?',
    help: 'Its own shower in addition to the tub.',
  },
  sm_kleines_bad: {
    q: 'Is the bathroom smaller than 4 m²?',
    help: 'Stretch your arms out: if you can touch both walls and the room is no longer than about two big steps, it is probably smaller than 4 m². Only has an effect as a special feature for buildings from 1991–2002.',
  },
  sm_modernes_bad: {
    q: 'Modern bathroom?',
    help: 'Splash zones tiled, floor tiles, built-in tub/shower, single-lever mixer, towel radiator.',
  },
  sm_isolierverglasung: {
    q: 'Mostly insulated glazing (from 1987) or soundproof windows?',
    help: 'Double-glazed windows installed from 1987 onwards.',
  },
  sm_aufzug: {
    q: 'Is there a lift in the building?',
    help: 'Passenger lift.',
  },
};

export default en;
