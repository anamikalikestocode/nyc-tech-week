-- L'Ami Mauricien — seed data
-- Sample partners, regions, categories, tags, and collections
-- All content is placeholder — replace with real partner data later

-- ---------------------------------------------------------------------------
-- Regions
-- ---------------------------------------------------------------------------
insert into public.regions (slug, name_en, name_fr, description_en, description_fr, hero_image, display_order) values
  ('north', 'North', 'Nord',
   'The vibrant north coast stretches from the cosmopolitan capital of Port Louis to the lively resort town of Grand Baie. Discover bustling markets, world-class restaurants, and a nightlife scene that pulses until dawn.',
   'La côte nord vibrante s''étend de la capitale cosmopolite de Port Louis à la ville balnéaire animée de Grand Baie. Découvrez les marchés animés, les restaurants de classe mondiale et une vie nocturne qui vibre jusqu''à l''aube.',
   'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80', 1),

  ('east', 'East', 'Est',
   'The east coast is home to the island''s most pristine beaches — think powdery white sand meeting turquoise lagoons. Belle Mare and Île aux Cerfs offer world-class water sports and barefoot luxury.',
   'La côte est abrite les plages les plus immaculées de l''île — du sable blanc poudreux rencontrant des lagons turquoise. Belle Mare et l''Île aux Cerfs offrent des sports nautiques de classe mondiale et un luxe pieds nus.',
   'https://images.unsplash.com/photo-1597739239353-50270a473397?w=1200&q=80', 2),

  ('south', 'South', 'Sud',
   'The dramatic south is wild Mauritius at its finest. From the UNESCO-listed Le Morne Brabant to the seven-coloured earth of Chamarel and Black River Gorges, this is where nature reigns supreme.',
   'Le sud dramatique est le Mauritius sauvage à son meilleur. Du Morne Brabant classé par l''UNESCO à la terre des sept couleurs de Chamarel et les gorges de Rivière Noire, c''est ici que la nature règne en maître.',
   'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=80', 3),

  ('west', 'West', 'Ouest',
   'The west coast is where locals go for the best sunsets. Flic en Flac offers long sandy beaches, Tamarin is the surfing capital, and dolphin-watching at dawn is an unforgettable ritual.',
   'La côte ouest est l''endroit où les locaux vont pour les plus beaux couchers de soleil. Flic en Flac offre de longues plages de sable, Tamarin est la capitale du surf, et l''observation des dauphins à l''aube est un rituel inoubliable.',
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', 4);

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name_en, name_fr, icon, display_order) values
  ('restaurants',        'Restaurants & Fine Dining', 'Restaurants & Gastronomie',  'utensils',  1),
  ('experiences-tours',  'Experiences & Tours',       'Expériences & Excursions',   'sailboat',  2),
  ('culture-events',     'Culture & Events',          'Culture & Événements',       'landmark',  3),
  ('premium-transport',  'Premium Transport',         'Transport Premium',          'car',       4);

-- ---------------------------------------------------------------------------
-- Tags
-- ---------------------------------------------------------------------------
insert into public.tags (slug, name_en, name_fr) values
  ('honeymoon',       'Honeymoon',            'Lune de Miel'),
  ('family-friendly', 'Family Friendly',      'Familial'),
  ('adventure',       'Adventure',            'Aventure'),
  ('luxury',          'Luxury',               'Luxe'),
  ('fine-dining',     'Fine Dining',          'Gastronomie'),
  ('romantic',        'Romantic',             'Romantique'),
  ('water-sports',    'Water Sports',         'Sports Nautiques'),
  ('nature',          'Nature & Wildlife',    'Nature & Faune'),
  ('cultural',        'Cultural',             'Culturel'),
  ('sunset',          'Sunset Experience',    'Expérience Coucher de Soleil'),
  ('beach',           'Beach',                'Plage'),
  ('local-cuisine',   'Local Cuisine',        'Cuisine Locale'),
  ('vegan-friendly',  'Vegan Friendly',       'Végan'),
  ('wellness',        'Wellness & Spa',       'Bien-être & Spa'),
  ('photography',     'Photography Worthy',   'Photogénique'),
  ('group-friendly',  'Group Friendly',       'Adapté aux Groupes'),
  ('private',         'Private Experience',   'Expérience Privée'),
  ('half-day',        'Half Day',             'Demi-journée'),
  ('full-day',        'Full Day',             'Journée Complète'),
  ('evening',         'Evening',              'Soirée');

-- ---------------------------------------------------------------------------
-- Partners — Restaurants (5)
-- ---------------------------------------------------------------------------

