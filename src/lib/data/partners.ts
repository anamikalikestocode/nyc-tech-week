import type { Partner, PartnerWithRelations, Region, Category, Tag, EditorialCollection } from "@/lib/types/database";

const regions: Region[] = [
  { id: "r-north", slug: "north", name_en: "North", name_fr: "Nord", description_en: "The vibrant north coast stretches from the cosmopolitan capital of Port Louis to the lively resort town of Grand Baie. Discover bustling markets, world-class restaurants, and a nightlife scene that pulses until dawn.", description_fr: "La côte nord vibrante s'étend de la capitale cosmopolite de Port Louis à la ville balnéaire animée de Grand Baie. Découvrez les marchés animés, les restaurants de classe mondiale et une vie nocturne qui vibre jusqu'à l'aube.", hero_image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80", display_order: 1, created_at: "" },
  { id: "r-east", slug: "east", name_en: "East", name_fr: "Est", description_en: "The east coast is home to the island's most pristine beaches — think powdery white sand meeting turquoise lagoons. Belle Mare and Île aux Cerfs offer world-class water sports and barefoot luxury.", description_fr: "La côte est abrite les plages les plus immaculées de l'île — du sable blanc poudreux rencontrant des lagons turquoise. Belle Mare et l'Île aux Cerfs offrent des sports nautiques de classe mondiale et un luxe pieds nus.", hero_image: "https://images.unsplash.com/photo-1597739239353-50270a473397?w=1200&q=80", display_order: 2, created_at: "" },
  { id: "r-south", slug: "south", name_en: "South", name_fr: "Sud", description_en: "The dramatic south is wild Mauritius at its finest. From the UNESCO-listed Le Morne Brabant to the seven-coloured earth of Chamarel and Black River Gorges, this is where nature reigns supreme.", description_fr: "Le sud dramatique est le Mauritius sauvage à son meilleur. Du Morne Brabant classé par l'UNESCO à la terre des sept couleurs de Chamarel et les gorges de Rivière Noire, c'est ici que la nature règne en maître.", hero_image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=80", display_order: 3, created_at: "" },
  { id: "r-west", slug: "west", name_en: "West", name_fr: "Ouest", description_en: "The west coast is where locals go for the best sunsets. Flic en Flac offers long sandy beaches, Tamarin is the surfing capital, and dolphin-watching at dawn is an unforgettable ritual.", description_fr: "La côte ouest est l'endroit où les locaux vont pour les plus beaux couchers de soleil. Flic en Flac offre de longues plages de sable, Tamarin est la capitale du surf, et l'observation des dauphins à l'aube est un rituel inoubliable.", hero_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", display_order: 4, created_at: "" },
];

const categories: Category[] = [
  { id: "c-restaurants", slug: "restaurants", name_en: "Restaurants & Fine Dining", name_fr: "Restaurants & Gastronomie", icon: "utensils", display_order: 1, created_at: "" },
  { id: "c-experiences", slug: "experiences-tours", name_en: "Experiences & Tours", name_fr: "Expériences & Excursions", icon: "sailboat", display_order: 2, created_at: "" },
  { id: "c-culture", slug: "culture-events", name_en: "Culture & Events", name_fr: "Culture & Événements", icon: "landmark", display_order: 3, created_at: "" },
  { id: "c-transport", slug: "premium-transport", name_en: "Premium Transport", name_fr: "Transport Premium", icon: "car", display_order: 4, created_at: "" },
];

const tags: Tag[] = [
  { id: "t-honeymoon", slug: "honeymoon", name_en: "Honeymoon", name_fr: "Lune de Miel", created_at: "" },
  { id: "t-family", slug: "family-friendly", name_en: "Family Friendly", name_fr: "Familial", created_at: "" },
  { id: "t-adventure", slug: "adventure", name_en: "Adventure", name_fr: "Aventure", created_at: "" },
  { id: "t-luxury", slug: "luxury", name_en: "Luxury", name_fr: "Luxe", created_at: "" },
  { id: "t-fine-dining", slug: "fine-dining", name_en: "Fine Dining", name_fr: "Gastronomie", created_at: "" },
  { id: "t-romantic", slug: "romantic", name_en: "Romantic", name_fr: "Romantique", created_at: "" },
  { id: "t-water-sports", slug: "water-sports", name_en: "Water Sports", name_fr: "Sports Nautiques", created_at: "" },
  { id: "t-nature", slug: "nature", name_en: "Nature & Wildlife", name_fr: "Nature & Faune", created_at: "" },
  { id: "t-cultural", slug: "cultural", name_en: "Cultural", name_fr: "Culturel", created_at: "" },
  { id: "t-sunset", slug: "sunset", name_en: "Sunset Experience", name_fr: "Expérience Coucher de Soleil", created_at: "" },
  { id: "t-beach", slug: "beach", name_en: "Beach", name_fr: "Plage", created_at: "" },
  { id: "t-local-cuisine", slug: "local-cuisine", name_en: "Local Cuisine", name_fr: "Cuisine Locale", created_at: "" },
  { id: "t-photography", slug: "photography", name_en: "Photography Worthy", name_fr: "Photogénique", created_at: "" },
  { id: "t-private", slug: "private", name_en: "Private Experience", name_fr: "Expérience Privée", created_at: "" },
  { id: "t-half-day", slug: "half-day", name_en: "Half Day", name_fr: "Demi-journée", created_at: "" },
  { id: "t-full-day", slug: "full-day", name_en: "Full Day", name_fr: "Journée Complète", created_at: "" },
  { id: "t-evening", slug: "evening", name_en: "Evening", name_fr: "Soirée", created_at: "" },
  { id: "t-group", slug: "group-friendly", name_en: "Group Friendly", name_fr: "Adapté aux Groupes", created_at: "" },
];

const partnerTagMap: Record<string, string[]> = {
  "le-chamarel-restaurant": ["t-fine-dining", "t-romantic", "t-honeymoon", "t-photography"],
  "the-cove-grand-baie": ["t-fine-dining", "t-romantic", "t-sunset"],
  "la-table-du-chateau": ["t-fine-dining", "t-luxury", "t-cultural"],
  "rougaille-creole": ["t-local-cuisine", "t-cultural", "t-family"],
  "azure-beach-grill": ["t-beach", "t-romantic", "t-sunset"],
  "ile-aux-cerfs-vip": ["t-luxury", "t-water-sports", "t-honeymoon", "t-private"],
  "black-river-dolphins": ["t-nature", "t-adventure", "t-family", "t-half-day"],
  "chamarel-adventure-park": ["t-adventure", "t-nature", "t-full-day", "t-group"],
  "mauritius-sailing-co": ["t-luxury", "t-honeymoon", "t-sunset", "t-private"],
  "deep-sea-fishing-club": ["t-adventure", "t-half-day", "t-group"],
  "aapravasi-ghat": ["t-cultural", "t-half-day", "t-family"],
  "eureka-house": ["t-cultural", "t-local-cuisine", "t-family"],
  "le-morne-heritage-trail": ["t-cultural", "t-adventure", "t-nature", "t-photography"],
  "sega-experience": ["t-cultural", "t-evening", "t-group"],
  "pamplemousses-gardens": ["t-nature", "t-family", "t-photography", "t-half-day"],
  "mauritius-helicopter-tours": ["t-luxury", "t-photography", "t-honeymoon"],
  "prestige-chauffeur": ["t-luxury", "t-private"],
  "ocean-seaplane": ["t-luxury", "t-photography", "t-honeymoon"],
  "classic-mauritius-tours": ["t-cultural", "t-full-day", "t-photography"],
  "electric-bike-mauritius": ["t-adventure", "t-nature", "t-sunset"],
};

const partners: Partner[] = [
  { id: "p-1", slug: "le-chamarel-restaurant", name: "Le Chamarel Restaurant", description_en: "Perched on the hills of Chamarel with panoramic views over the west coast, Le Chamarel serves refined Mauritian-French fusion cuisine using locally sourced ingredients. The open-air terrace is the perfect setting for a long, languid lunch.", description_fr: "Perché sur les collines de Chamarel avec une vue panoramique sur la côte ouest, Le Chamarel sert une cuisine fusion mauricienne-française raffinée à base d'ingrédients locaux.", short_desc_en: "Mauritian-French hilltop dining with panoramic views", short_desc_fr: "Gastronomie mauricienne-française en altitude avec vue panoramique", category_id: "c-restaurants", region_id: "r-south", price_range: "$$$$", signature_offers: [{ en: "7-course tasting menu with wine pairing", fr: "Menu dégustation 7 plats avec accord mets-vins" }, { en: "Private terrace for two", fr: "Terrasse privée pour deux" }], address: "Chamarel, Black River", latitude: -20.438, longitude: 57.379, phone: "+230 483 6421", email: null, website: "https://example.com/le-chamarel", hero_image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", quality_score: 95, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-2", slug: "the-cove-grand-baie", name: "The Cove", description_en: "An intimate seafood restaurant tucked into a rocky cove on the north coast. The Cove is where Grand Baie's discerning diners come for the freshest catch, grilled over charcoal and served with Creole sides.", description_fr: "Un restaurant de fruits de mer intimiste niché dans une crique rocheuse sur la côte nord.", short_desc_en: "Intimate seafood restaurant in a rocky cove", short_desc_fr: "Restaurant de fruits de mer intimiste dans une crique rocheuse", category_id: "c-restaurants", region_id: "r-north", price_range: "$$$", signature_offers: [{ en: "Lobster & champagne sunset dinner", fr: "Dîner homard & champagne au coucher du soleil" }, { en: "Chef's catch of the day", fr: "Prise du jour du chef" }], address: "Grand Baie, Rivière du Rempart", latitude: -20.0095, longitude: 57.5826, phone: "+230 263 8900", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", quality_score: 90, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-3", slug: "la-table-du-chateau", name: "La Table du Château", description_en: "Set within the historic Château de Labourdonnais, this elegant restaurant pairs estate-grown produce with contemporary Mauritian fine dining. The rum distillery on-site means exceptional rum pairings with every course.", description_fr: "Situé dans l'historique Château de Labourdonnais, ce restaurant élégant associe les produits cultivés sur le domaine à une gastronomie mauricienne contemporaine.", short_desc_en: "Estate dining at a historic château with rum pairings", short_desc_fr: "Gastronomie au château historique avec accords rhum", category_id: "c-restaurants", region_id: "r-north", price_range: "$$$$", signature_offers: [{ en: "Estate tour + 5-course lunch with rum pairing", fr: "Visite du domaine + déjeuner 5 plats avec accord rhum" }, { en: "Private dining in the orangery", fr: "Dîner privé dans l'orangerie" }], address: "Mapou, Rivière du Rempart", latitude: -20.0833, longitude: 57.6167, phone: "+230 266 9533", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", quality_score: 92, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-4", slug: "rougaille-creole", name: "Rougaille Créole", description_en: "A beloved local institution in Port Louis, Rougaille Créole serves authentic home-style Mauritian cooking in a charming colonial house. The dholl puri and rougaille are the stuff of legend.", description_fr: "Une institution locale bien-aimée à Port Louis, Rougaille Créole sert une cuisine mauricienne authentique de style maison dans une charmante maison coloniale.", short_desc_en: "Authentic Mauritian home cooking in colonial Port Louis", short_desc_fr: "Cuisine mauricienne authentique dans le Port Louis colonial", category_id: "c-restaurants", region_id: "r-north", price_range: "$$", signature_offers: [{ en: "Mauritian cooking class + lunch", fr: "Cours de cuisine mauricienne + déjeuner" }, { en: "Market tour with the chef", fr: "Visite du marché avec le chef" }], address: "Port Louis", latitude: -20.1609, longitude: 57.4989, phone: "+230 212 3456", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", quality_score: 88, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-5", slug: "azure-beach-grill", name: "Azure Beach Grill", description_en: "Toes-in-the-sand dining at Belle Mare's most exclusive beach. Azure serves Mediterranean-Mauritian plates with an emphasis on grilled seafood, tropical cocktails, and effortless barefoot elegance.", description_fr: "Dîner pieds dans le sable sur la plage la plus exclusive de Belle Mare.", short_desc_en: "Barefoot beachfront dining at Belle Mare", short_desc_fr: "Restaurant pieds nus en bord de plage à Belle Mare", category_id: "c-restaurants", region_id: "r-east", price_range: "$$$", signature_offers: [{ en: "Beach barbecue at sunset", fr: "Barbecue sur la plage au coucher du soleil" }, { en: "Private cabana dinner", fr: "Dîner en cabana privée" }], address: "Belle Mare, Flacq", latitude: -20.19, longitude: 57.76, phone: "+230 415 2000", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", quality_score: 89, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-6", slug: "ile-aux-cerfs-vip", name: "Île aux Cerfs VIP Experience", description_en: "Skip the crowds with a private speedboat transfer to Île aux Cerfs. Your dedicated guide arranges the best snorkelling spots, a gourmet beach picnic, and parasailing — all without sharing the moment.", description_fr: "Évitez la foule avec un transfert privé en vedette rapide vers l'Île aux Cerfs.", short_desc_en: "Private speedboat & VIP access to Île aux Cerfs", short_desc_fr: "Vedette privée & accès VIP à l'Île aux Cerfs", category_id: "c-experiences", region_id: "r-east", price_range: "$$$$", signature_offers: [{ en: "Private speedboat + gourmet beach picnic", fr: "Vedette privée + pique-nique gastronomique" }, { en: "Parasailing & snorkelling package", fr: "Parachute ascensionnel & plongée" }], address: "Trou d'Eau Douce, Flacq", latitude: -20.238, longitude: 57.79, phone: "+230 480 1234", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", quality_score: 94, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-7", slug: "black-river-dolphins", name: "Dolphin Dawn Encounter", description_en: "Set out at first light from Tamarin Bay for an ethical dolphin-watching experience. Swim alongside spinner and bottlenose dolphins in their natural habitat, guided by marine biologists who prioritise the animals' welfare.", description_fr: "Partez dès l'aube de la Baie de Tamarin pour une expérience éthique d'observation des dauphins.", short_desc_en: "Ethical dawn dolphin swim at Tamarin Bay", short_desc_fr: "Nage éthique avec les dauphins à l'aube à Tamarin", category_id: "c-experiences", region_id: "r-west", price_range: "$$$", signature_offers: [{ en: "Dawn dolphin swim + breakfast on the boat", fr: "Nage avec les dauphins à l'aube + petit-déjeuner" }, { en: "Marine biology guided snorkelling", fr: "Plongée guidée par un biologiste marin" }], address: "Tamarin, Black River", latitude: -20.325, longitude: 57.372, phone: "+230 483 7890", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&q=80", quality_score: 93, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-8", slug: "chamarel-adventure-park", name: "Chamarel Adventure Park", description_en: "Zip-line over the canopy of Black River Gorges, abseil down waterfalls, and hike through indigenous ebony forest. Chamarel Adventure Park combines adrenaline with ecology for the ultimate active day out.", description_fr: "Survolez la canopée des Gorges de Rivière Noire en tyrolienne, descendez en rappel des cascades et randonnez à travers la forêt d'ébène indigène.", short_desc_en: "Ziplines, canyoning & forest hikes at Chamarel", short_desc_fr: "Tyroliennes, canyoning & randonnées à Chamarel", category_id: "c-experiences", region_id: "r-south", price_range: "$$", signature_offers: [{ en: "Full-day adventure package", fr: "Forfait aventure journée complète" }, { en: "Private guided night hike", fr: "Randonnée nocturne privée guidée" }], address: "Chamarel, Black River", latitude: -20.433, longitude: 57.381, phone: "+230 234 5678", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80", quality_score: 87, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-9", slug: "mauritius-sailing-co", name: "Mauritius Sailing Co.", description_en: "Luxury catamaran charters along the north and west coasts. Whether it's a half-day sunset cruise or a full-day island-hopping adventure, the crew handles everything from gourmet catering to water toys.", description_fr: "Location de catamarans de luxe le long des côtes nord et ouest.", short_desc_en: "Luxury catamaran charters along the coast", short_desc_fr: "Location de catamarans de luxe le long de la côte", category_id: "c-experiences", region_id: "r-north", price_range: "$$$$", signature_offers: [{ en: "Sunset champagne cruise (4 hours)", fr: "Croisière champagne au coucher du soleil (4h)" }, { en: "Private full-day island hopping", fr: "Excursion privée d'île en île" }], address: "Grand Baie, Rivière du Rempart", latitude: -20.0095, longitude: 57.5826, phone: "+230 263 4567", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80", quality_score: 91, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-10", slug: "deep-sea-fishing-club", name: "Marlin Coast Fishing Club", description_en: "Mauritius is one of the world's premier big-game fishing destinations. Board a purpose-built sports fishing boat out of Grand Baie and chase marlin, tuna, and wahoo with an experienced captain.", description_fr: "L'île Maurice est l'une des premières destinations mondiales de pêche au gros.", short_desc_en: "Big-game sport fishing from Grand Baie", short_desc_fr: "Pêche sportive au gros au départ de Grand Baie", category_id: "c-experiences", region_id: "r-north", price_range: "$$$", signature_offers: [{ en: "Half-day big game fishing", fr: "Demi-journée pêche au gros" }, { en: "Full-day deep sea + reef fishing combo", fr: "Journée complète pêche hauturière + récif" }], address: "Grand Baie, Rivière du Rempart", latitude: -20.0095, longitude: 57.5826, phone: "+230 263 8888", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1534575990805-a8c32b1001d0?w=800&q=80", quality_score: 86, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-11", slug: "aapravasi-ghat", name: "Aapravasi Ghat Heritage Walk", description_en: "A guided walk through the UNESCO World Heritage Site where indentured labourers first set foot in Mauritius. Expert historians bring to life the island's complex, multicultural origins.", description_fr: "Une visite guidée du site du patrimoine mondial de l'UNESCO où les travailleurs engagés ont posé le pied à Maurice.", short_desc_en: "UNESCO heritage walk through Mauritius' immigration history", short_desc_fr: "Visite guidée UNESCO de l'histoire de l'immigration mauricienne", category_id: "c-culture", region_id: "r-north", price_range: "$$", signature_offers: [{ en: "Private guided heritage tour (2 hours)", fr: "Visite guidée privée du patrimoine (2h)" }, { en: "Heritage walk + Port Louis market tour", fr: "Visite patrimoine + marché de Port Louis" }], address: "Port Louis", latitude: -20.1609, longitude: 57.5, phone: "+230 217 5678", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80", quality_score: 88, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-12", slug: "eureka-house", name: "Eureka House", description_en: "Step into the 19th century at one of the island's finest colonial mansions. Eureka House offers guided tours through its 109 doors, lush tropical gardens, and a restaurant serving authentic Creole cuisine.", description_fr: "Plongez dans le 19e siècle dans l'une des plus belles demeures coloniales de l'île.", short_desc_en: "19th-century colonial mansion with Creole lunch", short_desc_fr: "Demeure coloniale du 19e siècle avec déjeuner créole", category_id: "c-culture", region_id: "r-north", price_range: "$$", signature_offers: [{ en: "Guided mansion tour + Creole lunch", fr: "Visite guidée + déjeuner créole" }, { en: "Private garden & history experience", fr: "Expérience privée jardin & histoire" }], address: "Moka", latitude: -20.2167, longitude: 57.4833, phone: "+230 433 8477", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80", quality_score: 85, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-13", slug: "le-morne-heritage-trail", name: "Le Morne Heritage Trail", description_en: "A guided hike up the UNESCO-listed Le Morne Brabant, retracing the footsteps of runaway slaves who found refuge on this dramatic basalt peak. The summit offers breathtaking 360° views of the lagoon.", description_fr: "Une randonnée guidée sur le Morne Brabant classé par l'UNESCO, retraçant les pas des esclaves en fuite.", short_desc_en: "UNESCO-listed heritage hike with lagoon views", short_desc_fr: "Randonnée patrimoine UNESCO avec vue sur le lagon", category_id: "c-culture", region_id: "r-south", price_range: "$$", signature_offers: [{ en: "Sunrise heritage hike (4 hours)", fr: "Randonnée patrimoine au lever du soleil (4h)" }, { en: "Private historian-led trail", fr: "Sentier privé guidé par un historien" }], address: "Le Morne, Black River", latitude: -20.449, longitude: 57.317, phone: "+230 601 2345", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1580394693539-d6122b0a6944?w=800&q=80", quality_score: 91, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-14", slug: "sega-experience", name: "Séga Tipik Experience", description_en: "Immerse yourself in the rhythms of séga, the traditional Creole music and dance of Mauritius. This intimate evening experience pairs live séga performance with local rum, storytelling, and a Creole feast.", description_fr: "Plongez-vous dans les rythmes du séga, la musique et danse créole traditionnelle de Maurice.", short_desc_en: "Live séga music, dance & Creole feast", short_desc_fr: "Séga en direct, danse & festin créole", category_id: "c-culture", region_id: "r-west", price_range: "$$", signature_offers: [{ en: "Evening séga show + dinner + rum tasting", fr: "Spectacle séga + dîner + dégustation de rhum" }, { en: "Private séga & dance lesson", fr: "Cours privé de séga & danse" }], address: "Flic en Flac, Black River", latitude: -20.296, longitude: 57.371, phone: "+230 453 6789", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80", quality_score: 87, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-15", slug: "pamplemousses-gardens", name: "Sir Seewoosagur Ramgoolam Botanical Garden", description_en: "One of the oldest botanical gardens in the Southern Hemisphere. Home to the giant Victoria amazonica water lilies, a spice garden, and over 80 varieties of palm.", description_fr: "L'un des plus anciens jardins botaniques de l'hémisphère sud.", short_desc_en: "Historic botanical garden with giant water lilies", short_desc_fr: "Jardin botanique historique avec nénuphars géants", category_id: "c-culture", region_id: "r-north", price_range: "$", signature_offers: [{ en: "Guided botanical tour (90 minutes)", fr: "Visite botanique guidée (90 minutes)" }, { en: "Photography tour at golden hour", fr: "Visite photo à l'heure dorée" }], address: "Pamplemousses", latitude: -20.107, longitude: 57.58, phone: "+230 243 9401", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80", quality_score: 84, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-16", slug: "mauritius-helicopter-tours", name: "Mauritius Helicopter Tours", description_en: "See the island from above with spectacular helicopter flights over Le Morne, the underwater waterfall illusion, Chamarel's coloured earth, and the emerald peaks. Custom routes available.", description_fr: "Découvrez l'île vue du ciel avec des vols en hélicoptère spectaculaires.", short_desc_en: "Scenic helicopter flights over Mauritius' landmarks", short_desc_fr: "Vols panoramiques en hélicoptère au-dessus de Maurice", category_id: "c-transport", region_id: "r-west", price_range: "$$$$", signature_offers: [{ en: "Underwater waterfall flight (30 min)", fr: "Vol cascade sous-marine (30 min)" }, { en: "Full island tour (60 min)", fr: "Tour complet de l'île (60 min)" }], address: "SSR International Airport", latitude: -20.4302, longitude: 57.6836, phone: "+230 603 3500", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80", quality_score: 96, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-17", slug: "prestige-chauffeur", name: "Prestige Chauffeur Services", description_en: "Door-to-door luxury transfers in a Mercedes S-Class or Range Rover with professional, English and French-speaking drivers.", description_fr: "Transferts de luxe porte-à-porte en Mercedes Classe S ou Range Rover avec chauffeurs professionnels bilingues.", short_desc_en: "Mercedes & Range Rover private chauffeur service", short_desc_fr: "Service de chauffeur privé Mercedes & Range Rover", category_id: "c-transport", region_id: "r-north", price_range: "$$$", signature_offers: [{ en: "Airport VIP meet & greet transfer", fr: "Transfert aéroport VIP" }, { en: "Full-day island touring with chauffeur", fr: "Excursion journée avec chauffeur" }], address: "Port Louis", latitude: -20.1609, longitude: 57.4989, phone: "+230 5700 0000", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80", quality_score: 90, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-18", slug: "ocean-seaplane", name: "Ocean Seaplane Adventures", description_en: "Land directly on the lagoon with a scenic seaplane transfer to the east coast or Île aux Cerfs. A transport experience that's an attraction in itself.", description_fr: "Atterrissez directement sur le lagon avec un transfert en hydravion panoramique.", short_desc_en: "Scenic seaplane lagoon landings", short_desc_fr: "Atterrissages panoramiques en hydravion sur le lagon", category_id: "c-transport", region_id: "r-east", price_range: "$$$$", signature_offers: [{ en: "Seaplane transfer to Île aux Cerfs", fr: "Transfert en hydravion vers l'Île aux Cerfs" }, { en: "Aerial photography flight", fr: "Vol photographie aérienne" }], address: "Mahébourg, Grand Port", latitude: -20.41, longitude: 57.7, phone: "+230 604 1234", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80", quality_score: 93, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-19", slug: "classic-mauritius-tours", name: "Classic Mauritius Tours", description_en: "Explore the island in style aboard a restored 1960s Land Rover. Themed routes cover tea plantations, rum distilleries, and hidden coastal villages.", description_fr: "Explorez l'île avec style à bord d'un Land Rover restauré des années 1960.", short_desc_en: "Vintage Land Rover island tours", short_desc_fr: "Excursions en Land Rover vintage sur l'île", category_id: "c-transport", region_id: "r-south", price_range: "$$$", signature_offers: [{ en: "Tea & rum route (full day)", fr: "Route du thé & rhum (journée)" }, { en: "Hidden south coast tour (half day)", fr: "Tour de la côte sud cachée (demi-journée)" }], address: "Mahébourg, Grand Port", latitude: -20.41, longitude: 57.7, phone: "+230 631 5678", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", quality_score: 88, status: "approved", owner_id: null, created_at: "", updated_at: "" },
  { id: "p-20", slug: "electric-bike-mauritius", name: "E-Bike Mauritius", description_en: "Premium electric bike hire with curated route maps covering coastal paths, mountain trails, and village circuits. Self-guided or with a local cycling guide who knows every shortcut.", description_fr: "Location de vélos électriques premium avec cartes d'itinéraires couvrant sentiers côtiers, pistes de montagne et circuits villageois.", short_desc_en: "Premium e-bike hire with curated island routes", short_desc_fr: "Location de vélos électriques premium avec itinéraires", category_id: "c-transport", region_id: "r-west", price_range: "$$", signature_offers: [{ en: "Coastal sunset ride (3 hours)", fr: "Balade côtière au coucher du soleil (3h)" }, { en: "Mountain trail with guide (full day)", fr: "Piste de montagne avec guide (journée)" }], address: "Flic en Flac, Black River", latitude: -20.296, longitude: 57.371, phone: "+230 5800 1234", email: null, website: null, hero_image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80", quality_score: 85, status: "approved", owner_id: null, created_at: "", updated_at: "" },
];

const collections: EditorialCollection[] = [
  { id: "col-1", slug: "romantic-mauritius", title_en: "Romantic Mauritius", title_fr: "Maurice Romantique", subtitle_en: "For lovers, by lovers", subtitle_fr: "Pour les amoureux, par les amoureux", description_en: "Our hand-picked selection of the most romantic experiences on the island — from clifftop dinners to private catamaran cruises.", description_fr: "Notre sélection des expériences les plus romantiques de l'île — des dîners en falaise aux croisières privées en catamaran.", hero_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", display_order: 1, published: true, created_at: "" },
  { id: "col-2", slug: "family-adventures", title_en: "Family Adventures", title_fr: "Aventures en Famille", subtitle_en: "Making memories together", subtitle_fr: "Créer des souvenirs ensemble", description_en: "Kid-tested, parent-approved. From dolphin encounters to botanical gardens, these experiences bring families together.", description_fr: "Testés par les enfants, approuvés par les parents. Des rencontres avec les dauphins aux jardins botaniques.", hero_image: "https://images.unsplash.com/photo-1597739239353-50270a473397?w=1200&q=80", display_order: 2, published: true, created_at: "" },
  { id: "col-3", slug: "taste-of-mauritius", title_en: "A Taste of Mauritius", title_fr: "Les Saveurs de Maurice", subtitle_en: "The island on a plate", subtitle_fr: "L'île dans une assiette", description_en: "From Michelin-worthy fine dining to street-side dholl puri, discover the flavours that make Mauritius one of the Indian Ocean's great culinary destinations.", description_fr: "De la gastronomie étoilée au dholl puri de rue, découvrez les saveurs qui font de Maurice l'une des grandes destinations culinaires de l'océan Indien.", hero_image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80", display_order: 3, published: true, created_at: "" },
];

const collectionPartnerMap: Record<string, string[]> = {
  "romantic-mauritius": ["le-chamarel-restaurant", "mauritius-sailing-co", "ile-aux-cerfs-vip", "mauritius-helicopter-tours", "the-cove-grand-baie"],
  "family-adventures": ["black-river-dolphins", "pamplemousses-gardens", "chamarel-adventure-park", "eureka-house", "electric-bike-mauritius"],
  "taste-of-mauritius": ["la-table-du-chateau", "rougaille-creole", "le-chamarel-restaurant", "azure-beach-grill", "the-cove-grand-baie"],
};

function getTagsForPartner(slug: string): Tag[] {
  const tagIds = partnerTagMap[slug] ?? [];
  return tags.filter((t) => tagIds.includes(t.id));
}

export function getAllRegions(): Region[] {
  return regions;
}

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllTags(): Tag[] {
  return tags;
}

export function getAllPartners(): PartnerWithRelations[] {
  return partners.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.category_id),
    region: regions.find((r) => r.id === p.region_id),
    tags: getTagsForPartner(p.slug),
  }));
}

export function getPartnerBySlug(slug: string): PartnerWithRelations | undefined {
  const p = partners.find((p) => p.slug === slug);
  if (!p) return undefined;
  return {
    ...p,
    category: categories.find((c) => c.id === p.category_id),
    region: regions.find((r) => r.id === p.region_id),
    tags: getTagsForPartner(p.slug),
  };
}

export function getPartnersByRegion(regionSlug: string): PartnerWithRelations[] {
  const region = regions.find((r) => r.slug === regionSlug);
  if (!region) return [];
  return getAllPartners().filter((p) => p.region_id === region.id);
}

export function getPartnersByCategory(categorySlug: string): PartnerWithRelations[] {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return getAllPartners().filter((p) => p.category_id === category.id);
}

export function getAllCollections(): EditorialCollection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): { collection: EditorialCollection; partners: PartnerWithRelations[] } | undefined {
  const col = collections.find((c) => c.slug === slug);
  if (!col) return undefined;
  const slugs = collectionPartnerMap[col.slug] ?? [];
  const colPartners = slugs
    .map((s) => getPartnerBySlug(s))
    .filter((p): p is PartnerWithRelations => !!p);
  return { collection: col, partners: colPartners };
}

export function searchPartners(query: {
  region?: string;
  category?: string;
  tags?: string[];
  priceRange?: string[];
  q?: string;
}): PartnerWithRelations[] {
  let results = getAllPartners();

  if (query.region) {
    const region = regions.find((r) => r.slug === query.region);
    if (region) results = results.filter((p) => p.region_id === region.id);
  }

  if (query.category) {
    const cat = categories.find((c) => c.slug === query.category);
    if (cat) results = results.filter((p) => p.category_id === cat.id);
  }

  if (query.tags && query.tags.length > 0) {
    results = results.filter((p) =>
      query.tags!.some((tagSlug) => p.tags?.some((t) => t.slug === tagSlug))
    );
  }

  if (query.priceRange && query.priceRange.length > 0) {
    results = results.filter((p) => query.priceRange!.includes(p.price_range));
  }

  if (query.q) {
    const lower = query.q.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.short_desc_en?.toLowerCase().includes(lower) ||
        p.short_desc_fr?.toLowerCase().includes(lower) ||
        p.description_en?.toLowerCase().includes(lower) ||
        p.description_fr?.toLowerCase().includes(lower)
    );
  }

  return results.sort((a, b) => b.quality_score - a.quality_score);
}
