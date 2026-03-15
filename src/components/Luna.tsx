import React, { useState, useEffect, useMemo, useRef } from 'react';

// ============================================================================
// 1. CONFIGURATION & CONSTANTES
// ============================================================================

const CONFIG = {
  API: {
    GOOGLE_SHEETS: "https://script.google.com/macros/s/AKfycbzHcvbH-ra0MUrCY5A_kJgvJWPSur-GFB7Y5Gy7d-iYhtD-ivhO63zV9vUs7Uvd_1lg/exec",
    WHATSAPP_NUMBER: "212675118958",
  },
  CURRENCY: "MAD",
  DEFAULT_IMAGE: "https://i.ibb.co/c9T4CNg/Whats-App-Image-2026-02-28-at-22-51-28.jpg",
  LOGO: "https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/others/wjGs4dLMgdmpRz5mH5cuoQtNQSI9ii22LWfVkDuA.png"
};

const COLORS = {
  blanc: { id: 'blanc', name: 'أبيض', hex: '#f8fafc' },
  sonoma: { id: 'sonoma', name: 'خشبي', hex: '#d4a96a' },
  noir: { id: 'noir', name: 'أسود', hex: '#1e293b' },
  marron: { id: 'marron', name: 'بني', hex: '#5d3a1a' }
};

const VARIANTS = {
  '3floors': { id: '3floors', name: 'نيش مكون من 3 طوابق' },
  '4floors': { id: '4floors', name: 'نيش مكون من 4 طوابق' }
};

const PRODUCT_IMAGES = {
  '3floors': {
    sonoma: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/EExfu83bkWbANRDghqNYA1PFsZl5nXPUI1xGg0ds_lg.jpg',
    marron: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/PwA1I71ujjsP8qaYJdo3aM3CCzJgILcd9qwk5jZl_lg.jpg',
    noir: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/UqYdm9VDpGSDuYAyfJEugObgCalt3TD3PYQDZ4Pr_lg.jpg',
    blanc: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/i1nY34Do8Q3tJLmc3lD06XG6K3Qp4mRyzB6KKmHZ_lg.jpg'
  },
  '4floors': {
    sonoma: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/Sbej00oj83GPugrNZtZf62jMQYcgUNIlrhYrnsY6_lg.jpg',
    marron: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/fxCf44jz4CXNjEYacurxxWYB2jSrVTdwWuFzdNUW_lg.jpg',
    noir: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/b5QpZyyyT974ydsGVB1f9ENarLrRqw8kuvYzt3n9_lg.jpg',
    blanc: 'https://cdn.youcan.shop/stores/0653e0a5dc7a4a7235b672c216370bff/products/nbGphfPN5Vu0ajzoPw3aPIkebuZSDgOxbEeBFtqM_lg.jpg'
  }
};

// أسئلة شائعة محدثة
const FAQ_ITEMS = [
  { q: 'كم يوم يستغرق التوصيل؟', a: 'التوصيل يستغرق كابعد تقدير 3 ايام لاننا لانستورد المنتج، لدينا ورشة صناعة ونقوم بصناعة منتجاتكم بكل إحترافية.' },
  { q: 'كيف يمكنني ان ادفع الثمن ؟', a: 'الخلاص فقط عند استلامك للمنتج، قلب عاد خلص.' },
  { q: 'ماهي جودة الخشب اللتي تستخدمونها؟', a: 'نستخدم احسن جودة خشب في السوق MDF18.' },
];

// ============================================================================
// 2. STYLES CRITIQUES
// ============================================================================