-- Get category & region IDs via subquery
insert into public.partners (slug, name, description_en, description_fr, short_desc_en, short_desc_fr, category_id, region_id, price_range, signature_offers, address, latitude, longitude, phone, website, hero_image, quality_score, status)
values
  ('le-chamarel-restaurant',
   'Le Chamarel Restaurant',
   'Perched on the hills of Chamarel with panoramic views over the west coast, Le Chamarel serves refined Mauritian-French fusion cuisine using locally sourced ingredients. The open-air terrace is the perfect setting for a long, languid lunch.',
   'Perché sur les collines de Chamarel avec une vue panoramique sur la côte ouest, Le Chamarel sert une cuisine fusion mauricienne-française raffinée à base d''ingrédients locaux. La terrasse en plein air est le cadre parfait pour un long déjeuner.',
   'Mauritian-French hilltop dining with panoramic views',
   'Gastronomie mauricienne-française en altitude avec vue panoramique',
   (select id from public.categories where slug = 'restaurants'),
   (select id from public.regions where slug = 'south'),
   '$$$$',
   '[{"en": "7-course tasting menu with wine pairing", "fr": "Menu dégustation 7 plats avec accord mets-vins"}, {"en": "Private terrace for two", "fr": "Terrasse privée pour deux"}]'::jsonb,
   'Chamarel, Black River', -20.4380, 57.3790, '+230 483 6421', 'https://example.com/le-chamarel',
   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
   95, 'approved'),

  ('the-cove-grand-baie',
   'The Cove',
   'An intimate seafood restaurant tucked into a rocky cove on the north coast. The Cove is where Grand Baie''s discerning diners come for the freshest catch, grilled over charcoal and served with Creole sides.',
   'Un restaurant de fruits de mer intimiste niché dans une crique rocheuse sur la côte nord. The Cove est l''endroit où les fins gourmets de Grand Baie viennent pour les prises les plus fraîches, grillées au charbon et servies avec des accompagnements créoles.',
   'Intimate seafood restaurant in a rocky cove',
   'Restaurant de fruits de mer intimiste dans une crique rocheuse',
   (select id from public.categories where slug = 'restaurants'),
   (select id from public.regions where slug = 'north'),
   '$$$',
   '[{"en": "Lobster & champagne sunset dinner", "fr": "Dîner homard & champagne au coucher du soleil"}, {"en": "Chef''s catch of the day", "fr": "Prise du jour du chef"}]'::jsonb,
   'Grand Baie, Rivière du Rempart', -20.0095, 57.5826, '+230 263 8900', 'https://example.com/the-cove',
   'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
   90, 'approved'),

  ('la-table-du-chateau',
   'La Table du Château',
   'Set within the historic Château de Labourdonnais, this elegant restaurant pairs estate-grown produce with contemporary Mauritian fine dining. The rum distillery on-site means exceptional rum pairings with every course.',
   'Situé dans l''historique Château de Labourdonnais, ce restaurant élégant associe les produits cultivés sur le domaine à une gastronomie mauricienne contemporaine. La distillerie de rhum sur place signifie des accords rhum exceptionnels à chaque plat.',
   'Estate dining at a historic château with rum pairings',
   'Gastronomie au château historique avec accords rhum',
   (select id from public.categories where slug = 'restaurants'),
   (select id from public.regions where slug = 'north'),
   '$$$$',
   '[{"en": "Estate tour + 5-course lunch with rum pairing", "fr": "Visite du domaine + déjeuner 5 plats avec accord rhum"}, {"en": "Private dining in the orangery", "fr": "Dîner privé dans l''orangerie"}]'::jsonb,
   'Mapou, Rivière du Rempart', -20.0833, 57.6167, '+230 266 9533', 'https://example.com/chateau',
   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
   92, 'approved'),

  ('rougaille-creole',
   'Rougaille Créole',
   'A beloved local institution in Port Louis, Rougaille Créole serves authentic home-style Mauritian cooking in a charming colonial house. The dholl puri and rougaille are the stuff of legend.',
   'Une institution locale bien-aimée à Port Louis, Rougaille Créole sert une cuisine mauricienne authentique de style maison dans une charmante maison coloniale. Le dholl puri et le rougaille sont légendaires.',
   'Authentic Mauritian home cooking in colonial Port Louis',
   'Cuisine mauricienne authentique dans le Port Louis colonial',
   (select id from public.categories where slug = 'restaurants'),
   (select id from public.regions where slug = 'north'),
   '$$',
   '[{"en": "Mauritian cooking class + lunch", "fr": "Cours de cuisine mauricienne + déjeuner"}, {"en": "Market tour with the chef", "fr": "Visite du marché avec le chef"}]'::jsonb,
   'Port Louis', -20.1609, 57.4989, '+230 212 3456', 'https://example.com/rougaille',
   'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
   88, 'approved'),

  ('azure-beach-grill',
   'Azure Beach Grill',
   'Toes-in-the-sand dining at Belle Mare''s most exclusive beach. Azure serves Mediterranean-Mauritian plates with an emphasis on grilled seafood, tropical cocktails, and effortless barefoot elegance.',
   'Dîner pieds dans le sable sur la plage la plus exclusive de Belle Mare. Azure sert des plats méditerranéens-mauriciens axés sur les fruits de mer grillés, cocktails tropicaux et une élégance pieds nus.',
   'Barefoot beachfront dining at Belle Mare',
   'Restaurant pieds nus en bord de plage à Belle Mare',
   (select id from public.categories where slug = 'restaurants'),
   (select id from public.regions where slug = 'east'),
   '$$$',
   '[{"en": "Beach barbecue at sunset", "fr": "Barbecue sur la plage au coucher du soleil"}, {"en": "Private cabana dinner", "fr": "Dîner en cabana privée"}]'::jsonb,
   'Belle Mare, Flacq', -20.1900, 57.7600, '+230 415 2000', 'https://example.com/azure',
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
   89, 'approved'),

