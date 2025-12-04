import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    User, Phone, MapPin, CheckCircle, X, Sparkles, ArrowRight, ArrowLeft, Package
} from 'lucide-react';

// --- Fonctions de Suivi ---
const trackPixelEvent = (eventName, eventData = {}) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, eventData);
    console.log(`Meta Pixel Event: ${eventName}`, eventData);
  } else {
    console.warn(`Meta Pixel (window.fbq) not found. Event "${eventName}" not tracked.`);
  }
};

const trackCustomEvent = (eventName, eventData = {}) => {
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, eventData);
    console.log(`Custom Event: ${eventName}`, eventData);
  }
};

// --- Configuration des Produits ---
const AVAILABLE_COLORS = [
  { 
    id: 'white', 
    name: 'اللون الابيض', 
    hex: '#FFFFFF',
    previewImage: 'https://i.ibb.co/0jPHbnjs/1.png',
    images: {
      style_1: 'https://i.ibb.co/0jPHbnjs/1.png',
      style_2: 'https://i.ibb.co/9kY1qSmS/2.png',
      style_3: 'https://i.ibb.co/tpCNnmLy/3.png',
      style_4: 'https://i.ibb.co/FLgkytTY/4.png'
    }
  },
  { 
    id: 'black', 
    name: 'اللون الاسود', 
    hex: '#1A1A1A',
    previewImage: 'https://i.ibb.co/wFfzHY37/4.png',
    images: {
      style_1: 'https://i.ibb.co/wFfzHY37/4.png',
      style_2: 'https://i.ibb.co/QvXZdqCL/2.png',
      style_3: 'https://i.ibb.co/sdKvpRhz/1.png',
      style_4: 'https://i.ibb.co/0V8qz83m/3.png'
    }
  },
  { 
    id: 'wood', 
    name: 'اللون الخشبي', 
    hex: '#a9907a',
    previewImage: 'https://i.ibb.co/sJ6Jf2Fx/1.png',
    images: {
      style_1: 'https://i.ibb.co/sJ6Jf2Fx/1.png',
      style_2: 'https://i.ibb.co/JWSjL5HZ/2.png',
      style_3: 'https://i.ibb.co/GfRSY3Pb/3.png',
      style_4: 'https://i.ibb.co/Vcxfwpsy/4.png'
    }
  },
  { 
    id: 'brown', 
    name: 'اللون البني', 
    hex: '#8B4513',
    previewImage: 'https://i.ibb.co/99y998FS/1.png',
    images: {
      style_1: 'https://i.ibb.co/99y998FS/1.png',
      style_2: 'https://i.ibb.co/tMx3mnqX/2.png',
      style_3: 'https://i.ibb.co/gZkXczLp/3.png',
      style_4: 'https://i.ibb.co/kg30nDMC/4.png'
    }
  }
];

const MIRROR_STYLES = [
  { id: 'style_1', name: 'الشكل 1', order: 1 },
  { id: 'style_2', name: 'الشكل 2', order: 2 },
  { id: 'style_3', name: 'الشكل 3', order: 3 },
  { id: 'style_4', name: 'الشكل 4', order: 4 }
];

const PHONE_INDICATIVE = "+212";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHcvbH-ra0MUrCY5A_kJgvJWPSur-GFB7Y5Gy7d-iYhtD-ivhO63zV9vUs7Uvd_1lg/exec";

// --- Couleurs CTA dynamiques ---
const CTA_COLORS = ['#09be79', '#0aeb0a', '#f87018', '#d55907'];

// --- Hook pour préchargement d'images ---
const useImagePreloader = (urls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, url]));
      };
      img.src = url;
    });
  }, [urls]);

  return loadedImages;
};

// --- Hook pour couleur CTA aléatoire ---
const useRandomCTAColor = () => {
  const [ctaColor, setCtaColor] = useState(CTA_COLORS[0]);

  useEffect(() => {
    const randomColor = CTA_COLORS[Math.floor(Math.random() * CTA_COLORS.length)];
    setCtaColor(randomColor);
  }, []);

  return ctaColor;
};