const GlobalStyles = () => {
  useEffect(() => {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Cairo:wght@600;700;900&family=Almarai:wght@400;700;800&display=swap');
      
      * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { font-family: 'Tajawal', sans-serif; background: #f8fafc; color: #0f172a; overflow-x: hidden; }
      
      .container-custom { width: 100%; max-width: 500px; margin: 0 auto; background: #ffffff; box-shadow: 0 0 30px rgba(0,0,0,0.05); }
      
      @keyframes modalScaleIn { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes pulseScale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
      
      .animate-modal-in { animation: modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      .btn-pulse { animation: pulseScale 2s infinite ease-in-out; }
      
      .btn-primary {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
        transition: transform 0.2s ease;
      }
      .btn-primary:active { transform: scale(0.98); }
      
      .input-pro { background: #f8fafc; border: 2px solid #e2e8f0; font-size: 16px !important; transition: all 0.2s ease; }
      .input-pro:focus { background: #ffffff; border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); outline: none; }

      .phone-input { text-align: right; direction: ltr; }
      .phone-input::placeholder { text-align: right; direction: rtl; }
      .no-scroll { overflow: hidden !important; }
      
      /* RTL FAQ Styles */
      .faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 14px; color: #1e293b; text-align: right; cursor: pointer; transition: all 0.2s; direction: rtl; }
      .faq-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
      .faq-body { padding: 12px 16px; font-size: 13px; color: #475569; background: white; border: 1px solid #e2e8f0; border-top: none; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; margin-top: -4px; line-height: 1.6; text-align: right; direction: rtl; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

const calculatePrice = (variantId, quantity) => {
  if (!variantId) return 199;
  if (variantId === '3floors') {
    if (quantity === 1) return 199;
    if (quantity === 2) return 379;
    return 379 + ((quantity - 2) * 100);
  } else {
    if (quantity === 1) return 219;
    if (quantity === 2) return 399;
    return 399 + ((quantity - 2) * 100);
  }
};

// ============================================================================
// 3. CHECKOUT POPUP COMPONENT (NO-SCROLL, 1.6x IMAGE, PRO DESIGN)
// ============================================================================

const InteractiveCheckout = ({ isOpen, onClose, isForced }) => {
  const [step, setStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && !showSuccess) {
      setStep(1); setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen, showSuccess]);

  const currentImage = useMemo(() => {
    if (selectedVariant && selectedColor) return PRODUCT_IMAGES[selectedVariant][selectedColor];
    if (selectedColor) return PRODUCT_IMAGES['4floors'][selectedColor];
    return CONFIG.DEFAULT_IMAGE;
  }, [selectedVariant, selectedColor]);

  const totalPrice = calculatePrice(selectedVariant, quantity);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    let maxLength = val.startsWith('0') ? 10 : 9;
    setFormData({ ...formData, phone: val.slice(0, Math.max(0, maxLength)) });
    if (errors.phone) setErrors({ ...errors, phone: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'مطلوب';
    if (!formData.address.trim()) newErrors.address = 'مطلوب';
    if (!formData.phone) {
      newErrors.phone = 'مطلوب';
    } else {
      const isComplete = formData.phone.startsWith('0') ? formData.phone.length === 10 : formData.phone.length === 9;
      if (!isComplete) newErrors.phone = 'غير مكتمل';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOrder = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const orderData = {
      id: Date.now().toString(),
      variant: VARIANTS[selectedVariant].name,
      color: COLORS[selectedColor].name,
      quantity,
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      totalPrice,
      timestamp: new Date().toISOString()
    };
    try {
      await fetch(CONFIG.API.GOOGLE_SHEETS, { method: 'POST', mode: 'no-cors', body: JSON.stringify(orderData) });
      setShowSuccess(true);
      if (typeof window.fbq !== 'undefined') window.fbq('track', 'Purchase', { value: totalPrice, currency: 'MAD' });
    } catch (error) {
      alert('حدث خطأ، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 animate-fade-in no-scroll" dir="rtl">
      <div className="w-full max-w-[400px] bg-white rounded-[24px] shadow-2xl animate-modal-in flex flex-col relative overflow-hidden">
        
        {!showSuccess && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 z-50">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        )}

        {/* HEADER CONTROLS (Back on Right, Close on Left if not forced) */}
        <div className="absolute top-2.5 w-full px-3 flex justify-between items-center z-40 pointer-events-none">
          <div className="flex-1 text-right">
            {step > 1 && !showSuccess && (
              <button onClick={() => setStep(step - 1)} className="pointer-events-auto inline-flex items-center justify-center bg-white/95 backdrop-blur border border-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm gap-1 active:scale-95 transition-transform">
                 رجوع <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
              </button>
            )}
          </div>
          <div className="flex-shrink-0 text-left">
            {!isForced && !showSuccess && (
              <button onClick={onClose} className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 bg-white/95 backdrop-blur border border-gray-200 text-gray-800 rounded-full shadow-sm active:scale-95 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>
        </div>

        {showSuccess ? (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 font-cairo">تم طلبك بنجاح!</h2>
            <p className="text-gray-500 mb-6 text-sm">شكراً لك {formData.fullName}. سنتصل بك قريباً لتأكيد وإرسال الطلب.</p>
            {!isForced && (
               <button onClick={onClose} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200">
                 إغلاق
               </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full mt-1.5">
            
            {/* COMPACT HEADER WITH 1.6x IMAGE (145px x 145px) & RED PRICE */}
            <div className="px-3 pt-6 pb-2 border-b border-gray-100 flex items-center gap-3 bg-white z-10">
              <img 
                src={currentImage} 
                alt="Product" 
                className="w-[145px] h-[145px] rounded-2xl object-cover shadow-md border border-gray-100 aspect-square shrink-0 animate-fade-in" 
              />
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 w-fit px-2 py-0.5 rounded-md mb-2">
                  الخطوة {step} من 4
                </span>
                {step > 1 && (
                  <h3 className="font-black text-gray-900 text-[14px] leading-tight mb-1 font-cairo">
                    {selectedVariant ? VARIANTS[selectedVariant].name : 'رفوف متعددة الإستعمالات'}
                  </h3>
                )}
                {step > 2 && (
                  <div className="mt-1">
                    <div className="font-black text-2xl text-red-600 font-cairo flex items-center gap-1.5 flex-wrap">
                      {totalPrice} درهم
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full whitespace-nowrap">🔥 عرض محدود</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 bg-white flex-1 flex flex-col justify-center">
              
              {/* STEP 1: COLOR */}
              {step === 1 && (
                <div className="animate-fade-in w-full">
                  <h4 className="text-sm font-black text-center mb-2.5 text-gray-800">إختر اللون الذي يعجبك</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(COLORS).map(color => (
                      <button key={color.id} onClick={() => { setSelectedColor(color.id); setStep(2); }} className="flex items-center gap-2.5 p-2 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-right">
                        <span className={`w-10 h-10 rounded-full shadow-sm flex-shrink-0 ${color.id === 'blanc' ? 'border border-gray-200' : ''}`} style={{ backgroundColor: color.hex }}></span>
                        <span className="font-bold text-gray-700 text-sm">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: VARIANT */}
              {step === 2 && (
                <div className="animate-fade-in w-full">
                  <h4 className="text-sm font-black text-center mb-2.5 text-gray-800">إختر الشكل الذي يعجبك</h4>
                  <div className="space-y-2.5">
                    {Object.values(VARIANTS).map(variant => (
                      <button key={variant.id} onClick={() => { setSelectedVariant(variant.id); setStep(3); }} className="w-full text-right p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex justify-between items-center relative overflow-hidden">
                        {variant.id === '4floors' && <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">الأكثر طلباً</div>}
                        <div><span className={`block font-black text-sm text-gray-900 mb-0.5 ${variant.id === '4floors' ? 'mt-1.5' : ''}`}>{variant.name}</span></div>
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: QUANTITY (Simplified, no badges) */}
              {step === 3 && (
                <div className="animate-fade-in w-full flex flex-col">
                  <h4 className="text-sm font-black text-center mb-4 text-gray-800">إختر الكمية</h4>
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between mb-6 border border-gray-100">
                    <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-12 h-12 rounded-lg bg-white shadow-sm text-2xl font-bold text-emerald-600 border border-gray-200">+</button>
                    <span className="text-3xl font-black text-gray-900 w-16 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-lg bg-white shadow-sm text-2xl font-bold text-red-500 border border-gray-200">−</button>
                  </div>
                  <button onClick={() => setStep(4)} className="w-full btn-primary text-white py-3.5 rounded-xl font-black text-base btn-pulse shadow-md mt-auto">
                    متابعة الطلب
                  </button>
                </div>
              )}

              {/* STEP 4: FORM */}
              {step === 4 && (
                <div className="animate-fade-in w-full flex flex-col">
                  <h4 className="text-sm font-black text-center mb-2.5 text-gray-800">معلومات التوصيل</h4>
                  <div className="space-y-2.5 mb-3">
                    <div className="relative">
                      <input type="text" placeholder="الإسم الكامل" value={formData.fullName} onChange={e => {setFormData({...formData, fullName: e.target.value}); setErrors({...errors, fullName: null})}} className={`w-full py-2.5 px-3 rounded-xl input-pro ${errors.fullName ? '!border-red-400' : ''}`} />
                      {errors.fullName && <span className="absolute left-3 top-3 text-[10px] text-red-500 font-bold bg-white px-1">{errors.fullName}</span>}
                    </div>
                    <div className="relative">
                      <input type="tel" placeholder="رقم الهاتف" value={formData.phone} onChange={handlePhoneChange} className={`w-full py-2.5 px-3 rounded-xl input-pro phone-input ${errors.phone ? '!border-red-400' : ''}`} />
                      {errors.phone && <span className="absolute left-3 top-3 text-[10px] text-red-500 font-bold bg-white px-1">{errors.phone}</span>}
                    </div>
                    <div className="relative">
                      <textarea placeholder="العنوان (المدينة، الحي)" value={formData.address} onChange={e => {setFormData({...formData, address: e.target.value}); setErrors({...errors, address: null})}} rows="2" className={`w-full py-2 px-3 rounded-xl input-pro resize-none ${errors.address ? '!border-red-400' : ''}`} />
                      {errors.address && <span className="absolute left-3 top-3 text-[10px] text-red-500 font-bold bg-white px-1">{errors.address}</span>}
                    </div>
                  </div>
                  <button onClick={submitOrder} disabled={isSubmitting} className="w-full btn-primary text-white py-3 rounded-xl font-black text-base flex justify-center items-center gap-2 shadow-md mt-auto">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <>أكد الطلب ◂ <span className="text-emerald-100">{totalPrice} درهم</span></>}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAIN APP LAYOUT (RICH LANDING PAGE)
// ============================================================================

const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-6 bg-slate-50 border-t border-slate-200" dir="rtl">
      <div className="px-4">
        <h2 className="text-lg font-cairo font-black text-center mb-4 text-slate-900 flex justify-center items-center gap-2">
           أسئلة شائعة <span>❓</span>
        </h2>
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
                <span className="flex-1 block ml-4">{item.q}</span>
                <span className={`text-xl text-emerald-600 font-bold flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && (
                <div className="faq-body animate-fade-in">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isForcedPopup, setIsForcedPopup] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isMainBtnVisible, setIsMainBtnVisible] = useState(true);
  const mainBtnRef = useRef(null);

  // Observer for Sticky Bottom CTA
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMainBtnVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (mainBtnRef.current) observer.observe(mainBtnRef.current);
    return () => observer.disconnect();
  }, []);

  // 10 Seconds Forced Popup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInteracted && !isCheckoutOpen) {
        setIsForcedPopup(true);
        setIsCheckoutOpen(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [userInteracted, isCheckoutOpen]);

  const openCheckout = () => {
    setUserInteracted(true);
    setIsForcedPopup(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div dir="rtl" className="bg-slate-50 min-h-screen pb-24">
      <GlobalStyles />
      
      {/* FIXED HEADER WITH 1.4x LOGO */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40">
        <div className="container-custom h-16 flex items-center justify-center">
          <img src={CONFIG.LOGO} alt="DECOREL" className="h-11 md:h-12" />
        </div>
      </header>

      <main className="pt-16 container-custom bg-white shadow-xl min-h-screen flex flex-col">
        
        {/* HERO SECTION */}
        <section className="bg-white pb-6 pt-5 border-t border-slate-100">
          <div className="px-4">
            <div className="relative rounded-3xl overflow-hidden shadow-lg mb-5 group cursor-pointer" onClick={openCheckout}>
              <img src={CONFIG.DEFAULT_IMAGE} alt="رفوف ديكور" className="w-full aspect-square object-cover" />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[11px] font-black shadow-lg animate-pulse">
                تخفيض محدود
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-black font-cairo text-gray-900 mb-4 leading-tight">
                رفوف متعددة الإستعمالات
              </h1>
              
              <div className="flex justify-center items-baseline gap-2 mb-5">
                <span className="text-sm text-slate-600 font-bold">ابتداءً من</span>
                <span className="text-4xl font-black text-red-600 font-cairo">199</span>
                <span className="text-red-600 font-bold">درهم</span>
              </div>

              <button 
                ref={mainBtnRef}
                onClick={openCheckout}
                className="w-full btn-primary text-white py-4 rounded-2xl font-black text-xl flex justify-center items-center gap-3 btn-pulse shadow-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                أطلب الآن
              </button>
            </div>
          </div>
        </section>

        {/* USAGES & FEATURES */}
        <section className="py-6 bg-slate-50 border-t border-slate-100">
          <div className="px-4">
            <h2 className="text-lg font-cairo font-black text-center mb-4 text-slate-800">⚡ تستعملها في كل مكان</h2>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { icon: '🚿', title: 'الحمام' },
                { icon: '🛋️', title: 'الصالون' },
                { icon: '🛏️', title: 'غرفة النوم' },
                { icon: '🚪', title: 'المدخل' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center border border-slate-200 shadow-sm">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-[13px] font-bold text-slate-800">{item.title}</div>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-cairo font-black text-center mb-4 text-slate-800">✨ لماذا رفوفنا؟</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🇲🇦', title: 'صنع في المغرب', desc: 'أكادير' },
                { icon: '🪵', title: 'خشب MDF', desc: 'سمك 18mm' },
                { icon: '💧', title: 'مقاوم للرطوبة', desc: 'للحمامات' },
                { icon: '⚡', title: 'توصيل سريع', desc: 'لباب الدار' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-200">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <h3 className="font-black text-[13px] text-slate-900">{item.title}</h3>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIMENSIONS */}
        <section className="py-6 bg-white border-t border-slate-100">
          <div className="px-4">
            <div className="bg-slate-100 rounded-2xl p-4">
              <h3 className="text-base font-black text-slate-900 text-center mb-3 font-cairo">📐 القياسات</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-200">
                  <strong className="text-[13px] text-slate-800">3 طوابق</strong>
                  <p className="text-[11px] text-slate-500 mt-1.5">70 × 22 × 15 سم</p>
                </div>
                <div className="bg-teal-50 border border-teal-600 rounded-xl p-3 text-center shadow-sm">
                  <strong className="text-[13px] text-teal-700">4 طوابق</strong>
                  <p className="text-[11px] text-teal-600 mt-1.5">80 × 22 × 15 سم</p>
                </div>
              </div>
              <p className="text-[11px] text-center mt-3 text-slate-500 font-bold">سماكة 18 مم – MDF أصلي</p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FAQSection />

        {/* FOOTER INFO */}
        <footer className="bg-slate-50 py-8 px-4 border-t border-slate-200 mt-auto">
          <div className="text-center">
            
            {/* FACTORY MOVED TO FOOTER */}
            <div className="bg-slate-900 rounded-2xl p-5 text-center text-white shadow-xl mb-6">
              <div className="text-3xl mb-1">🏭</div>
              <h3 className="text-base font-black mb-1 font-cairo">من مصنعنا في أكادير</h3>
              <p className="text-xs text-slate-400 mb-3 font-bold">جودة حقيقية – بدون وسيط</p>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold">🚚 توصيل سريع</span>
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold">💳 الدفع عند الاستلام</span>
              </div>
            </div>

            <div className="mb-5">
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-emerald-700">📍</span>
                <span className="text-sm font-bold text-slate-800">أكادير، المغرب</span>
              </div>
            </div>
            <div className="mb-6">
              <a 
                href={`https://wa.me/${CONFIG.API.WHATSAPP_NUMBER}?text=${encodeURIComponent("السلام عليكم بغيت نعرف الاشكال والالوان لي عندكم")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-7 py-3 rounded-xl text-sm font-bold shadow-md w-full max-w-[280px]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                <span>تواصل عبر الواتساب</span>
              </a>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 font-bold m-0">© 2026 DECOREL - جميع الحقوق محفوظة</p>
            </div>
          </div>
        </footer>

      </main>

      {/* FLOATING BAR (Sticky Bottom CTA) */}
      <div className={`fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 transition-transform duration-300 ${!isMainBtnVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="container-custom shadow-none bg-transparent m-0 mx-auto">
          <button 
            onClick={openCheckout}
            className="w-full btn-primary text-white py-3.5 rounded-xl font-black text-lg flex justify-center items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            أطلب الآن (الدفع عند الاستلام)
          </button>
        </div>
      </div>

      <InteractiveCheckout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} isForced={isForcedPopup} />
    </div>
  );
};

export default App;