-- ---------------------------------------------------------------------------
-- Partners — Experiences & Tours (5)
-- ---------------------------------------------------------------------------

  ('ile-aux-cerfs-vip',
   'Île aux Cerfs VIP Experience',
   'Skip the crowds with a private speedboat transfer to Île aux Cerfs. Your dedicated guide arranges the best snorkelling spots, a gourmet beach picnic, and parasailing — all without sharing the moment.',
   'Évitez la foule avec un transfert privé en vedette rapide vers l''Île aux Cerfs. Votre guide dédié organise les meilleurs spots de plongée, un pique-nique gastronomique sur la plage et du parachute ascensionnel.',
   'Private speedboat & VIP access to Île aux Cerfs',
   'Vedette privée & accès VIP à l''Île aux Cerfs',
   (select id from public.categories where slug = 'experiences-tours'),
   (select id from public.regions where slug = 'east'),
   '$$$$',
   '[{"en": "Private speedboat + gourmet beach picnic", "fr": "Vedette privée + pique-nique gastronomique"}, {"en": "Parasailing & snorkelling package", "fr": "Parachute ascensionnel & plongée"}]'::jsonb,
   'Trou d''Eau Douce, Flacq', -20.2380, 57.7900, '+230 480 1234', 'https://example.com/ile-aux-cerfs-vip',
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
   94, 'approved'),

  ('black-river-dolphins',
   'Dolphin Dawn Encounter',
   'Set out at first light from Tamarin Bay for an ethical dolphin-watching experience. Swim alongside spinner and bottlenose dolphins in their natural habitat, guided by marine biologists who prioritise the animals'' welfare.',
   'Partez dès l''aube de la Baie de Tamarin pour une expérience éthique d''observation des dauphins. Nagez aux côtés des dauphins à long bec et des grands dauphins dans leur habitat naturel, guidés par des biologistes marins.',
   'Ethical dawn dolphin swim at Tamarin Bay',
   'Nage éthique avec les dauphins à l''aube à Tamarin',
   (select id from public.categories where slug = 'experiences-tours'),
   (select id from public.regions where slug = 'west'),
   '$$$',
   '[{"en": "Dawn dolphin swim + breakfast on the boat", "fr": "Nage avec les dauphins à l''aube + petit-déjeuner"}, {"en": "Marine biology guided snorkelling", "fr": "Plongée guidée par un biologiste marin"}]'::jsonb,
   'Tamarin, Black River', -20.3250, 57.3720, '+230 483 7890', 'https://example.com/dolphins',
   'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&q=80',
   93, 'approved'),

  ('chamarel-adventure-park',
   'Chamarel Adventure Park',
   'Zip-line over the canopy of Black River Gorges, abseil down waterfalls, and hike through indigenous ebony forest. Chamarel Adventure Park combines adrenaline with ecology for the ultimate active day out.',
   'Survolez la canopée des Gorges de Rivière Noire en tyrolienne, descendez en rappel des cascades et randonnez à travers la forêt d''ébène indigène. Le parc combine adrénaline et écologie.',
   'Ziplines, canyoning & forest hikes at Chamarel',
   'Tyroliennes, canyoning & randonnées à Chamarel',
   (select id from public.categories where slug = 'experiences-tours'),
   (select id from public.regions where slug = 'south'),
   '$$',
   '[{"en": "Full-day adventure package", "fr": "Forfait aventure journée complète"}, {"en": "Private guided night hike", "fr": "Randonnée nocturne privée guidée"}]'::jsonb,
   'Chamarel, Black River', -20.4330, 57.3810, '+230 234 5678', 'https://example.com/chamarel-adventure',
   'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80',
   87, 'approved'),

  ('mauritius-sailing-co',
   'Mauritius Sailing Co.',
   'Luxury catamaran charters along the north and west coasts. Whether it''s a half-day sunset cruise or a full-day island-hopping adventure, the crew handles everything from gourmet catering to water toys.',
   'Location de catamarans de luxe le long des côtes nord et ouest. Que ce soit une croisière coucher de soleil d''une demi-journée ou une aventure d''île en île, l''équipage gère tout.',
   'Luxury catamaran charters along the coast',
   'Location de catamarans de luxe le long de la côte',
   (select id from public.categories where slug = 'experiences-tours'),
   (select id from public.regions where slug = 'north'),
   '$$$$',
   '[{"en": "Sunset champagne cruise (4 hours)", "fr": "Croisière champagne au coucher du soleil (4h)"}, {"en": "Private full-day island hopping", "fr": "Excursion privée d''île en île"}]'::jsonb,
   'Grand Baie, Rivière du Rempart', -20.0095, 57.5826, '+230 263 4567', 'https://example.com/sailing',
   'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
   91, 'approved'),

  ('deep-sea-fishing-club',
   'Marlin Coast Fishing Club',
   'Mauritius is one of the world''s premier big-game fishing destinations. Board a purpose-built sports fishing boat out of Grand Baie and chase marlin, tuna, and wahoo with an experienced captain.',
   'L''île Maurice est l''une des premières destinations mondiales de pêche au gros. Embarquez sur un bateau de pêche sportive au départ de Grand Baie et chassez marlins, thons et wahoo.',
   'Big-game sport fishing from Grand Baie',
   'Pêche sportive au gros au départ de Grand Baie',
   (select id from public.categories where slug = 'experiences-tours'),
   (select id from public.regions where slug = 'north'),
   '$$$',
   '[{"en": "Half-day big game fishing", "fr": "Demi-journée pêche au gros"}, {"en": "Full-day deep sea + reef fishing combo", "fr": "Journée complète pêche hauturière + récif"}]'::jsonb,
   'Grand Baie, Rivière du Rempart', -20.0095, 57.5826, '+230 263 8888', 'https://example.com/fishing',
   'https://images.unsplash.com/photo-1534575990805-a8c32b1001d0?w=800&q=80',
   86, 'approved'),

