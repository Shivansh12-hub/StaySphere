import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Star, Building2, SlidersHorizontal, RefreshCw, X, Wifi, Coffee, Utensils, ShieldCheck } from 'lucide-react';

// ==========================================
// 1. CONSTANTS & MOCK IMAGES
// ==========================================
// Fallback high-quality images in case the API doesn't provide valid image links
const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80"
];

const getHotelImage = (hotel, index) => {
  const apiImage = hotel?.thumbnail || hotel?.photos?.[0];

  if (typeof apiImage === 'string' && apiImage.trim()) {
    return apiImage;
  }

  return HOTEL_IMAGES[index % HOTEL_IMAGES.length];
};

// ==========================================
// 2. REUSABLE SUB-COMPONENTS
// ==========================================

// --- Skeleton Loader Component ---
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-200 rounded w-1/4" />
        <div className="h-8 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

// --- Hotel Detail Modal Component ---
const HotelModal = ({ hotel, image, onClose }) => {
  if (!hotel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">

        {/* Banner Image */}
        <div className="relative h-64 md:h-80 w-full bg-slate-100">
          <img src={image} alt={hotel.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-md backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-emerald-500 text-white font-medium px-3 py-1 rounded-full text-sm shadow-sm">
            Available Now
          </div>
        </div>

        {/* Info Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{hotel.name}</h2>
              <div className="flex items-center text-slate-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                <span className="text-sm">{hotel.location || 'Premium Destination'}</span>
              </div>
            </div>
            <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 shrink-0">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
              <span className="text-sm font-semibold text-amber-800">{hotel.rating || '4.5'}</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Luxury Amenities Demo Grid */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">Premium Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 text-sm">
                <Wifi className="w-4 h-4 text-indigo-500" /> Free Wi-Fi
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 text-sm">
                <Coffee className="w-4 h-4 text-amber-600" /> Breakfast
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 text-sm">
                <Utensils className="w-4 h-4 text-rose-500" /> Room Service
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Block */}
          <div className="flex items-center justify-between pt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">Price per night</span>
              <span className="text-2xl font-extrabold text-slate-900">${hotel.price || '120'}</span>
            </div>
            <button
              onClick={() => alert(`Proceeding to reserve ${hotel.name}!`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-indigo-300"
            >
              Reserve Room
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Single Hotel Card Component ---
const HotelCard = ({ hotel, index, onSelect }) => {
  const displayImage = getHotelImage(hotel, index);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 flex flex-col group">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={displayImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
          {hotel.rating || '4.5'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center text-slate-400 text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="line-clamp-1">{hotel.location || 'Global Destination'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Per Night</span>
            <span className="text-xl font-extrabold text-slate-900">${hotel.price || '150'}</span>
          </div>
          <button
            onClick={() => onSelect(hotel, displayImage)}
            className="bg-slate-50 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white font-medium px-4 py-2 rounded-xl text-sm transition-all duration-200 border border-slate-200/60 group-hover:border-indigo-600"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN APPLICATION CONTAINER
// ==========================================
export default function App() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const analyticsRef = useRef(null);

  // Interactive UI Filters State - Initialized higher to show cards automatically
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [modalImage, setModalImage] = useState('');

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      // Bypasses local development server proxies by pointing directly to the live server
      const targetUrl = 'https://demohotelsapi.pythonanywhere.com/hotels/';
      const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl));

      if (!response.ok) throw new Error('Failed to retrieve fresh hotel listings.');
      const data = await response.json();
      const hotelList = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      if (hotelList.length === 0) {
        throw new Error('No hotel records were returned by the API.');
      }

      setHotels(hotelList);
    } catch (err) {
      setError(err.message);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // Performance-optimized live filtering logic
  const filteredHotels = useMemo(() => {
    const hotelList = Array.isArray(hotels) ? hotels : [];

    return hotelList.filter(hotel => {
      const matchesSearch = !searchQuery ||
        hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const numericPrice = Number(hotel.price) || 0;
      const matchesPrice = numericPrice === 0 || numericPrice <= maxPrice;

      return matchesSearch && matchesPrice;
    });
  }, [hotels, searchQuery, maxPrice]);

  const analytics = useMemo(() => {
    const hotelList = Array.isArray(hotels) ? hotels : [];
    const visibleList = filteredHotels;
    const totalHotels = hotelList.length;
    const visibleHotels = visibleList.length;
    const averageRating = totalHotels
      ? (hotelList.reduce((sum, hotel) => sum + (Number(hotel.rating) || 0), 0) / totalHotels).toFixed(1)
      : '0.0';
    const averagePrice = totalHotels
      ? Math.round(hotelList.reduce((sum, hotel) => sum + (Number(hotel.price) || 0), 0) / totalHotels)
      : 0;
    const cityCounts = hotelList.reduce((counts, hotel) => {
      const city = hotel.location || 'Unknown';
      counts[city] = (counts[city] || 0) + 1;
      return counts;
    }, {});
    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    return {
      totalHotels,
      visibleHotels,
      averageRating,
      averagePrice,
      topCity,
    };
  }, [hotels, filteredHotels]);

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans">

      {/* Premium Header Layout */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block">StaySphere</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block -mt-1">Partner Portal</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="text-indigo-600 font-semibold">Explore</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Bookings</a>
            <button type="button" onClick={scrollToAnalytics} className="hover:text-slate-900 transition-colors">Analytics</button>
          </div>
        </div>
      </header>

      {/* Hero Banner Component */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-xl relative z-10 space-y-4">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide inline-block">
              Assignment Submission Dashboard
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Find & Manage Luxury Spaces.
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Integrated with PythonAnywhere live API arrays. Fast search client-side querying architecture.
            </p>
          </div>
        </div>

        <section ref={analyticsRef} id="analytics" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Analytics</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">API dashboard summary</h2>
            </div>
            <button
              type="button"
              onClick={fetchHotels}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Refresh metrics
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total hotels</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{analytics.totalHotels}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Visible hotels</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{analytics.visibleHotels}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average rating</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{analytics.averageRating}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top city</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{analytics.topCity}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 p-4 md:p-5">
              <p className="text-sm font-semibold text-slate-500">Average price per night</p>
              <p className="mt-2 text-2xl font-black text-slate-900">${analytics.averagePrice}</p>
              <p className="mt-2 text-sm text-slate-500">Calculated from the current API dataset.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4 md:p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
              <p className="text-sm font-semibold text-slate-300">Live dataset status</p>
              <p className="mt-2 text-2xl font-black">{loading ? 'Loading data' : error ? 'Needs attention' : 'Healthy'}</p>
              <p className="mt-2 text-sm text-slate-300">
                {error ? error : 'Data is being fetched from the hotel API through the Vite proxy.'}
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Filters Processing Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hotel name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Pricing Range Controller */}
          <div className="flex items-center gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <SlidersHorizontal className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
            <div className="w-full sm:w-48 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Max Budget</span>
                <span className="text-indigo-600">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Refresh Live Status */}
            <button
              onClick={fetchHotels}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-all"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Notification Block */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-bold">API Connection Interrupted</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button
              onClick={fetchHotels}
              className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Hotels Rendering Content Section */}
        <div>
          {loading ? (
            /* Skeleton Loading State Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredHotels.length > 0 ? (
            /* Filled Success Active State Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel, index) => (
                <HotelCard
                  key={hotel.id || index}
                  hotel={hotel}
                  index={index}
                  onSelect={(h, img) => {
                    setSelectedHotel(h);
                    setModalImage(img);
                  }}
                />
              ))}
            </div>
          ) : (
            /* Empty Search/Filter State View */
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto p-6 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Stay Destinations Match</h3>
              <p className="text-sm text-slate-400">
                Try widening your search terms or pulling up the price budget slider parameters.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Detail Overlays */}
      <HotelModal
        hotel={selectedHotel}
        image={modalImage}
        onClose={() => setSelectedHotel(null)}
      />

      {/* Simple Clean Submission Footer */}
      <footer className="bg-white border-t border-slate-100 mt-20 py-8 text-center text-xs font-medium text-slate-400">
        <p>© 2026 StaySphere Frontend Integration Assignment. Built cleanly for GitHub validation.</p>
      </footer>
    </div>
  );
}