import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';

// --- ICONS (lazy loading for performance) ---
const CheckCircle = lazy(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })));
const X = lazy(() => import('lucide-react').then(mod => ({ default: mod.X })));
const ShoppingCart = lazy(() => import('lucide-react').then(mod => ({ default: mod.ShoppingCart })));

// --- CONFIGURATION ---
const AVAILABLE_COLORS = [
  { id: 'white', name: 'Blanc', hex: '#FFFFFF', image: 'https://i.ibb.co/hxDkrM5Y/1.webp' },
  { id: 'wood', name: 'Brun Naturel', hex: '#8B4513', image: 'https://i.ibb.co/JjMqSygS/1.webp' },
  { id: 'gold', name: 'Or', hex: '#c9a88c', image: 'https://i.ibb.co/V0qXkggG/1.webp' },
  { id: 'charcoal', name: 'Noir', hex: '#2C2C2C', image: 'https://i.ibb.co/h1DKjS2d/4.webp' },
];
const ARABIC_COLOR_NAMES = { white: 'اللون الابيض', wood: 'اللون البني', gold: 'اللون الخشبي', charcoal: 'اللون الاسود' };
const PHONE_INDICATIVE = "+212";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHcvbH-ra0MUrCY5A_kJgvJWPSur-GFB7Y5Gy7d-iYhtD-ivhO63zV9vUs7Uvd_1lg/exec";

// --- FACEBOOK CONFIGURATION ---
const FB_PIXEL_ID = '1066979964758813';
const FB_ACCESS_TOKEN = 'EAAU6IKYkVFkBP5bfK9v8xMIZBLtvIisQQWS0H020IcBHwR3BCeIEI3pXlMslE6a8jZCeEuhgL3OatNhJgpZC6mo7WJ7dZAqlb9ft9IGiWjjRIAcbEZAVCNL10sDiFvlBSBrZArDuAFuBRlAiXjcuCdSPCQKuIxLZA8CdRFMoCVsP4JMI4i6Er33uCGh9VW6PAZDZD';
const FB_GRAPH_API_BASE = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`;

// --- PSYCHOLOGY CONFIG ---
const PSYCHOLOGY = {
  stock: 8,
  soldToday: 23,
  urgencyMinutes: 45
};

// --- HOOK FOR CRITICAL STYLES ---
const useCriticalStyles = () => {
  useEffect(() => {
    const criticalCSS = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      .font-inter { font-family: 'Inter', sans-serif; }
      
      @keyframes fadeIn { 
        from { opacity: 0; transform: translateY(10px); } 
        to { opacity: 1; transform: translateY(0); } 
      }
      
      @keyframes fadeInScale { 
        0% { opacity: 0; transform: scale(0.95); } 
        100% { opacity: 1; transform: scale(1); } 
      }
      
      @keyframes subtlePulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      .animate-fade-in-scale { animation: fadeInScale 0.3s ease-out; }
      .animate-subtle-pulse { animation: subtlePulse 2s ease-in-out infinite; }
      
      input, textarea, button { -webkit-appearance: none; }
      input:focus, textarea:focus, button:focus { outline: none; }
      input, textarea { font-size: 16px; }
      
      .cta-primary { 
        background: linear-gradient(135deg, #055c3a 0%, #088553 100%); 
        transition: all 0.3s ease; 
      }
      
      .cta-primary:hover { 
        background: linear-gradient(135deg, #044a30 0%, #066c45 100%); 
        transform: translateY(-2px); 
        box-shadow: 0 12px 25px rgba(5, 92, 58, 0.3); 
      }
      
      .urgency-badge {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      }
      
      .stock-badge {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      }
    `;
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
};

// --- PSYCHOLOGY HOOKS ---
const useUrgencyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(PSYCHOLOGY.urgencyMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    expired: timeLeft === 0
  };
};

const useStockCounter = () => {
  const [stock, setStock] = useState(PSYCHOLOGY.stock);
  const [soldToday, setSoldToday] = useState(PSYCHOLOGY.soldToday);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stock > 2 && Math.random() > 0.8) {
        setStock(prev => prev - 1);
        setSoldToday(prev => prev + 1);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [stock]);

  return { stock, soldToday };
};