-- ---------------------------------------------------------------------------
-- Partners — Culture & Events (5)
-- ---------------------------------------------------------------------------

  ('aapravasi-ghat',
   'Aapravasi Ghat Heritage Walk',
   'A guided walk through the UNESCO World Heritage Site where indentured labourers first set foot in Mauritius. Expert historians bring to life the island''s complex, multicultural origins.',
   'Une visite guidée du site du patrimoine mondial de l''UNESCO où les travailleurs engagés ont posé le pied à Maurice. Des historiens experts donnent vie aux origines multiculturelles complexes de l''île.',
   'UNESCO heritage walk through Mauritius'' immigration history',
   'Visite guidée UNESCO de l''histoire de l''immigration mauricienne',
   (select id from public.categories where slug = 'culture-events'),
   (select id from public.regions where slug = 'north'),
   '$$',
   '[{"en": "Private guided heritage tour (2 hours)", "fr": "Visite guidée privée du patrimoine (2h)"}, {"en": "Heritage walk + Port Louis market tour", "fr": "Visite patrimoine + marché de Port Louis"}]'::jsonb,
   'Port Louis', -20.1609, 57.5000, '+230 217 5678', 'https://example.com/aapravasi',
   'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80',
   88, 'approved'),

  ('eureka-house',
   'Eureka House',
   'Step into the 19th century at one of the island''s finest colonial mansions. Eureka House offers guided tours through its 109 doors, lush tropical gardens, and a restaurant serving authentic Creole cuisine.',
   'Plongez dans le 19e siècle dans l''une des plus belles demeures coloniales de l''île. Eureka House propose des visites guidées à travers ses 109 portes, jardins tropicaux luxuriants et un restaurant de cuisine créole.',
   '19th-century colonial mansion with Creole lunch',
   'Demeure coloniale du 19e siècle avec déjeuner créole',
   (select id from public.categories where slug = 'culture-events'),
   (select id from public.regions where slug = 'north'),
   '$$',
   '[{"en": "Guided mansion tour + Creole lunch", "fr": "Visite guidée + déjeuner créole"}, {"en": "Private garden & history experience", "fr": "Expérience privée jardin & histoire"}]'::jsonb,
   'Moka', -20.2167, 57.4833, '+230 433 8477', 'https://example.com/eureka',
   'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
   85, 'approved'),

  ('le-morne-heritage-trail',
   'Le Morne Heritage Trail',
   'A guided hike up the UNESCO-listed Le Morne Brabant, retracing the footsteps of runaway slaves who found refuge on this dramatic basalt peak. The summit offers breathtaking 360° views of the lagoon.',
   'Une randonnée guidée sur le Morne Brabant classé par l''UNESCO, retraçant les pas des esclaves en fuite qui ont trouvé refuge sur ce pic spectaculaire. Le sommet offre une vue panoramique à 360° sur le lagon.',
   'UNESCO-listed heritage hike with lagoon views',
   'Randonnée patrimoine UNESCO avec vue sur le lagon',
   (select id from public.categories where slug = 'culture-events'),
   (select id from public.regions where slug = 'south'),
   '$$',
   '[{"en": "Sunrise heritage hike (4 hours)", "fr": "Randonnée patrimoine au lever du soleil (4h)"}, {"en": "Private historian-led trail", "fr": "Sentier privé guidé par un historien"}]'::jsonb,
   'Le Morne, Black River', -20.4490, 57.3170, '+230 601 2345', 'https://example.com/le-morne-trail',
   'https://images.unsplash.com/photo-1580394693539-d6122b0a6944?w=800&q=80',
   91, 'approved'),

  ('sega-experience',
   'Séga Tipik Experience',
   'Immerse yourself in the rhythms of séga, the traditional Creole music and dance of Mauritius. This intimate evening experience pairs live séga performance with local rum, storytelling, and a Creole feast.',
   'Plongez-vous dans les rythmes du séga, la musique et danse créole traditionnelle de Maurice. Cette soirée intimiste allie spectacle de séga en direct, rhum local, contes et festin créole.',
   'Live séga music, dance & Creole feast',
   'Séga en direct, danse & festin créole',
   (select id from public.categories where slug = 'culture-events'),
   (select id from public.regions where slug = 'west'),
   '$$',
   '[{"en": "Evening séga show + dinner + rum tasting", "fr": "Spectacle séga + dîner + dégustation de rhum"}, {"en": "Private séga & dance lesson", "fr": "Cours privé de séga & danse"}]'::jsonb,
   'Flic en Flac, Black River', -20.2960, 57.3710, '+230 453 6789', 'https://example.com/sega',
   'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
   87, 'approved'),

  ('pamplemousses-gardens',
   'Sir Seewoosagur Ramgoolam Botanical Garden',
   'One of the oldest botanical gardens in the Southern Hemisphere. Home to the giant Victoria amazonica water lilies, a spice garden, and over 80 varieties of palm. A peaceful retreat from the coast.',
   'L''un des plus anciens jardins botaniques de l''hémisphère sud. Abrite les nénuphars géants Victoria amazonica, un jardin d''épices et plus de 80 variétés de palmiers. Un havre de paix.',
   'Historic botanical garden with giant water lilies',
   'Jardin botanique historique avec nénuphars géants',
   (select id from public.categories where slug = 'culture-events'),
   (select id from public.regions where slug = 'north'),
   '$',
   '[{"en": "Guided botanical tour (90 minutes)", "fr": "Visite botanique guidée (90 minutes)"}, {"en": "Photography tour at golden hour", "fr": "Visite photo à l''heure dorée"}]'::jsonb,
   'Pamplemousses', -20.1070, 57.5800, '+230 243 9401', 'https://example.com/pamplemousses',
   'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
   84, 'approved'),

