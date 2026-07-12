"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import type { EventItem } from "@/types";

const COLORS = { booked: "#F5A623", available: "#241B3A" };

export default function ManageEventsChart({ events }: { events: EventItem[] }) {
  const data = events.slice(0, 8).map((e) => ({
    name: e.title.length > 16 ? `${e.title.slice(0, 16)}…` : e.title,
    booked: e.capacity - e.seatsLeft,
    available: e.seatsLeft,
  }));

  return (
    <div className="rounded-card border border-black/5 bg-white p-5 shadow-sm">
      <h2 className="font-display text-xl tracking-wide text-ink">Seats booked vs. available</h2>
      <p className="text-sm text-mist">Across your {events.length > 8 ? "8 most recent" : ""} listed events</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C1B1F" strokeOpacity={0.08} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B6673" }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12, fill: "#6B6673" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", fontSize: 13 }}
              labelStyle={{ fontWeight: 600, color: "#1C1B1F" }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="booked" name="Booked" stackId="seats" fill={COLORS.booked} radius={[0, 0, 0, 0]} />
            <Bar dataKey="available" name="Available" stackId="seats" fill={COLORS.available} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
