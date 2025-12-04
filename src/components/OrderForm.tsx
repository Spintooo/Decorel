import React, { useState, useRef, useEffect } from 'react';
import {
    User, CheckCircle, X, Sparkles, ArrowRight, ArrowLeft, Gift, Flame
} from 'lucide-react';

// --- Fonctions de Suivi (CRITIQUE : NE PAS TOUCHER) ---
const trackPixelEvent = (eventName, eventData = {}) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, eventData);
  }
};

const trackCustomEvent = (eventName, eventData = {}) => {
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, eventData);
  }
};

// --- Configuration ---
const AVAILABLE_COLORS = [
  { 
    id: 'white', 
    name: 'اللون الابيض', 
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

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHcvbH-ra0MUrCY5A_kJgvJWPSur-GFB7Y5Gy7d-iYhtD-ivhO63zV9vUs7Uvd_1lg/exec";

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

  const orderSectionRef = useRef(null);

  useEffect(() => {
    trackPixelEvent('ViewContent', { content_name: 'Coiffeuse Élégante', value: 729.00, currency: 'MAD' });
  }, []);

  const scrollToSectionTop = () => {
    const yOffset = -20; 
    const element = orderSectionRef.current;
    if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'phoneLocalPart' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleColorSelection = (colorId) => {
    setFormData(prev => ({ ...prev, selectedColor: colorId, selectedMirror: null }));
    trackCustomEvent('ProductColorSelected', { selected_color: colorId });
    if (errors.selectedColor) setErrors(prev => ({ ...prev, selectedColor: '' }));
  };

  const handleMirrorSelection = (mirrorId) => {
    setFormData(prev => ({ ...prev, selectedMirror: mirrorId }));
    trackCustomEvent('ProductMirrorSelected', { selected_mirror: mirrorId });
    if (errors.selectedMirror) setErrors(prev => ({ ...prev, selectedMirror: '' }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1 && !formData.selectedColor) newErrors.selectedColor = 'الرجاء اختيار لون';
    if (step === 2 && !formData.selectedMirror) newErrors.selectedMirror = 'الرجاء اختيار شكل المرآة';
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
    trackPixelEvent('InitiateCheckout');

    const selectedColor = AVAILABLE_COLORS.find(c => c.id === formData.selectedColor);
    const selectedMirror = MIRROR_STYLES.find(m => m.id === formData.selectedMirror);

    const orderData = {
      selectedColorName: selectedColor?.name || "N/A",
      selectedMirrorName: selectedMirror?.name || "N/A",
      fullName: formData.fullName,
      phone: formData.phoneLocalPart.replace(/\s/g, ''),
      address: formData.address,
      comments: formData.mirrorName || "",
      eventId: 'event_' + Date.now(),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(orderData) 
      });
      
      trackPixelEvent('Purchase', { value: 729.00, currency: 'MAD' });
      setShowSuccessPopup(true);
    } catch (error) {
      setSubmitError("حدث خطأ في الاتصال. حاول مرة أخرى.");
    }
    setIsSubmitting(false);
  };

  // --- Composant ProgressBar ---
  const ProgressBar = () => (
    <div className="mb-3 relative px-1">
      <div className="flex items-center justify-between relative">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative z-10 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-[#055c3a] text-white border-[#055c3a] shadow-sm' 
                  : 'bg-white text-gray-300 border-gray-200'
              }`}>
                {currentStep > step ? <CheckCircle size={14} /> : <span className="text-xs">{step}</span>}
              </div>
              <span className={`mt-0.5 text-[10px] font-bold font-tajawal ${
                currentStep >= step ? 'text-[#055c3a]' : 'text-gray-300'
              }`}>
                {step === 1 ? 'اللون' : step === 2 ? 'الشكل' : 'التوصيل'}
              </span>
            </div>
            {index < 2 && (
              <div className={`h-0.5 flex-1 mx-1 transition-all duration-500 rounded-full ${
                currentStep > step ? 'bg-[#055c3a]' : 'bg-gray-200'
              }`} style={{ marginTop: '-15px' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <section 
      id="order" 
      ref={orderSectionRef} 
      className="py-1 bg-[#f8fafc] relative overflow-hidden" 
      dir="rtl"
    >
      <div className="container mx-auto px-2 max-w-md relative z-10">
        
        {/* TEXTE PROMO - Taille Agrandie */}
        {currentStep === 1 && (
          <div className="text-center mb-2 animate-fade-in">
            <div className="inline-block bg-gradient-to-l from-red-500 to-orange-500 text-white px-4 py-1.5 rounded-full shadow-sm">
              <p className="text-sm font-black font-tajawal whitespace-nowrap flex items-center gap-1">
                <span>🔥</span>
                الكوافوز الاكثر مبيعا مع هدية
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
          <ProgressBar />

          {/* ÉTAPE 1 : Sélection de couleur */}
          {currentStep === 1 && (
              <div className="animate-slide-in">
                <div className="text-center mb-2">
                  <h2 className="text-lg font-black text-gray-800 font-cairo">
                    إختر اللون اللذي يعجبك
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_COLORS.map((color) => {
                    // Ajout du badge Best Seller pour la couleur blanche
                    const isBestSeller = color.id === 'white';
                    
                    return (
                      <button
                        key={color.id}
                        onClick={() => handleColorSelection(color.id)}
                        className={`group relative rounded-lg overflow-hidden transition-all duration-200 bg-white border ${
                          formData.selectedColor === color.id
                            ? 'border-[#055c3a] ring-1 ring-[#055c3a]'
                            : 'border-gray-200'
                        }`}
                      >
                         {/* Badge Best Seller - Taille Agrandie */}
                        {isBestSeller && (
                          <div className="absolute top-0 left-0 right-0 z-20 flex justify-center -mt-0.5">
                             <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-b shadow-sm flex items-center gap-1 font-tajawal">
                               <Flame size={12} className="fill-yellow-300 text-yellow-300" />
                               الاكثر مبيعا
                             </span>
                          </div>
                        )}

                        <div className="aspect-square relative overflow-hidden bg-gray-50">
                          <img
                            src={color.previewImage}
                            alt={color.name}
                            className="w-full h-full object-cover"
                          />
                          {formData.selectedColor === color.id && (
                            <div className="absolute inset-0 bg-[#055c3a]/20 flex items-center justify-center">
                              <div className="bg-white rounded-full p-1 shadow-md animate-scale-in">
                                <CheckCircle className="w-4 h-4 text-[#055c3a]" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="py-1.5 bg-white border-t border-gray-100">
                          <p className={`font-bold text-xs font-tajawal text-center leading-none ${
                            formData.selectedColor === color.id ? 'text-[#055c3a]' : 'text-gray-800'
                          }`}>
                            {color.name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {errors.selectedColor && (
                  <div className="mt-2 text-red-500 text-center font-bold text-xs bg-red-50 p-1.5 rounded border border-red-100 animate-pulse">
                    {errors.selectedColor}
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={nextStep}
                    className="w-full bg-[#055c3a] text-white py-3 rounded-lg font-cairo font-bold text-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span>التـــالي</span>
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
          )}

          {/* ÉTAPE 2 : Sélection du miroir */}
          {currentStep === 2 && (
            <div className="animate-slide-in">
              <div className="text-center mb-2">
                <h2 className="text-lg font-black text-gray-800 font-cairo">
                  إختر شكل المرٱة المناسب لك
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MIRROR_STYLES.map((mirror) => {
                  const selectedColorData = AVAILABLE_COLORS.find(c => c.id === formData.selectedColor);
                  const imageUrl = selectedColorData?.images[mirror.id];
                  const isBestSeller = mirror.id === 'style_1';

                  return (
                    <button
                      key={mirror.id}
                      onClick={() => handleMirrorSelection(mirror.id)}
                      className={`group relative rounded-lg overflow-hidden transition-all duration-200 bg-white border ${
                        formData.selectedMirror === mirror.id
                          ? 'border-[#055c3a] ring-1 ring-[#055c3a]'
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Badge Best Seller - Taille Agrandie */}
                      {isBestSeller && (
                        <div className="absolute top-0 left-0 right-0 z-20 flex justify-center -mt-0.5">
                           <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-b shadow-sm flex items-center gap-1 font-tajawal">
                             <Flame size={12} className="fill-yellow-300 text-yellow-300" />
                             الاكثر مبيعا
                           </span>
                        </div>
                      )}

                      <div className="aspect-square relative overflow-hidden bg-gray-50">
                        <img
                          src={imageUrl}
                          alt={mirror.name}
                          className="w-full h-full object-cover"
                        />
                        {formData.selectedMirror === mirror.id && (
                          <div className="absolute inset-0 bg-[#055c3a]/20 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1 shadow-md animate-scale-in">
                              <CheckCircle className="w-4 h-4 text-[#055c3a]" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="py-1.5 bg-white border-t border-gray-100">
                        <p className={`font-bold text-xs font-tajawal text-center leading-none ${
                          formData.selectedMirror === mirror.id ? 'text-[#055c3a]' : 'text-gray-800'
                        }`}>
                          {mirror.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.selectedMirror && (
                <div className="mt-2 text-red-500 text-center font-bold text-xs bg-red-50 p-1.5 rounded border border-red-100 animate-pulse">
                  {errors.selectedMirror}
                </div>
              )}

              {/* Layout Boutons: 20% (Icon) / 80% (Texte) */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={prevStep}
                  className="w-[20%] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 bg-[#055c3a] text-white py-3 rounded-lg font-cairo font-bold text-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>التـــالي</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Formulaire Final */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="animate-slide-in space-y-3">
              <div className="text-center mb-3">
                <h2 className="text-lg font-black text-gray-800 font-cairo leading-tight">
                  معلومات التوصيل
                  {/* Texte Cadeau Agrandis */}
                  <div className="text-[#055c3a] text-lg sm:text-xl font-black flex items-center justify-center gap-1 mt-1">
                    <span>+ إسمك هدية فوق الكوافوز</span>
                    <Gift className="h-5 w-5 text-orange-500 animate-bounce" />
                  </div>
                </h2>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  {/* Icone Gris Foncé */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="الاسم الكامل"
                    className={`w-full pr-9 pl-3 py-3 bg-gray-50 border rounded-lg font-tajawal text-sm text-gray-900 placeholder-gray-500 focus:bg-white transition-all ${
                      errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-[#055c3a]'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1 mr-1">{errors.fullName}</p>}
                </div>

                <div className="relative">
                   {/* Icone Gris Foncé */}
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 z-10">
                    <div className="w-4 h-4 flex items-center justify-center">📞</div>
                  </div>
                  <div className="flex bg-gray-50 border rounded-lg overflow-hidden border-gray-200 focus-within:border-[#055c3a] focus-within:bg-white transition-all">
                    <input
                      type="tel"
                      name="phoneLocalPart"
                      value={formData.phoneLocalPart}
                      onChange={handleInputChange}
                      placeholder="رقم الهاتف"
                      className="flex-1 pr-9 pl-2 py-3 bg-transparent border-none outline-none font-tajawal text-sm text-gray-900 placeholder-gray-500 text-left dir-ltr"
                      style={{ direction: 'ltr', textAlign: 'left' }}
                    />
                    <div className="bg-gray-100 px-3 flex items-center border-r border-gray-200">
                      <span className="text-gray-600 font-bold text-sm dir-ltr">+212</span>
                    </div>
                  </div>
                  {errors.phoneLocalPart && <p className="text-red-500 text-[10px] mt-1 mr-1">{errors.phoneLocalPart}</p>}
                </div>

                <div className="relative">
                   {/* Icone Gris Foncé */}
                   <div className="absolute right-3 top-3 text-gray-600">
                    <div className="w-4 h-4">📍</div>
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="عنوان التوصيل (المدينة - الحي)"
                    rows={2}
                    className={`w-full pr-9 pl-3 py-3 bg-gray-50 border rounded-lg font-tajawal text-sm text-gray-900 placeholder-gray-500 focus:bg-white transition-all resize-none ${
                      errors.address ? 'border-red-400' : 'border-gray-200 focus:border-[#055c3a]'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-[10px] mt-1 mr-1">{errors.address}</p>}
                </div>

                <div className="relative">
                  {/* Icone Gris Foncé */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                    <Sparkles size={18} />
                  </div>
                  <input
                    type="text"
                    name="mirrorName"
                    value={formData.mirrorName}
                    onChange={handleInputChange}
                    placeholder="الاسم فوق المرآة (اختياري)"
                    className="w-full pr-9 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-lg font-tajawal text-sm text-gray-900 placeholder-gray-500 focus:border-[#055c3a] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-red-500 text-center bg-red-50 p-2 rounded text-xs">{submitError}</p>
              )}

              {/* Layout Boutons: 20% (Icon) / 80% (Texte) */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-[20%] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#055c3a] text-white py-3.5 rounded-lg font-cairo font-black text-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse text-sm">جاري الطلب...</span>
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

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm text-center shadow-2xl animate-scale-in relative">
            <button 
              onClick={() => setShowSuccessPopup(false)} 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-black font-cairo text-gray-800 mb-1">تم استلام طلبك!</h3>
            <p className="text-sm text-gray-600 font-tajawal mb-4">
              شكراً لك <span className="font-bold text-gray-800">{formData.fullName}</span>.<br/>
              سيتصل بك فريقنا قريباً لتأكيد الطلب.
            </p>
            <button 
              onClick={() => {
                setShowSuccessPopup(false);
                setCurrentStep(1);
                setFormData({ selectedColor: null, selectedMirror: null, fullName: '', phoneLocalPart: '', address: '', mirrorName: '' });
              }}
              className="w-full bg-[#055c3a] text-white py-3 rounded-lg font-bold font-tajawal"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        
        .font-cairo { font-family: 'Cairo', sans-serif; }
        .font-tajawal { font-family: 'Tajawal', sans-serif; }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        
        .animate-slide-in { animation: slideIn 0.25s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
      `}</style>
    </section>
  );
};

export default EliteOrderForm;