-- ---------------------------------------------------------------------------
-- Partners — Premium Transport (5)
-- ---------------------------------------------------------------------------

  ('mauritius-helicopter-tours',
   'Mauritius Helicopter Tours',
   'See the island from above with spectacular helicopter flights over Le Morne, the underwater waterfall illusion, Chamarel''s coloured earth, and the emerald peaks. Custom routes available.',
   'Découvrez l''île vue du ciel avec des vols en hélicoptère spectaculaires au-dessus du Morne, de l''illusion de cascade sous-marine, de la terre colorée de Chamarel et des pics émeraude.',
   'Scenic helicopter flights over Mauritius'' landmarks',
   'Vols panoramiques en hélicoptère au-dessus de Maurice',
   (select id from public.categories where slug = 'premium-transport'),
   (select id from public.regions where slug = 'west'),
   '$$$$',
   '[{"en": "Underwater waterfall flight (30 min)", "fr": "Vol cascade sous-marine (30 min)"}, {"en": "Full island tour (60 min)", "fr": "Tour complet de l''île (60 min)"}]'::jsonb,
   'SSR International Airport', -20.4302, 57.6836, '+230 603 3500', 'https://example.com/helicopter',
   'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
   96, 'approved'),

  ('prestige-chauffeur',
   'Prestige Chauffeur Services',
   'Door-to-door luxury transfers in a Mercedes S-Class or Range Rover with professional, English and French-speaking drivers. Airport pickups, full-day touring, and event transport.',
   'Transferts de luxe porte-à-porte en Mercedes Classe S ou Range Rover avec chauffeurs professionnels bilingues. Transferts aéroport, excursions journée et transport événementiel.',
   'Mercedes & Range Rover private chauffeur service',
   'Service de chauffeur privé Mercedes & Range Rover',
   (select id from public.categories where slug = 'premium-transport'),
   (select id from public.regions where slug = 'north'),
   '$$$',
   '[{"en": "Airport VIP meet & greet transfer", "fr": "Transfert aéroport VIP"}, {"en": "Full-day island touring with chauffeur", "fr": "Excursion journée avec chauffeur"}]'::jsonb,
   'Port Louis', -20.1609, 57.4989, '+230 5700 0000', 'https://example.com/prestige',
   'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80',
   90, 'approved'),

  ('ocean-seaplane',
   'Ocean Seaplane Adventures',
   'Land directly on the lagoon with a scenic seaplane transfer to the east coast or Île aux Cerfs. A transport experience that''s an attraction in itself.',
   'Atterrissez directement sur le lagon avec un transfert en hydravion panoramique vers la côte est ou l''Île aux Cerfs. Une expérience de transport qui est une attraction en soi.',
   'Scenic seaplane lagoon landings',
   'Atterrissages panoramiques en hydravion sur le lagon',
   (select id from public.categories where slug = 'premium-transport'),
   (select id from public.regions where slug = 'east'),
   '$$$$',
   '[{"en": "Seaplane transfer to Île aux Cerfs", "fr": "Transfert en hydravion vers l''Île aux Cerfs"}, {"en": "Aerial photography flight", "fr": "Vol photographie aérienne"}]'::jsonb,
   'Mahébourg, Grand Port', -20.4100, 57.7000, '+230 604 1234', 'https://example.com/seaplane',
   'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
   93, 'approved'),

  ('classic-mauritius-tours',
   'Classic Mauritius Tours',
   'Explore the island in style aboard a restored 1960s Land Rover. Themed routes cover tea plantations, rum distilleries, and hidden coastal villages — complete with a knowledgeable local driver-guide.',
   'Explorez l''île avec style à bord d''un Land Rover restauré des années 1960. Des itinéraires thématiques couvrent plantations de thé, distilleries de rhum et villages côtiers cachés.',
   'Vintage Land Rover island tours',
   'Excursions en Land Rover vintage sur l''île',
   (select id from public.categories where slug = 'premium-transport'),
   (select id from public.regions where slug = 'south'),
   '$$$',
   '[{"en": "Tea & rum route (full day)", "fr": "Route du thé & rhum (journée)"}, {"en": "Hidden south coast tour (half day)", "fr": "Tour de la côte sud cachée (demi-journée)"}]'::jsonb,
   'Mahébourg, Grand Port', -20.4100, 57.7000, '+230 631 5678', 'https://example.com/classic-tours',
   'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
   88, 'approved'),

  ('electric-bike-mauritius',
   'E-Bike Mauritius',
   'Premium electric bike hire with curated route maps covering coastal paths, mountain trails, and village circuits. Self-guided or with a local cycling guide who knows every shortcut.',
   'Location de vélos électriques premium avec cartes d''itinéraires couvrant sentiers côtiers, pistes de montagne et circuits villageois. En autonomie ou avec un guide cycliste local.',
   'Premium e-bike hire with curated island routes',
   'Location de vélos électriques premium avec itinéraires',
   (select id from public.categories where slug = 'premium-transport'),
   (select id from public.regions where slug = 'west'),
   '$$',
   '[{"en": "Coastal sunset ride (3 hours)", "fr": "Balade côtière au coucher du soleil (3h)"}, {"en": "Mountain trail with guide (full day)", "fr": "Piste de montagne avec guide (journée)"}]'::jsonb,
   'Flic en Flac, Black River', -20.2960, 57.3710, '+230 5800 1234', 'https://example.com/ebike',
   'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
   85, 'approved');