// --- Utilitaires ---
const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (value.trim().startsWith('0')) {
    const limitedDigits = digits.slice(0, 10);
    const parts = [limitedDigits.slice(0, 2), limitedDigits.slice(2, 4), limitedDigits.slice(4, 6), limitedDigits.slice(6, 8), limitedDigits.slice(8, 10)];
    return parts.filter(p => p).join(' ');
  } else {
    const limitedDigits = digits.slice(0, 9);
    const parts = [limitedDigits.slice(0, 3), limitedDigits.slice(3, 6), limitedDigits.slice(6, 9)];
    return parts.filter(p => p).join(' ');
  }
};

const EliteOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedColor: null,
    selectedMirror: null,
    fullName: '',
    phoneLocalPart: '',
    address: '',
    mirrorName: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [hasTriggeredInitiateCheckout, setHasTriggeredInitiateCheckout] = useState(false);

  const orderSectionRef = useRef(null);
  const ctaColor = useRandomCTAColor();

  // Préchargement intelligent des images
  const preloadUrls = formData.selectedColor 
    ? Object.values(AVAILABLE_COLORS.find(c => c.id === formData.selectedColor)?.images || {})
    : AVAILABLE_COLORS.map(c => c.previewImage);
  
  useImagePreloader(preloadUrls);

  useEffect(() => {
    trackPixelEvent('ViewContent', { content_name: 'Coiffeuse Élégante', value: 729.00, currency: 'MAD' });
  }, []);

  const scrollToSectionTop = () => {
    orderSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const triggerInitiateCheckout = useCallback(() => {
    if (!hasTriggeredInitiateCheckout) {
      trackPixelEvent('InitiateCheckout');
      setHasTriggeredInitiateCheckout(true);
    }
  }, [hasTriggeredInitiateCheckout]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'phoneLocalPart' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (currentStep === 3 && value.trim() !== '') triggerInitiateCheckout();
  };

  const handleColorSelection = (colorId) => {
    setFormData(prev => ({ ...prev, selectedColor: colorId, selectedMirror: null }));
    trackCustomEvent('ProductColorSelected', { selected_color: colorId });
    if (errors.selectedColor) setErrors(prev => ({ ...prev, selectedColor: '' }));
  };

  const handleMirrorSelection = (mirrorId) => {
    setFormData(prev => ({ ...prev, selectedMirror: mirrorId }));
    trackCustomEvent('ProductMirrorSelected', { selected_mirror: mirrorId, selected_color: formData.selectedColor });
    if (errors.selectedMirror) setErrors(prev => ({ ...prev, selectedMirror: '' }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1 && !formData.selectedColor) {
      newErrors.selectedColor = 'الرجاء اختيار لون';
    }
    if (step === 2 && !formData.selectedMirror) {
      newErrors.selectedMirror = 'الرجاء اختيار شكل المرآة';
    }
    if (step === 3) {
      if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
      if (!formData.address.trim()) newErrors.address = 'عنوان التوصيل مطلوب';
      const phoneDigits = formData.phoneLocalPart.replace(/\s/g, '');
      if (!phoneDigits) newErrors.phoneLocalPart = 'رقم الهاتف مطلوب';
      else if (!/^0[567]\d{8}$/.test(phoneDigits.startsWith('0') ? phoneDigits : `0${phoneDigits}`)) {
        newErrors.phoneLocalPart = 'رقم هاتف غير صحيح';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep(1)) {
      setCurrentStep(2);
      scrollToSectionTop();
    } else if (currentStep === 2 && validateStep(2)) {
      trackPixelEvent('AddToCart');
      setCurrentStep(3);
      scrollToSectionTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToSectionTop();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const selectedColor = AVAILABLE_COLORS.find(c => c.id === formData.selectedColor);
    const selectedMirror = MIRROR_STYLES.find(m => m.id === formData.selectedMirror);

    const orderData = {
      selectedColorName: selectedColor?.name || "N/A",
      selectedMirrorName: selectedMirror?.name || "N/A",
      fullName: formData.fullName,
      phone: formData.phoneLocalPart.replace(/\s/g, ''),
      address: formData.address,
      comments: formData.mirrorName || "",
      eventId: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      eventSourceUrl: window.location.href,
      contentIds: ['coiffeuse_makiage_premium'],
      contentType: 'product'
    };

    let submissionSuccessful = false;

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, { 
        method: 'POST', 
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }, 
        body: JSON.stringify(orderData) 
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Succès Google Sheets:", result);
        submissionSuccessful = true;
      } else {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
    } catch (error) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, { 
          method: 'POST', 
          mode: 'no-cors',
          body: JSON.stringify(orderData) 
        });
        submissionSuccessful = true;
      } catch (fallbackError) {
        console.error("Erreur d'envoi finale:", fallbackError);
        setSubmitError("حدث خطأ في الشبكة. الرجاء المحاولة مرة أخرى أو الاتصال بنا مباشرة على الواتساب.");
      }
    }

    if (submissionSuccessful) {
      trackPixelEvent('Purchase', { value: 729.00, currency: 'MAD' });
      setShowSuccessPopup(true);
    }
    
    setIsSubmitting(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setFormData({ 
      selectedColor: null, 
      selectedMirror: null, 
      fullName: '', 
      phoneLocalPart: '', 
      address: '', 
      mirrorName: '' 
    });
    setErrors({});
    setSubmitError(null);
    setCurrentStep(1);
    setHasTriggeredInitiateCheckout(false);
    scrollToSectionTop();
  };

  // Composant Progress Bar optimisé
  const ProgressBar = () => (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center justify-between relative">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative z-10 flex-1">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-orange-500 shadow-lg scale-110' 
                  : 'bg-white text-gray-400 border-gray-300'
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span className="text-sm sm:text-base">{step}</span>
                )}
              </div>
              <span className={`mt-2 text-xs sm:text-sm font-bold font-cairo text-center transition-colors duration-300 ${
                currentStep >= step ? 'text-orange-600' : 'text-gray-400'
              }`}>
                {step === 1 ? 'اللون' : step === 2 ? 'الشكل' : 'التوصيل'}
              </span>
            </div>
            {index < 2 && (
              <div className={`h-1 flex-1 mx-2 sm:mx-4 transition-all duration-500 rounded-full ${
                currentStep > step ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-300'
              }`} style={{ marginTop: '-20px' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Nouveau Popup de Succès Ultramoderne
  const SuccessPopup = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200/50 relative animate-scale-in">
        {/* Bouton fermeture */}
        <button 
          onClick={closeSuccessPopup} 
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <X size={16} className="text-gray-600 group-hover:text-gray-800" />
        </button>
        
        {/* Icone animée */}
        <div className="relative mx-auto mb-4">
          <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-lg animate-pulse-slow">
            <CheckCircle className="h-9 w-9 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-20 animate-ping-slow"></div>
        </div>
        
        {/* Contenu */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black text-gray-800 font-cairo leading-tight">
            تم تأكيد طلبك بنجاح! 🎉
          </h2>
          
          <div className="space-y-2 text-sm text-gray-600 font-tajawal">
            <p className="leading-relaxed">
              عزيزي/عزيزتي <span className="font-bold text-orange-600">{formData.fullName.split(" ")[0]}</span>
            </p>
            <p className="leading-relaxed">
              سنتصل بك على الرقم 
              <strong className="font-sans text-green-600 mx-1" dir="ltr">
                {PHONE_INDICATIVE} {formData.phoneLocalPart}
              </strong>
              خلال 24 ساعة
            </p>
          </div>
        </div>

        {/* Bouton de confirmation */}
        <button 
          onClick={closeSuccessPopup} 
          className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center font-cairo text-sm shadow-md"
        >
          <CheckCircle className="w-4 h-4 ml-2" />
          تم الفهم - إغلاق
        </button>
      </div>
    </div>
  );

  return (
    <section 
      id="order" 
      ref={orderSectionRef} 
      className="py-6 sm:py-8 bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 relative overflow-hidden" 
      dir="rtl"
    >
      {/* Background decorations minimalistes */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-orange-200/20 rounded-full blur-2xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-200/15 rounded-full blur-2xl opacity-40"></div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200/50">
          <ProgressBar />

          {/* ÉTAPE 1 : Sélection de couleur - ULTRA-RESPONSIVE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 font-cairo flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
إختر اللون اللذي يعجبك (+هدية🎁)
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorSelection(color.id)}
                    className={`group relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 ${
                      formData.selectedColor === color.id
                        ? 'ring-3 ring-orange-500 shadow-xl scale-105 border-orange-500'
                        : 'hover:shadow-lg hover:scale-102 shadow-md'
                    }`}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      <img
                        src={color.previewImage}
                        alt={color.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="eager"
                      />
                      {formData.selectedColor === color.id && (
                        <div className="absolute inset-0 bg-orange-500/10 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="bg-white rounded-full p-2 shadow-2xl">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4">
                      <p className="text-white font-bold text-sm sm:text-base font-cairo text-center drop-shadow-lg">
                        {color.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {errors.selectedColor && (
                <p className="text-red-600 text-center font-tajawal text-sm bg-red-50 border border-red-200 rounded-lg p-3 max-w-2xl mx-auto">
                  {errors.selectedColor}
                </p>
              )}

              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.selectedColor}
                  style={{ backgroundColor: formData.selectedColor ? ctaColor : undefined }}
                  className={`px-10 py-4 rounded-xl font-cairo font-bold text-base sm:text-lg transition-all duration-300 flex items-center gap-3 shadow-xl ${
                    formData.selectedColor
                      ? 'text-white hover:shadow-2xl hover:scale-105 active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>التـــالي</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Sélection du style de miroir - ULTRA-RESPONSIVE */}
          {currentStep === 2 && formData.selectedColor && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 font-cairo flex items-center justify-center gap-2">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                  إختر شكل المرٱة المناسب لك
                </h2>
              </div>

              {/* Mobile: 2 colonnes avec 2 photos chacune */}
              {/* Desktop: 4 colonnes en une seule ligne */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
                {MIRROR_STYLES.map((mirror) => {
                  const selectedColorData = AVAILABLE_COLORS.find(c => c.id === formData.selectedColor);
                  const imageUrl = selectedColorData?.images[mirror.id];

                  return (
                    <button
                      key={mirror.id}
                      type="button"
                      onClick={() => handleMirrorSelection(mirror.id)}
                      className={`group relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 ${
                        formData.selectedMirror === mirror.id
                          ? 'ring-3 ring-red-500 shadow-xl scale-105 border-red-500'
                          : 'hover:shadow-lg hover:scale-102 shadow-md'
                      }`}
                    >
                      <div className="aspect-[0.9] sm:aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={mirror.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        {formData.selectedMirror === mirror.id && (
                          <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="bg-white rounded-full p-2 shadow-2xl">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4">
                        <p className="text-white font-bold text-sm sm:text-base font-cairo text-center drop-shadow-lg">
                          {mirror.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.selectedMirror && (
                <p className="text-red-600 text-center font-tajawal text-sm bg-red-50 border border-red-200 rounded-lg p-3 max-w-2xl mx-auto">
                  {errors.selectedMirror}
                </p>
              )}

              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-4 rounded-xl font-cairo font-bold text-base bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>السابق</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.selectedMirror}
                  style={{ backgroundColor: formData.selectedMirror ? ctaColor : undefined }}
                  className={`px-10 py-4 rounded-xl font-cairo font-bold text-base sm:text-lg transition-all duration-300 flex items-center gap-3 shadow-xl ${
                    formData.selectedMirror
                      ? 'text-white hover:shadow-2xl hover:scale-105 active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>التـــالي</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Informations de livraison - ULTRA-RESPONSIVE */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 font-cairo flex items-center justify-center gap-2">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                 معلومات التوصيل + إسمك هدية فوق الكوافوز
                </h2>
              </div>

              <div className="space-y-5 max-w-2xl mx-auto">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="الاسم الكامل"
                    className={`w-full p-4 sm:p-5 border-2 rounded-xl transition-all font-tajawal text-base sm:text-lg focus:ring-3 placeholder-gray-600 ${
                      errors.fullName
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                    }`}
                    style={{ textAlign: 'right', direction: 'rtl' }}
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-2 font-tajawal text-right">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <div className="flex">
                    <input
                      type="tel"
                      name="phoneLocalPart"
                      value={formData.phoneLocalPart}
                      onChange={handleInputChange}
                      placeholder="رقم الهاتف"
                      className={`flex-1 p-4 sm:p-5 border-2 border-l-0 rounded-r-xl transition-all font-tajawal text-base sm:text-lg focus:ring-3 placeholder-gray-600 ${
                        errors.phoneLocalPart
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                    <span className="inline-flex items-center px-4 sm:px-5 rounded-l-xl border-2 border-r-0 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 font-bold text-gray-700 font-sans text-base sm:text-lg">
                      {PHONE_INDICATIVE}
                    </span>
                  </div>
                  {errors.phoneLocalPart && (
                    <p className="text-red-600 text-sm mt-2 font-tajawal text-right">{errors.phoneLocalPart}</p>
                  )}
                </div>

                <div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="عنوان التوصيل"
                    rows={4}
                    className={`w-full p-4 sm:p-5 border-2 rounded-xl transition-all resize-none font-tajawal text-base sm:text-lg focus:ring-3 placeholder-gray-600 ${
                      errors.address
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                    }`}
                    style={{ textAlign: 'right', direction: 'rtl' }}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-2 font-tajawal text-right">{errors.address}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="mirrorName"
                    value={formData.mirrorName}
                    onChange={handleInputChange}
                    placeholder="الاسم فوق المرآة (اختياري)"
                    className="w-full p-4 sm:p-5 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-3 focus:ring-green-500/20 transition-all font-tajawal text-base sm:text-lg placeholder-gray-600"
                    style={{ textAlign: 'right', direction: 'rtl' }}
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-red-600 text-center bg-red-50 border border-red-200 rounded-xl p-4 font-tajawal text-sm max-w-2xl mx-auto">
                  {submitError}
                </p>
              )}

              <div className="flex justify-center gap-4 pt-6 max-w-2xl mx-auto">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-4 rounded-xl font-cairo font-bold text-base bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>السابق</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: !isSubmitting ? ctaColor : undefined }}
                  className={`flex-1 max-w-md py-4 px-8 rounded-xl font-cairo font-black text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-wait'
                      : 'text-white hover:shadow-2xl hover:scale-105 active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm">جاري تأكيد الطلب...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>تأكـــيد الطلب</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showSuccessPopup && <SuccessPopup />}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
        
        .font-cairo { font-family: 'Cairo', sans-serif; }
        .font-tajawal { font-family: 'Tajawal', sans-serif; }
        
        input, textarea, button { -webkit-appearance: none; }
        input:focus, textarea:focus, button:focus { outline: none; }
        input, textarea { font-size: 16px; }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s ease-in-out infinite; }
        
        .hover\\:scale-102:hover { transform: scale(1.02); }

        /* Optimisations mobiles */
        @media (max-width: 640px) {
          input, textarea {
            font-size: 16px !important;
          }
        }

        /* Styles pour l'alignement RTL/LTR */
        .rtl-input {
          text-align: right;
          direction: rtl;
        }
        
        .ltr-input {
          text-align: left;
          direction: ltr;
        }
      `}</style>
    </section>
  );
};

export default EliteOrderForm;