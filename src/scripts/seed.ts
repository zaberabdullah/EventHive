/**
 * Seeds demo accounts and sample events.
 * Run with: npm run seed
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { User } from "../models/User";
import { Event } from "../models/Event";
import { hashPassword } from "../lib/auth";

const DEMO_ACCOUNTS = [
  { name: "Demo User", email: "demo.user@eventhive.app", password: "DemoUser123", role: "user" as const },
  { name: "Demo Admin", email: "demo.admin@eventhive.app", password: "DemoAdmin123", role: "admin" as const },
];

function img(id: number) {
  return `https://picsum.photos/id/${id}/800/600`;
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

const RAW_EVENTS = [
  // Music
  { title: "Midnight Frequencies: Indie Night", category: "Music", city: "Austin", venue: "The Parish", days: 12, time: "9:00 PM", price: 35, capacity: 300, rating: 4.7, img: 237,
    short: "A night of indie and dream-pop acts on Austin's most intimate stage.",
    full: "Four rising indie acts share the bill for one night at The Parish. Expect layered guitars, warm analog synths, and a crowd that actually listens. Doors at 8, first act at 9. Full bar, standing room only." },
  { title: "Brass & Bass Block Party", category: "Music", city: "New York", venue: "Brooklyn Steel", days: 20, time: "7:30 PM", price: 45, capacity: 800, rating: 4.5, img: 1011,
    short: "A brass band and a bass-heavy DJ set trade the stage all night.",
    full: "Brooklyn Steel hosts a genre-bending night where a nine-piece brass band opens for a bass DJ collective. Two very different sounds, one very loud room. All ages until 10pm, 21+ after." },
  { title: "Sunset Sessions: Acoustic Rooftop", category: "Music", city: "Miami", venue: "The Rooftop at 1 Hotel", days: 6, time: "6:00 PM", price: 25, capacity: 150, rating: 4.8, img: 1015,
    short: "Stripped-down acoustic sets as the sun goes down over the bay.", 
    full: "Three singer-songwriters perform stripped-back acoustic sets as the sun sets over Biscayne Bay. Bring nothing but good company — seating is first-come, first-served on the rooftop lawn." },
  { title: "Symphony Under the Stars", category: "Music", city: "Chicago", venue: "Millennium Park Pavilion", days: 34, time: "8:00 PM", price: 0, capacity: 5000, rating: 4.9, img: 1025,
    short: "Free open-air symphony performance at the Pritzker Pavilion.",
    full: "The city orchestra performs a free open-air concert at Millennium Park, featuring a program of film scores and classic overtures. Bring a blanket — lawn seating is unreserved and first-come, first-served." },

  // Workshop
  { title: "Hand-Building Ceramics Intensive", category: "Workshop", city: "Austin", venue: "Clay Collective Studio", days: 9, time: "10:00 AM", price: 85, capacity: 12, rating: 4.9, img: 431,
    short: "A full-day hands-on ceramics workshop — no experience required.",
    full: "Spend a full day learning pinch, coil, and slab hand-building techniques. All materials and firing included; you'll receive your finished, glazed pieces about three weeks after the workshop. Small group, lots of one-on-one guidance." },
  { title: "Intro to Bread Baking", category: "Workshop", city: "Seattle", venue: "The Grain Kitchen", days: 15, time: "9:30 AM", price: 60, capacity: 16, rating: 4.6, img: 292,
    short: "Learn to make a proper sourdough loaf from scratch, start to finish.",
    full: "This hands-on class covers building and maintaining a starter, shaping, scoring, and baking a crusty sourdough loaf. You'll leave with your own loaf, a starter to take home, and a printed recipe booklet." },
  { title: "Watercolor Fundamentals", category: "Workshop", city: "Los Angeles", venue: "Sunset Art Studio", days: 18, time: "1:00 PM", price: 40, capacity: 20, rating: 4.4, img: 1062,
    short: "A relaxed afternoon covering wet-on-wet technique and color mixing.",
    full: "Perfect for beginners — this three-hour class covers paper prep, wet-on-wet blending, and basic color theory. All supplies provided, and you'll finish two small studies to take home." },
  { title: "Public Speaking Bootcamp", category: "Workshop", city: "New York", venue: "Midtown Collab Space", days: 25, time: "10:00 AM", price: 120, capacity: 25, rating: 4.5, img: 180,
    short: "A one-day intensive to build confident, structured public speaking.",
    full: "A full day of practical exercises — structuring a talk, handling nerves, reading a room, and Q&A technique. Every participant gives two short talks and receives recorded feedback." },

  // Festival
  { title: "Riverside Food & Music Festival", category: "Festival", city: "Austin", venue: "Auditorium Shores", days: 40, time: "12:00 PM", price: 55, capacity: 10000, rating: 4.6, img: 1080,
    short: "A weekend of food trucks, local bands, and riverside views.",
    full: "Two full days along Lady Bird Lake with over 40 food vendors, three music stages, and a dedicated kids' zone. Single-day and weekend passes available; weekend pass includes reserved shaded seating." },
  { title: "Lantern Festival of Lights", category: "Festival", city: "Los Angeles", venue: "Griffith Park", days: 50, time: "6:00 PM", price: 30, capacity: 6000, rating: 4.7, img: 1043,
    short: "Thousands of illuminated lanterns and night market stalls.",
    full: "An evening festival featuring illuminated lantern displays, a night market with local artisans, and live cultural performances. Gates open at 6, lantern lighting ceremony at 8:30 sharp." },
  { title: "Harvest & Craft Beer Festival", category: "Festival", city: "Chicago", venue: "Grant Park", days: 28, time: "1:00 PM", price: 40, capacity: 4000, rating: 4.3, img: 431,
    short: "Local breweries, live music, and a farmers market in one afternoon.",
    full: "Sample pours from 25 regional breweries, browse a seasonal farmers market, and catch live sets from local bands. Tasting glass and 10 tasting tickets included with entry; 21+ event." },
  { title: "Winter Wonder Festival", category: "Festival", city: "Seattle", venue: "Seattle Center", days: 65, time: "11:00 AM", price: 20, capacity: 8000, rating: 4.5, img: 1039,
    short: "Ice sculptures, holiday markets, and family activities downtown.",
    full: "A family-friendly winter festival with an ice sculpture garden, holiday craft market, and a full schedule of live performances on the main stage. Free for children under 5." },

  // Tech
  { title: "Frontend Frontiers Conference", category: "Tech", city: "New York", venue: "Javits Center", days: 45, time: "9:00 AM", price: 199, capacity: 1200, rating: 4.6, img: 180,
    short: "A full day of talks on the state of frontend engineering.",
    full: "Twelve speakers across two tracks cover performance, design systems, framework trends, and accessibility. Includes lunch, an evening networking mixer, and access to recorded sessions afterward." },
  { title: "AI & Product Meetup", category: "Tech", city: "Austin", venue: "Capital Factory", days: 8, time: "6:30 PM", price: 0, capacity: 150, rating: 4.4, img: 160,
    short: "A free evening meetup on building products with AI in the loop.",
    full: "Three short talks from local founders and engineers on shipping AI-powered features, followed by open networking with drinks and snacks. Free, but registration is required due to limited capacity." },
  { title: "Startup Pitch Night", category: "Tech", city: "Los Angeles", venue: "WeWork Arts District", days: 22, time: "6:00 PM", price: 15, capacity: 200, rating: 4.2, img: 1074,
    short: "Ten early-stage startups pitch live to a panel of investors.",
    full: "Ten founders get five minutes each to pitch, followed by live Q&A from a panel of local investors. Audience votes for a fan-favorite award. Networking reception follows the pitches." },
  { title: "Cloud Infrastructure Summit", category: "Tech", city: "Chicago", venue: "McCormick Place", days: 58, time: "8:30 AM", price: 249, capacity: 900, rating: 4.7, img: 60,
    short: "Deep-dive sessions on scaling infrastructure for growing teams.",
    full: "A full day of deep technical sessions on infrastructure scaling, cost optimization, and reliability engineering, led by practitioners from mid-size and large tech companies. Catered breakfast and lunch included." },

  // Comedy
  { title: "Stand-Up Showcase: Fresh Faces", category: "Comedy", city: "New York", venue: "The Comedy Cellar", days: 5, time: "8:00 PM", price: 20, capacity: 120, rating: 4.5, img: 823,
    short: "Six up-and-coming comedians, one late show.",
    full: "A tight, fast-moving showcase featuring six comedians building their sets ahead of festival season. Two-drink minimum, cash bar. Seating is general admission, doors open 30 minutes before showtime." },
  { title: "Improv All-Stars", category: "Comedy", city: "Chicago", venue: "iO Theater", days: 11, time: "7:30 PM", price: 25, capacity: 200, rating: 4.8, img: 823,
    short: "Long-form improv from some of the city's most experienced players.",
    full: "A single 90-minute long-form improv set built entirely from audience suggestions. This cast has performed together for over five years and it shows — expect callbacks, character work, and a genuinely surprising through-line." },
  { title: "Late Night Roast Battle", category: "Comedy", city: "Los Angeles", venue: "The Laugh Factory", days: 17, time: "10:00 PM", price: 30, capacity: 250, rating: 4.3, img: 823,
    short: "Comedians face off in head-to-head roast battles, audience judges.",
    full: "Eight comedians pair off in three rounds of head-to-head roasts, with the audience deciding each winner by applause meter. Hosted by a rotating local headliner. 18+ due to language." },

  // Art
  { title: "Contemporary Voices: Group Exhibition", category: "Art", city: "New York", venue: "Chelsea Arts Gallery", days: 14, time: "6:00 PM", price: 0, capacity: 300, rating: 4.6, img: 1062,
    short: "Opening night for a group show featuring six emerging painters.",
    full: "Opening reception for a group exhibition featuring six emerging painters working in figurative and abstract styles. Wine and light bites served; several artists will be present to talk about their work." },
  { title: "Sculpture Garden Night Walk", category: "Art", city: "Miami", venue: "The Bass Museum", days: 27, time: "7:00 PM", price: 18, capacity: 100, rating: 4.5, img: 1080,
    short: "A guided evening walk through an illuminated outdoor sculpture garden.",
    full: "A docent-led evening walk through the museum's outdoor sculpture garden, lit for the occasion. Small groups of 15, roughly 60 minutes, ending with a short talk and Q&A near the main pavilion." },
  { title: "Street Art Live Painting Jam", category: "Art", city: "Los Angeles", venue: "Arts District Courtyard", days: 21, time: "2:00 PM", price: 0, capacity: 500, rating: 4.4, img: 1043,
    short: "Watch muralists paint live across a shared courtyard wall.",
    full: "Six muralists paint live across sections of a shared courtyard wall over the course of the afternoon, with music and food trucks on site. Free and open to the public, family-friendly." },

  // Food
  { title: "Night Market: Street Food Edition", category: "Food", city: "Seattle", venue: "Pike Place Courtyard", days: 10, time: "5:00 PM", price: 0, capacity: 2000, rating: 4.6, img: 292,
    short: "Free entry night market with 20+ street food vendors.",
    full: "Free to enter — pay per item at each of the 20+ street food stalls, ranging from regional Mexican to Southeast Asian street snacks. Live DJ set and communal seating area on site." },
  { title: "Chef's Table Tasting Menu Night", category: "Food", city: "Miami", venue: "Ember & Salt", days: 16, time: "7:00 PM", price: 95, capacity: 24, rating: 4.9, img: 1080,
    short: "A single seating, seven-course tasting menu with wine pairings.",
    full: "One nightly seating of 24 guests for a seven-course tasting menu built around seasonal, local ingredients, with optional wine pairing add-on. Dietary restrictions accommodated with 48 hours notice." },
  { title: "Craft Coffee Cupping Workshop", category: "Food", city: "Austin", venue: "Roast House Coffee", days: 7, time: "10:00 AM", price: 30, capacity: 15, rating: 4.7, img: 431,
    short: "Learn to taste, score, and describe coffee like a professional cupper.",
    full: "A hands-on cupping session covering five origins, guided by a certified Q-grader. You'll learn the vocabulary and technique used in professional coffee scoring, and take home a bag of your favorite." },

  // Sports
  { title: "Sunrise 10K Fun Run", category: "Sports", city: "Chicago", venue: "Lakefront Trail", days: 13, time: "6:30 AM", price: 35, capacity: 1500, rating: 4.5, img: 1040,
    short: "A scenic 10K along the lakefront, timed and untimed options.",
    full: "A community 10K run along the Lakefront Trail with both timed and fun-run (untimed) categories. Entry includes a race tee, finisher medal, and post-race breakfast spread." },
  { title: "Pickup Basketball Tournament", category: "Sports", city: "Los Angeles", venue: "Venice Beach Courts", days: 19, time: "9:00 AM", price: 10, capacity: 96, rating: 4.2, img: 1035,
    short: "A 3-on-3 street basketball tournament, all skill levels welcome.",
    full: "A single-elimination 3-on-3 tournament on the iconic Venice courts. Teams of four (one substitute), all skill levels welcome — brackets are seeded to keep games competitive. Prizes for the top three teams." },
  { title: "Downtown Charity Cycling Ride", category: "Sports", city: "New York", venue: "Central Park West Entrance", days: 31, time: "8:00 AM", price: 25, capacity: 800, rating: 4.6, img: 1044,
    short: "A 20-mile group ride through the city, proceeds go to charity.",
    full: "A 20-mile group ride looping through the city, with rest stops every 5 miles and a full road closure permit for safety. All proceeds go to a local youth cycling nonprofit. Helmets mandatory." },
];

const SAMPLE_REVIEWS = [
  { userName: "Alex Turner", rating: 5, comment: "Genuinely one of the best-organized events I've been to this year. Would go again without hesitation." },
  { userName: "Jamie Chen", rating: 4, comment: "Really enjoyed it — venue was great, only wish it ran a little longer." },
  { userName: "Morgan Lee", rating: 5, comment: "Exceeded expectations. The staff were helpful and everything ran on time." },
];

async function seed() {
  await connectDB();

  const accountIds: Record<string, string> = {};
  for (const account of DEMO_ACCOUNTS) {
    let user = await User.findOne({ email: account.email });
    if (!user) {
      const hashed = await hashPassword(account.password);
      user = await User.create({ ...account, password: hashed });
      console.log(`Created ${account.role} account: ${account.email}`);
    } else {
      console.log(`Skipping ${account.email} — already exists.`);
    }
    accountIds[account.email] = user._id.toString();
  }

  const existingEventCount = await Event.countDocuments();
  if (existingEventCount > 0) {
    console.log(`Skipping event seed — ${existingEventCount} events already exist.`);
  } else {
    const owners = [accountIds["demo.user@eventhive.app"], accountIds["demo.admin@eventhive.app"]];
    const docs = RAW_EVENTS.map((e, i) => {
      const ownerIndex = i % 2;
      const seatsTaken = Math.floor(Math.random() * e.capacity * 0.4);
      return {
        title: e.title,
        shortDescription: e.short,
        fullDescription: e.full,
        category: e.category,
        image: img(e.img),
        gallery: [img(e.img), img(e.img + 1), img(e.img + 2)],
        date: daysFromNow(e.days),
        time: e.time,
        venue: e.venue,
        city: e.city,
        price: e.price,
        capacity: e.capacity,
        seatsLeft: Math.max(0, e.capacity - seatsTaken),
        rating: e.rating,
        reviews: i % 3 === 0 ? SAMPLE_REVIEWS : SAMPLE_REVIEWS.slice(0, 2),
        organizerName: ownerIndex === 0 ? "Demo User" : "EventHive Team",
        organizerId: owners[ownerIndex],
      };
    });

    await Event.insertMany(docs);
    console.log(`Created ${docs.length} sample events.`);
  }

  await mongoose.disconnect();
  console.log("Seeding complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