-- ---------------------------------------------------------------------------
-- Partner Tags (assign relevant tags)
-- ---------------------------------------------------------------------------
insert into public.partner_tags (partner_id, tag_id) values
  -- Le Chamarel Restaurant
  ((select id from public.partners where slug = 'le-chamarel-restaurant'), (select id from public.tags where slug = 'fine-dining')),
  ((select id from public.partners where slug = 'le-chamarel-restaurant'), (select id from public.tags where slug = 'romantic')),
  ((select id from public.partners where slug = 'le-chamarel-restaurant'), (select id from public.tags where slug = 'honeymoon')),
  ((select id from public.partners where slug = 'le-chamarel-restaurant'), (select id from public.tags where slug = 'photography')),
  -- The Cove
  ((select id from public.partners where slug = 'the-cove-grand-baie'), (select id from public.tags where slug = 'fine-dining')),
  ((select id from public.partners where slug = 'the-cove-grand-baie'), (select id from public.tags where slug = 'romantic')),
  ((select id from public.partners where slug = 'the-cove-grand-baie'), (select id from public.tags where slug = 'sunset')),
  -- La Table du Château
  ((select id from public.partners where slug = 'la-table-du-chateau'), (select id from public.tags where slug = 'fine-dining')),
  ((select id from public.partners where slug = 'la-table-du-chateau'), (select id from public.tags where slug = 'luxury')),
  ((select id from public.partners where slug = 'la-table-du-chateau'), (select id from public.tags where slug = 'cultural')),
  -- Rougaille Créole
  ((select id from public.partners where slug = 'rougaille-creole'), (select id from public.tags where slug = 'local-cuisine')),
  ((select id from public.partners where slug = 'rougaille-creole'), (select id from public.tags where slug = 'cultural')),
  ((select id from public.partners where slug = 'rougaille-creole'), (select id from public.tags where slug = 'family-friendly')),
  -- Azure Beach Grill
  ((select id from public.partners where slug = 'azure-beach-grill'), (select id from public.tags where slug = 'beach')),
  ((select id from public.partners where slug = 'azure-beach-grill'), (select id from public.tags where slug = 'romantic')),
  ((select id from public.partners where slug = 'azure-beach-grill'), (select id from public.tags where slug = 'sunset')),
  -- Île aux Cerfs VIP
  ((select id from public.partners where slug = 'ile-aux-cerfs-vip'), (select id from public.tags where slug = 'luxury')),
  ((select id from public.partners where slug = 'ile-aux-cerfs-vip'), (select id from public.tags where slug = 'water-sports')),
  ((select id from public.partners where slug = 'ile-aux-cerfs-vip'), (select id from public.tags where slug = 'honeymoon')),
  ((select id from public.partners where slug = 'ile-aux-cerfs-vip'), (select id from public.tags where slug = 'private')),
  -- Dolphin Dawn
  ((select id from public.partners where slug = 'black-river-dolphins'), (select id from public.tags where slug = 'nature')),
  ((select id from public.partners where slug = 'black-river-dolphins'), (select id from public.tags where slug = 'adventure')),
  ((select id from public.partners where slug = 'black-river-dolphins'), (select id from public.tags where slug = 'family-friendly')),
  ((select id from public.partners where slug = 'black-river-dolphins'), (select id from public.tags where slug = 'half-day')),
  -- Chamarel Adventure Park
  ((select id from public.partners where slug = 'chamarel-adventure-park'), (select id from public.tags where slug = 'adventure')),
  ((select id from public.partners where slug = 'chamarel-adventure-park'), (select id from public.tags where slug = 'nature')),
  ((select id from public.partners where slug = 'chamarel-adventure-park'), (select id from public.tags where slug = 'full-day')),
  ((select id from public.partners where slug = 'chamarel-adventure-park'), (select id from public.tags where slug = 'group-friendly')),
  -- Mauritius Sailing Co.
  ((select id from public.partners where slug = 'mauritius-sailing-co'), (select id from public.tags where slug = 'luxury')),
  ((select id from public.partners where slug = 'mauritius-sailing-co'), (select id from public.tags where slug = 'honeymoon')),
  ((select id from public.partners where slug = 'mauritius-sailing-co'), (select id from public.tags where slug = 'sunset')),
  ((select id from public.partners where slug = 'mauritius-sailing-co'), (select id from public.tags where slug = 'private')),
  -- Marlin Coast Fishing
  ((select id from public.partners where slug = 'deep-sea-fishing-club'), (select id from public.tags where slug = 'adventure')),
  ((select id from public.partners where slug = 'deep-sea-fishing-club'), (select id from public.tags where slug = 'half-day')),
  ((select id from public.partners where slug = 'deep-sea-fishing-club'), (select id from public.tags where slug = 'group-friendly')),
  -- Aapravasi Ghat
  ((select id from public.partners where slug = 'aapravasi-ghat'), (select id from public.tags where slug = 'cultural')),
  ((select id from public.partners where slug = 'aapravasi-ghat'), (select id from public.tags where slug = 'half-day')),
  ((select id from public.partners where slug = 'aapravasi-ghat'), (select id from public.tags where slug = 'family-friendly')),
  -- Eureka House
  ((select id from public.partners where slug = 'eureka-house'), (select id from public.tags where slug = 'cultural')),
  ((select id from public.partners where slug = 'eureka-house'), (select id from public.tags where slug = 'local-cuisine')),
  ((select id from public.partners where slug = 'eureka-house'), (select id from public.tags where slug = 'family-friendly')),
  -- Le Morne Heritage Trail
  ((select id from public.partners where slug = 'le-morne-heritage-trail'), (select id from public.tags where slug = 'cultural')),
  ((select id from public.partners where slug = 'le-morne-heritage-trail'), (select id from public.tags where slug = 'adventure')),
  ((select id from public.partners where slug = 'le-morne-heritage-trail'), (select id from public.tags where slug = 'nature')),
  ((select id from public.partners where slug = 'le-morne-heritage-trail'), (select id from public.tags where slug = 'photography')),
  -- Séga Tipik
  ((select id from public.partners where slug = 'sega-experience'), (select id from public.tags where slug = 'cultural')),
  ((select id from public.partners where slug = 'sega-experience'), (select id from public.tags where slug = 'evening')),
  ((select id from public.partners where slug = 'sega-experience'), (select id from public.tags where slug = 'group-friendly')),
  -- Pamplemousses Gardens
  ((select id from public.partners where slug = 'pamplemousses-gardens'), (select id from public.tags where slug = 'nature')),
  ((select id from public.partners where slug = 'pamplemousses-gardens'), (select id from public.tags where slug = 'family-friendly')),
  ((select id from public.partners where slug = 'pamplemousses-gardens'), (select id from public.tags where slug = 'photography')),
  ((select id from public.partners where slug = 'pamplemousses-gardens'), (select id from public.tags where slug = 'half-day')),
  -- Helicopter Tours
  ((select id from public.partners where slug = 'mauritius-helicopter-tours'), (select id from public.tags where slug = 'luxury')),
  ((select id from public.partners where slug = 'mauritius-helicopter-tours'), (select id from public.tags where slug = 'photography')),
  ((select id from public.partners where slug = 'mauritius-helicopter-tours'), (select id from public.tags where slug = 'honeymoon')),
  -- Prestige Chauffeur
  ((select id from public.partners where slug = 'prestige-chauffeur'), (select id from public.tags where slug = 'luxury')),
  ((select id from public.partners where slug = 'prestige-chauffeur'), (select id from public.tags where slug = 'private')),
  -- Ocean Seaplane
  ((select id from public.partners where slug = 'ocean-seaplane'), (select id from public.tags where slug = 'luxury')),
  ((select id from public.partners where slug = 'ocean-seaplane'), (select id from public.tags where slug = 'photography')),
  ((select id from public.partners where slug = 'ocean-seaplane'), (select id from public.tags where slug = 'honeymoon')),
  -- Classic Mauritius Tours
  ((select id from public.partners where slug = 'classic-mauritius-tours'), (select id from public.tags where slug = 'cultural')),
  ((select id from public.partners where slug = 'classic-mauritius-tours'), (select id from public.tags where slug = 'full-day')),
  ((select id from public.partners where slug = 'classic-mauritius-tours'), (select id from public.tags where slug = 'photography')),
  -- E-Bike Mauritius
  ((select id from public.partners where slug = 'electric-bike-mauritius'), (select id from public.tags where slug = 'adventure')),
  ((select id from public.partners where slug = 'electric-bike-mauritius'), (select id from public.tags where slug = 'nature')),
  ((select id from public.partners where slug = 'electric-bike-mauritius'), (select id from public.tags where slug = 'sunset'));


