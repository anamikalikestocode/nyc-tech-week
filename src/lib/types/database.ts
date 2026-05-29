export type UserRole = "traveller" | "partner" | "admin";
export type PartnerStatus = "pending" | "approved" | "rejected";
export type PriceRange = "$" | "$$" | "$$$" | "$$$$";
export type MediaType = "image" | "video";
export type LeadStatus = "new" | "contacted" | "converted" | "closed";
export type MessageRole = "user" | "assistant" | "system";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  locale: "en" | "fr";
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  description_en: string | null;
  description_fr: string | null;
  hero_image: string | null;
  display_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  created_at: string;
}

export interface SignatureOffer {
  en: string;
  fr: string;
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  description_en: string | null;
  description_fr: string | null;
  short_desc_en: string | null;
  short_desc_fr: string | null;
  category_id: string;
  region_id: string;
  price_range: PriceRange;
  signature_offers: SignatureOffer[];
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  hero_image: string | null;
  quality_score: number;
  status: PartnerStatus;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerWithRelations extends Partner {
  category?: Category;
  region?: Region;
  tags?: Tag[];
  media?: PartnerMedia[];
}

export interface PartnerMedia {
  id: string;
  partner_id: string;
  url: string;
  media_type: MediaType;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface EditorialCollection {
  id: string;
  slug: string;
  title_en: string;
  title_fr: string;
  subtitle_en: string | null;
  subtitle_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  hero_image: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string | null;
  anon_session: string | null;
  title: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tool_calls: unknown | null;
  feedback: -1 | 0 | 1 | null;
  created_at: string;
}

export interface Itinerary {
  id: string;
  user_id: string | null;
  anon_session: string | null;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  share_token: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  title: string | null;
  notes: string | null;
  created_at: string;
}

export interface ItineraryItem {
  id: string;
  day_id: string;
  partner_id: string | null;
  title: string;
  description: string | null;
  time_slot: string | null;
  sort_order: number;
  created_at: string;
}

export interface Lead {
  id: string;
  partner_id: string;
  user_id: string | null;
  itinerary_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  travel_dates: string | null;
  group_size: number | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}
