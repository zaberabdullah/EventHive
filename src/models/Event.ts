import { Schema, model, models, Document, Types } from "mongoose";
import { EVENT_CATEGORIES } from "@/types";

export interface ReviewSubdoc {
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface EventDocument extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  image: string;
  gallery: string[];
  date: Date;
  time: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  seatsLeft: number;
  rating: number;
  reviews: ReviewSubdoc[];
  organizerName: string;
  organizerId: Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewSubdoc>(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EventSchema = new Schema<EventDocument>({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters"],
    maxlength: [100, "Title must be under 100 characters"],
  },
  shortDescription: {
    type: String,
    required: [true, "Short description is required"],
    trim: true,
    maxlength: [160, "Short description must be under 160 characters"],
  },
  fullDescription: {
    type: String,
    required: [true, "Full description is required"],
    trim: true,
    maxlength: [4000, "Full description must be under 4000 characters"],
  },
  category: {
    type: String,
    required: true,
    enum: EVENT_CATEGORIES,
  },
  image: { type: String, required: [true, "Cover image URL is required"] },
  gallery: { type: [String], default: [] },
  date: { type: Date, required: [true, "Date is required"] },
  time: { type: String, required: [true, "Time is required"] },
  venue: { type: String, required: [true, "Venue is required"], trim: true },
  city: { type: String, required: [true, "City is required"], trim: true },
  price: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  seatsLeft: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: [ReviewSchema], default: [] },
  organizerName: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

EventSchema.index({ title: "text", city: "text", venue: "text" });

export const Event = models.Event || model<EventDocument>("Event", EventSchema);