-- ---------------------------------------------------------------------------
-- Editorial Collections
-- ---------------------------------------------------------------------------
insert into public.editorial_collections (slug, title_en, title_fr, subtitle_en, subtitle_fr, description_en, description_fr, hero_image, display_order, published) values
  ('romantic-mauritius',
   'Romantic Mauritius',
   'Maurice Romantique',
   'For lovers, by lovers',
   'Pour les amoureux, par les amoureux',
   'Our hand-picked selection of the most romantic experiences on the island — from clifftop dinners to private catamaran cruises.',
   'Notre sélection des expériences les plus romantiques de l''île — des dîners en falaise aux croisières privées en catamaran.',
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
   1, true),

  ('family-adventures',
   'Family Adventures',
   'Aventures en Famille',
   'Making memories together',
   'Créer des souvenirs ensemble',
   'Kid-tested, parent-approved. From dolphin encounters to botanical gardens, these experiences bring families together.',
   'Testés par les enfants, approuvés par les parents. Des rencontres avec les dauphins aux jardins botaniques.',
   'https://images.unsplash.com/photo-1597739239353-50270a473397?w=1200&q=80',
   2, true),

  ('taste-of-mauritius',
   'A Taste of Mauritius',
   'Les Saveurs de Maurice',
   'The island on a plate',
   'L''île dans une assiette',
   'From Michelin-worthy fine dining to street-side dholl puri, discover the flavours that make Mauritius one of the Indian Ocean''s great culinary destinations.',
   'De la gastronomie étoilée au dholl puri de rue, découvrez les saveurs qui font de Maurice l''une des grandes destinations culinaires de l''océan Indien.',
   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
   3, true);

