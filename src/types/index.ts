export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface ApiError {
  error: string;
  fieldErrors?: Record<string, string>;
}

export const EVENT_CATEGORIES = [
  "Music",
  "Workshop",
  "Festival",
  "Tech",
  "Comedy",
  "Art",
  "Food",
  "Sports",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface Review {
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: EventCategory;
  image: string;
  gallery: string[];
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  seatsLeft: number;
  rating: number;
  reviews: Review[];
  organizerName: string;
  organizerId: string;
  createdAt: string;
}

export interface PaginatedEvents {
  events: EventItem[];
  total: number;
  page: number;
  totalPages: number;
}