// --- UTILITIES ---
const sha256Hex = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- FACEBOOK EVENT SENDER ---
const sendClientEvent = (eventName, payload = {}) => {
  try {
    if (window.fbq) {
      window.fbq('track', eventName, payload);
    }
  } catch (e) { console.warn('fbq error:', e); }
};

const sendServerEvent = async ({ event_name, event_id, user_data = {}, custom_data = {} }) => {
  try {
    await fetch(`${FB_GRAPH_API_BASE}?access_token=${encodeURIComponent(FB_ACCESS_TOKEN)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url: window.location.href,
          action_source: 'website',
          user_data,
          custom_data,
        }]
      })
    });
  } catch (error) {
    console.log('Facebook CAPI error:', error);
  }
};

// --- UI COMPONENTS ---
const IconFallback = ({ className }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

const ColorSelector = ({ selectedColor, onColorChange }) => {
  const trackEvent = useFacebookEvents();

  const handleColorSelect = (colorId, colorName) => {
    onColorChange(colorId);
    trackEvent('ViewContent', {
      content_name: `Miroir Luna - ${colorName}`,
      content_category: 'mirror',
      content_type: 'product'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-inter font-semibold text-gray-800 text-center text-lg">
        Choisissez Votre Style
      </h3>
      <div className="flex justify-center space-x-4">
        {AVAILABLE_COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => handleColorSelect(color.id, color.name)}
            className={`relative group transition-all duration-300 ${
              selectedColor === color.id 
                ? 'scale-110 ring-3 ring-[#055c3a] ring-opacity-50' 
                : 'hover:scale-105'
            }`}
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
              <img
                src={color.image}
                alt={color.name}
                className="w-full h-full object-cover"
              />
            </div>
            {selectedColor === color.id && (
              <div className="absolute -top-1 -right-1 bg-[#055c3a] rounded-full p-1 shadow-lg">
                <Suspense fallback={<IconFallback className="w-3 h-3" />}>
                  <CheckCircle className="w-3 h-3 text-white" />
                </Suspense>
              </div>
            )}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                {color.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const UrgencyHeader = () => {
  const { minutes, seconds } = useUrgencyTimer();
  const { stock, soldToday } = useStockCounter();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-subtle-pulse"></div>
            <span className="font-inter font-semibold text-amber-800">
              📦 Stock: {stock} disponibles
            </span>
          </div>
          <div className="hidden md:block text-amber-700 text-sm">
            ✅ {soldToday} commandés aujourd'hui
          </div>
        </div>
        
        <div className="flex items-center space-x-3 bg-white px-3 py-2 rounded-lg border border-amber-300">
          <span className="text-amber-600 font-inter font-bold text-sm">⏱️</span>
          <span className="text-amber-800 font-inter font-bold">
            {minutes}:{seconds}
          </span>
          <span className="text-amber-600 font-inter text-sm hidden sm:block">
            offre spéciale
          </span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const EliteOrderForm = () => {
  useCriticalStyles();
  const trackEvent = useFacebookEvents();

  const [formData, setFormData] = useState({
    selectedColor: 'wood',
    fullName: '',
    phoneLocalPart: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const eventsSentRef = useRef({
    viewContent: false,
    initiateCheckout: false,
  });

  const orderSectionRef = useRef(null);

  const formatPhoneNumber = useCallback((value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    const limitedDigits = digits.startsWith('0') ? digits.slice(0, 10) : digits.slice(0, 9);
    return limitedDigits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // Event: ViewContent (when form is visible)
  useEffect(() => {
    if (!orderSectionRef.current) return;
    
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !eventsSentRef.current.viewContent) {
        eventsSentRef.current.viewContent = true;
        
        const event_id = `viewcontent_${Date.now()}`;
        sendClientEvent('ViewContent', { content_name: 'EliteOrderForm' });
        sendServerEvent({ 
          event_name: 'ViewContent', 
          event_id, 
          custom_data: { content_name: 'EliteOrderForm' } 
        });
        
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    observer.observe(orderSectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const processedValue = name === 'phoneLocalPart' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    // Event: InitiateCheckout (on first input)
    if (!eventsSentRef.current.initiateCheckout) {
      eventsSentRef.current.initiateCheckout = true;
      
      const event_id = `initcheckout_${Date.now()}`;
      sendClientEvent('InitiateCheckout');
      sendServerEvent({ event_name: 'InitiateCheckout', event_id });
    }
  }, [formatPhoneNumber, errors]);

  const handleColorSelection = useCallback((colorId) => {
    setFormData(prev => ({ ...prev, selectedColor: colorId }));
    setImageLoaded(false);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nom complet requis';
    if (!formData.address.trim()) newErrors.address = "Adresse de livraison requise";
    const phoneDigits = formData.phoneLocalPart.replace(/\s/g, '');
    if (!phoneDigits) newErrors.phoneLocalPart = 'Numéro de téléphone requis';
    else if (!/^0[567]\d{8}$/.test(phoneDigits.startsWith('0') ? phoneDigits : `0${phoneDigits}`)) {
      newErrors.phoneLocalPart = 'Numéro de téléphone invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    const event_id = `purchase_${Date.now()}_${formData.phoneLocalPart.slice(-4)}`;
    
    // Google Sheet Data
    const orderData = {
      selectedColorName: ARABIC_COLOR_NAMES[formData.selectedColor] || formData.selectedColor,
      fullName: formData.fullName,
      phone: formData.phoneLocalPart.replace(/\s/g, ''),
      address: formData.address,
      eventId: event_id,
      eventSourceUrl: window.location.href,
    };

    // Facebook CAPI Data
    const phoneDigits = formData.phoneLocalPart.replace(/\s/g, '');
    const e164Phone = `+212${phoneDigits.replace(/^0+/, '')}`;
    let userDataCAPI = { client_user_agent: navigator.userAgent };
    try {
      userDataCAPI.ph = [await sha256Hex(e164Phone)];
    } catch (err) { console.warn('Phone hashing failed:', err); }
    
    try {
      await Promise.all([
        // Send to Google Sheets
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(orderData)
        }),
        
        // Send Facebook Events
        (async () => {
          sendClientEvent('Purchase', { value: 999, currency: 'MAD' });
          await sendServerEvent({
            event_name: 'Purchase',
            event_id,
            user_data: userDataCAPI,
            custom_data: { 
              currency: 'MAD', 
              value: 999, 
              content_name: orderData.selectedColorName 
            }
          });
        })()
      ]);
      
      setShowSuccessPopup(true);

    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const closeSuccessPopup = useCallback(() => {
    setShowSuccessPopup(false);
    setFormData({ selectedColor: 'wood', fullName: '', phoneLocalPart: '', address: '' });
    setErrors({});
    setSubmitError(null);
    eventsSentRef.current = { viewContent: false, initiateCheckout: false };
  }, []);

  const SuccessPopup = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border animate-fade-in-scale">
        <button onClick={closeSuccessPopup} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1">
          <Suspense fallback={<IconFallback className="w-4 h-4" />}>
            <X size={20} />
          </Suspense>
        </button>
        <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mb-4">
          <Suspense fallback={<IconFallback className="w-6 h-6" />}>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </Suspense>
        </div>
        <h2 className="text-xl font-inter font-bold text-gray-900 mb-3">Commande confirmée !</h2>
        <div className="text-gray-600 font-inter text-sm space-y-2 mb-6">
          <p>Merci pour votre confiance.</p>
          <p>Notre équipe vous contactera sous peu.</p>
        </div>
        <button onClick={closeSuccessPopup} className="w-full cta-primary text-white font-inter font-semibold py-3 px-6 rounded-lg">
          Terminer
        </button>
      </div>
    </div>
  );

  const selectedColorObj = AVAILABLE_COLORS.find(c => c.id === formData.selectedColor);

  if (!mounted) {
    return (
      <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
            <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-xl mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" ref={orderSectionRef} className="py-8 bg-gradient-to-br from-gray-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 animate-fade-in">
          
          {/* Urgency Header */}
          <UrgencyHeader />
          
          {/* Product Image */}
          <div className="mb-6 relative overflow-hidden rounded-xl bg-gray-100">
            <div className="w-full aspect-square flex items-center justify-center">
              {!imageLoaded && <div className="w-full h-full bg-gray-200 animate-pulse"></div>}
              <img 
                key={selectedColorObj.image}
                src={selectedColorObj.image} 
                alt={`Miroir ${selectedColorObj.name}`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-inter font-medium">
              {selectedColorObj.name}
            </div>
          </div>

          {/* Color Selector */}
          <ColorSelector 
            selectedColor={formData.selectedColor}
            onColorChange={handleColorSelection}
          />

          {/* Pricing */}
          <div className="text-center my-6">
            <div className="flex items-baseline justify-center space-x-3 mb-2">
              <span className="font-inter font-bold text-3xl text-[#055c3a]">999 DH</span>
              <span className="text-gray-400 line-through text-xl">1299 DH</span>
            </div>
            <div className="flex justify-center space-x-2">
              <span className="bg-[#055c3a] text-white px-3 py-1 rounded-full text-sm font-inter font-semibold">
                Économisez 300 DH
              </span>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange}
                  placeholder="Nom complet *"
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 font-inter text-sm bg-white ${
                    errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#055c3a] focus:ring-2 focus:ring-[#055c3a]/20'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-2 font-inter">{errors.fullName}</p>}
              </div>

              <div>
                <div className="flex shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium">
                    {PHONE_INDICATIVE}
                  </span>
                  <input 
                    type="tel" 
                    name="phoneLocalPart" 
                    value={formData.phoneLocalPart} 
                    onChange={handleInputChange}
                    placeholder="Votre numéro *"
                    className={`flex-1 p-4 border-2 rounded-r-xl transition-all duration-200 font-inter text-sm bg-white ${
                      errors.phoneLocalPart ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#055c3a] focus:ring-2 focus:ring-[#055c3a]/20'
                    }`}
                  />
                </div>
                {errors.phoneLocalPart && <p className="text-red-500 text-xs mt-2 font-inter">{errors.phoneLocalPart}</p>}
              </div>

              <div>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  placeholder="Adresse de livraison complète *"
                  rows={2}
                  className={`w-full p-4 border-2 rounded-xl resize-none font-inter text-sm bg-white min-h-[70px] transition-all duration-200 ${
                    errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#055c3a] focus:ring-2 focus:ring-[#055c3a]/20'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-2 font-inter">{errors.address}</p>}
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm text-center font-inter">{submitError}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full cta-primary text-white font-inter font-bold py-4 px-6 rounded-xl text-base shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-70 cursor-wait' : 'hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Suspense fallback={<IconFallback className="w-5 h-5" />}>
                    <ShoppingCart className="w-5 h-5" />
                  </Suspense>
                  <span>COMMANDER MAINTENANT</span>
                </>
              )}
            </button>
            
            <p className="text-gray-500 font-inter text-xs text-center">
              ✓ Paiement sécurisé à la livraison
            </p>
          </form>
        </div>
      </div>
      
      {showSuccessPopup && <SuccessPopup />}
    </section>
  );
};

// Facebook Events Hook
const useFacebookEvents = () => {
  const trackEvent = useCallback(async (eventName, parameters = {}) => {
    const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Client-side tracking
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, parameters);
    }

    // Server-side CAPI
    try {
      await fetch(`${FB_GRAPH_API_BASE}?access_token=${encodeURIComponent(FB_ACCESS_TOKEN)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: window.location.href,
            action_source: "website",
            user_data: { client_user_agent: navigator.userAgent },
            custom_data: parameters
          }]
        })
      });
    } catch (error) {
      console.log('Facebook CAPI error:', error);
    }
  }, []);

  return trackEvent;
};

export default React.memo(EliteOrderForm);