-- ---------------------------------------------------------------------------
-- Collection Partners (assign partners to collections)
-- ---------------------------------------------------------------------------
insert into public.collection_partners (collection_id, partner_id, sort_order) values
  -- Romantic Mauritius
  ((select id from public.editorial_collections where slug = 'romantic-mauritius'), (select id from public.partners where slug = 'le-chamarel-restaurant'), 1),
  ((select id from public.editorial_collections where slug = 'romantic-mauritius'), (select id from public.partners where slug = 'mauritius-sailing-co'), 2),
  ((select id from public.editorial_collections where slug = 'romantic-mauritius'), (select id from public.partners where slug = 'ile-aux-cerfs-vip'), 3),
  ((select id from public.editorial_collections where slug = 'romantic-mauritius'), (select id from public.partners where slug = 'mauritius-helicopter-tours'), 4),
  ((select id from public.editorial_collections where slug = 'romantic-mauritius'), (select id from public.partners where slug = 'the-cove-grand-baie'), 5),

  -- Family Adventures
  ((select id from public.editorial_collections where slug = 'family-adventures'), (select id from public.partners where slug = 'black-river-dolphins'), 1),
  ((select id from public.editorial_collections where slug = 'family-adventures'), (select id from public.partners where slug = 'pamplemousses-gardens'), 2),
  ((select id from public.editorial_collections where slug = 'family-adventures'), (select id from public.partners where slug = 'chamarel-adventure-park'), 3),
  ((select id from public.editorial_collections where slug = 'family-adventures'), (select id from public.partners where slug = 'eureka-house'), 4),
  ((select id from public.editorial_collections where slug = 'family-adventures'), (select id from public.partners where slug = 'electric-bike-mauritius'), 5),

  -- Taste of Mauritius
  ((select id from public.editorial_collections where slug = 'taste-of-mauritius'), (select id from public.partners where slug = 'la-table-du-chateau'), 1),
  ((select id from public.editorial_collections where slug = 'taste-of-mauritius'), (select id from public.partners where slug = 'rougaille-creole'), 2),
  ((select id from public.editorial_collections where slug = 'taste-of-mauritius'), (select id from public.partners where slug = 'le-chamarel-restaurant'), 3),
  ((select id from public.editorial_collections where slug = 'taste-of-mauritius'), (select id from public.partners where slug = 'azure-beach-grill'), 4),
  ((select id from public.editorial_collections where slug = 'taste-of-mauritius'), (select id from public.partners where slug = 'the-cove-grand-baie'), 5);
