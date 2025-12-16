import React, { useState, useEffect, useCallback, useMemo, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
    User, CheckCircle, X, Sparkles, ArrowRight, ArrowLeft, 
    Gift, Flame, MapPin, Phone, Loader2, WifiOff, AlertCircle
} from 'lucide-react';

/* 
  =============================================================================
  1. SYSTEM CONFIGURATION & UTILS
  =============================================================================
*/

const CONFIG = {
  ENDPOINTS: {
    PRIMARY: "https://script.google.com/macros/s/AKfycbzHcvbH-ra0MUrCY5A_kJgvJWPSur-GFB7Y5Gy7d-iYhtD-ivhO63zV9vUs7Uvd_1lg/exec",
  },
  TELEGRAM: {
    ENABLED: false, 
    BOT_TOKEN: "", 
    CHAT_ID: "" 
  },
  CURRENCY: 'MAD',
  PRICE: 699.00,
  STORAGE_KEY: 'elite_order_queue_v8_final',
  MAX_RETRIES: 5,
  SYNC_INTERVAL: 4000,
  BATCH_SIZE: 3,
  FETCH_TIMEOUT: 8000,
  PHONE_REGEX: /^(?:(?:\+|00)212|0)[5-7]\d{8}$/
};

// --- Safe Storage (Fallback In-Memory si LocalStorage bloqué/plein) ---
const safeStorage = {
  memoryStore: new Map(),
  get: (key) => {
    try {
      if (typeof window === 'undefined') return null;
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return safeStorage.memoryStore.get(key) || null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      safeStorage.memoryStore.set(key, value);
    }
  }
};

const utils = {
  // CORRECTION : On ne fait PAS de .trim() ici pour autoriser les espaces pendant la saisie
  sanitizeInput: (str, maxLength = 255) => {
    if (typeof str !== 'string') return '';
    // Enlève uniquement les caractères dangereux (<, >, etc.)
    return str.replace(/[<>&"'\\]/g, '').slice(0, maxLength);
  },
  
  generateUUID: () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  preloadImage: (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  }
};

/* 
  =============================================================================
  2. DATA MODELS
  =============================================================================
*/
const AVAILABLE_COLORS = [
  { id: 'white', name: 'اللون الابيض', previewImage: 'https://i.ibb.co/0jPHbnjs/1.png', isBestSeller: true, images: { style_1: 'https://i.ibb.co/0jPHbnjs/1.png', style_2: 'https://i.ibb.co/9kY1qSmS/2.png', style_3: 'https://i.ibb.co/tpCNnmLy/3.png', style_4: 'https://i.ibb.co/FLgkytTY/4.png' } },
  { id: 'black', name: 'اللون الاسود', previewImage: 'https://i.ibb.co/wFfzHY37/4.png', images: { style_1: 'https://i.ibb.co/wFfzHY37/4.png', style_2: 'https://i.ibb.co/QvXZdqCL/2.png', style_3: 'https://i.ibb.co/sdKvpRhz/1.png', style_4: 'https://i.ibb.co/0V8qz83m/3.png' } },
  { id: 'wood', name: 'اللون الخشبي', previewImage: 'https://i.ibb.co/sJ6Jf2Fx/1.png', images: { style_1: 'https://i.ibb.co/sJ6Jf2Fx/1.png', style_2: 'https://i.ibb.co/JWSjL5HZ/2.png', style_3: 'https://i.ibb.co/GfRSY3Pb/3.png', style_4: 'https://i.ibb.co/Vcxfwpsy/4.png' } },
  { id: 'brown', name: 'اللون البني', previewImage: 'https://i.ibb.co/99y998FS/1.png', images: { style_1: 'https://i.ibb.co/99y998FS/1.png', style_2: 'https://i.ibb.co/tMx3mnqX/2.png', style_3: 'https://i.ibb.co/gZkXczLp/3.png', style_4: 'https://i.ibb.co/kg30nDMC/4.png' } }
];

const MIRROR_STYLES = [
  { id: 'style_1', name: 'الشكل 1', order: 1, isBestSeller: true },
  { id: 'style_2', name: 'الشكل 2', order: 2 },
  { id: 'style_3', name: 'الشكل 3', order: 3 },
  { id: 'style_4', name: 'الشكل 4', order: 4 }
];

/* 
  =============================================================================
  3. OPTIMIZED HOOKS (Logic Layer)
  =============================================================================
*/

const useToast = () => {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToast({ msg, type, id });
    const timer = setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 4000);
    return () => clearTimeout(timer);
  }, []);
  return { toast, showToast };
};

const useTracking = () => {
  const track = useCallback((eventName, data = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      try { window.fbq('track', eventName, data); } catch(e) { /* Safe fail */ }
    }
  }, []);
  return useMemo(() => ({ track }), [track]);
};

// --- Queue Manager (Reducer + Immediate Worker) ---
const queueReducer = (state, action) => {
  switch (action.type) {
    case 'INIT': return action.payload;
    case 'ADD': return [...state, action.payload];
    case 'UPDATE_STATUS': 
      return state.map(item => item.id === action.id ? { ...item, ...action.updates } : item);
    case 'REMOVE': return state.filter(item => item.id !== action.id);
    default: return state;
  }
};

const useReliableOrderQueue = (showToast) => {
  const [queue, dispatch] = useReducer(queueReducer, []);
  const [isOnline, setIsOnline] = useState(true);
  
  const queueRef = useRef(queue);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => { queueRef.current = queue; }, [queue]);

  useEffect(() => {
    isMountedRef.current = true;
    const loaded = safeStorage.get(CONFIG.STORAGE_KEY) || [];
    dispatch({ type: 'INIT', payload: loaded });
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    const handleNetwork = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (online) showToast("تم الاتصال. جاري المزامنة...", "success");
      else showToast("انقطع الاتصال. الحفظ محلي.", "warning");
    };

    window.addEventListener('online', handleNetwork);
    window.addEventListener('offline', handleNetwork);
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('online', handleNetwork);
      window.removeEventListener('offline', handleNetwork);
    };
  }, [showToast]);

  useEffect(() => {
    if (queue.length > 0) safeStorage.set(CONFIG.STORAGE_KEY, queue);
  }, [queue]);

  // Worker Logic with Batching & Immediate Trigger
  const processBatch = useCallback(async () => {
    if (!navigator.onLine || isProcessingRef.current || !isMountedRef.current) return;
    
    const pending = queueRef.current.filter(o => o.status === 'pending');
    if (pending.length === 0) return;

    isProcessingRef.current = true;
    const batch = pending.slice(0, CONFIG.BATCH_SIZE);

    const promises = batch.map(async (order) => {
      const backoff = Math.pow(2, order.attempts) * 1000;
      if (Date.now() - order.lastAttempt < backoff) return;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

      try {
        const fetchPromises = [
          fetch(CONFIG.ENDPOINTS.PRIMARY, {
            method: 'POST', mode: 'cors', keepalive: true, signal: controller.signal,
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(order)
          })
        ];

        if (CONFIG.TELEGRAM.ENABLED && CONFIG.TELEGRAM.BOT_TOKEN) {
          fetchPromises.push(fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM.BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ chat_id: CONFIG.TELEGRAM.CHAT_ID, text: `📦 ${order.fullName}` })
          }).catch(() => {}));
        }

        const results = await Promise.allSettled(fetchPromises);
        clearTimeout(timeoutId);

        if (results.some(res => res.status === 'fulfilled' && res.value.ok)) {
          if (isMountedRef.current) dispatch({ type: 'REMOVE', id: order.id });
        } else {
          throw new Error('All failed');
        }
      } catch (e) {
        clearTimeout(timeoutId);
        if (isMountedRef.current) {
          const nextAttempts = order.attempts + 1;
          const status = nextAttempts >= CONFIG.MAX_RETRIES ? 'failed_permanent' : 'pending';
          dispatch({ type: 'UPDATE_STATUS', id: order.id, updates: { attempts: nextAttempts, lastAttempt: Date.now(), status } });
        }
      }
    });

    await Promise.all(promises);
    isProcessingRef.current = false;
    
    if (isMountedRef.current && queueRef.current.filter(o => o.status === 'pending').length > 0) {
      setTimeout(processBatch, 1000); 
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(processBatch, CONFIG.SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [processBatch]);

  const addToQueue = useCallback((orderData) => {
    const newOrder = {
      ...orderData,
      id: utils.generateUUID(),
      status: 'pending',
      attempts: 0,
      lastAttempt: 0
    };
    dispatch({ type: 'ADD', payload: newOrder });
    // DÉCLENCHEMENT IMMÉDIAT
    setTimeout(processBatch, 0);
  }, [processBatch]);

  return { 
    addToQueue, 
    queueLength: queue.filter(o => o.status === 'pending').length,
    hasPermanentErrors: queue.some(o => o.status === 'failed_permanent'),
    isOnline 
  };
};

/* 
  =============================================================================
  4. UI COMPONENTS (Generic, Accessible, Memoized)
  =============================================================================
*/

const GlobalStyles = React.memo(() => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
    .font-cairo { font-family: 'Cairo', sans-serif; }
    .font-tajawal { font-family: 'Tajawal', sans-serif; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-slide-in { animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  `}</style>
));

const FormField = React.memo(({ name, icon: Icon, type, placeholder, value, onChange, error, prefix }) => (
  <div className="relative group">
    <label htmlFor={name} className="sr-only">{placeholder}</label>
    <div className={`absolute ${type === 'textarea' ? 'top-4' : 'top-1/2 -translate-y-1/2'} right-3.5 text-gray-400 group-focus-within:text-[#055c3a] transition-colors z-10 pointer-events-none`}>
      <Icon size={20} />
    </div>
    
    <div className={`flex bg-gray-50 border rounded-xl overflow-hidden focus-within:border-[#055c3a] focus-within:ring-2 focus-within:ring-[#055c3a]/20 transition-all ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'}`}>
      {type !== 'textarea' ? (
        <input
          id={name} name={name} type={type} value={value} onChange={onChange}
          placeholder={placeholder} required aria-invalid={!!error} aria-describedby={error ? `err-${name}` : undefined}
          className="flex-1 pr-11 pl-3 py-3.5 bg-transparent border-none outline-none font-tajawal text-gray-900 placeholder-gray-400 text-left dir-ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
          maxLength={type === 'tel' ? 15 : 100}
        />
      ) : (
        <textarea
          id={name} name={name} value={value} onChange={onChange}
          placeholder={placeholder} rows={2} required aria-invalid={!!error} aria-describedby={error ? `err-${name}` : undefined}
          className="w-full pr-11 pl-4 py-3.5 bg-transparent border-none outline-none font-tajawal text-gray-900 placeholder-gray-400 resize-none"
          maxLength={250}
        />
      )}
      {prefix && (
        <div className="bg-gray-100 px-4 flex items-center border-r border-gray-200">
          <span className="text-gray-600 font-bold text-sm dir-ltr tracking-wider">{prefix}</span>
        </div>
      )}
    </div>
    {error && <p id={`err-${name}`} role="alert" className="text-red-500 text-xs mt-1.5 mr-1 font-bold flex items-center gap-1"><X size={12}/>{error}</p>}
  </div>
));
FormField.propTypes = { name: PropTypes.string.isRequired, icon: PropTypes.elementType, type: PropTypes.string, placeholder: PropTypes.string, value: PropTypes.string, onChange: PropTypes.func, error: PropTypes.string, prefix: PropTypes.string };

const StepSelectionGrid = React.memo(({ items, selectedId, onSelect, getImageUrl, title, error, onNext, onPrev, nextLabel = "التـــالي" }) => (
  <div className="animate-slide-in">
    <h2 className="text-xl font-black text-gray-800 font-cairo text-center mb-4">{title}</h2>
    
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={title}>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const imgUrl = getImageUrl ? getImageUrl(item) : item.previewImage;
        
        return (
          <button
            key={item.id} type="button" role="radio" aria-checked={isSelected} aria-label={item.name}
            onClick={() => onSelect(item.id)}
            className={`group relative rounded-xl overflow-hidden transition-all duration-200 border-2 ${isSelected ? 'border-[#055c3a] ring-2 ring-[#055c3a]/20 shadow-lg translate-y-[-2px]' : 'border-gray-100 hover:border-gray-300'}`}
          >
            {item.isBestSeller && (
              <div className="absolute top-0 inset-x-0 z-20 flex justify-center">
                <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-b-lg shadow-sm flex items-center gap-1 font-tajawal">
                  <Flame size={10} className="fill-yellow-300 text-yellow-300" /> الاكثر مبيعا
                </span>
              </div>
            )}
            <div className="aspect-square relative bg-gray-50">
              <img 
                src={imgUrl} alt={item.name} 
                loading="lazy" decoding="async" 
                width={150} height={150} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              {isSelected && (
                <div className="absolute inset-0 bg-[#055c3a]/10 backdrop-blur-[1px] flex items-center justify-center animate-fade-in">
                  <div className="bg-white rounded-full p-1.5 shadow-lg animate-scale-in"><CheckCircle className="w-5 h-5 text-[#055c3a]" /></div>
                </div>
              )}
            </div>
            <div className={`py-2 transition-colors ${isSelected ? 'bg-[#055c3a]/5' : 'bg-white'}`}>
              <p className={`font-bold text-sm font-tajawal text-center ${isSelected ? 'text-[#055c3a]' : 'text-gray-700'}`}>{item.name}</p>
            </div>
          </button>
        );
      })}
    </div>

    {error && <div role="alert" className="mt-3 text-red-500 text-center font-bold text-xs animate-pulse">{error}</div>}

    <div className={`flex gap-3 mt-6 ${!onPrev ? 'justify-end' : ''}`}>
      {onPrev && (
        <button onClick={onPrev} className="w-[20%] bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors">
          <ArrowRight className="w-6 h-6" />
        </button>
      )}
      <button 
        onClick={onNext} 
        className={`${onPrev ? 'flex-1' : 'w-full'} bg-[#055c3a] text-white py-3.5 rounded-xl font-cairo font-bold text-lg shadow-lg hover:bg-[#044c30] transition-all flex items-center justify-center gap-3 group`}
      >
        <span>{nextLabel}</span>
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
));
StepSelectionGrid.propTypes = { items: PropTypes.array.isRequired, selectedId: PropTypes.string, onSelect: PropTypes.func.isRequired, getImageUrl: PropTypes.func, title: PropTypes.string.isRequired, error: PropTypes.string, onNext: PropTypes.func.isRequired, onPrev: PropTypes.func, nextLabel: PropTypes.string };

// --- Success Modal (Focus Trap) ---
const SuccessPopup = ({ fullName, onClose }) => {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    buttonRef.current?.focus();
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-scale-in">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-green-50/50">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 id="success-title" className="text-2xl font-black font-cairo text-gray-800 mb-2">تم استلام طلبك!</h3>
        <p className="text-sm text-gray-600 font-tajawal mb-6">شكراً لك {fullName}.</p>
        <button ref={buttonRef} onClick={onClose} className="w-full bg-[#055c3a] text-white py-3.5 rounded-xl font-bold font-tajawal shadow-lg hover:bg-[#044c30]">حسناً</button>
      </div>
    </div>
  );
};
SuccessPopup.propTypes = { fullName: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

/* 
  =============================================================================
  5. ORCHESTRATOR
  =============================================================================
*/

const EliteOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ selectedColor: null, selectedMirror: null, fullName: '', phoneLocalPart: '', address: '', mirrorName: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const orderSectionRef = useRef(null);
  const { track } = useTracking();
  const { toast, showToast } = useToast();
  const { addToQueue, queueLength, hasPermanentErrors, isOnline } = useReliableOrderQueue(showToast);

  // Preload Images Strategy (UX)
  useEffect(() => {
    if (formData.selectedColor) {
      const colorData = AVAILABLE_COLORS.find(c => c.id === formData.selectedColor);
      if (colorData?.images) {
        Object.values(colorData.images).forEach(src => utils.preloadImage(src));
      }
    }
  }, [formData.selectedColor]);

  useEffect(() => {
    track('ViewContent', { content_name: 'Coiffeuse Élégante', value: CONFIG.PRICE, currency: CONFIG.CURRENCY });
  }, [track]);

  const scrollToTop = useCallback(() => {
    orderSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    // PAS DE .trim() ICI pour le bug d'espace
    const cleanValue = utils.sanitizeInput(value);
    
    let finalValue = cleanValue;
    if (name === 'phoneLocalPart') {
      const digits = cleanValue.replace(/\D/g, '');
      finalValue = digits.slice(0, 9).replace(/(\d{3})(?=\d)/g, '$1 ').trim();
      if (cleanValue.trim().startsWith('0')) finalValue = digits.slice(0, 10).replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    }
    
    setFormData(p => ({ ...p, [name]: finalValue }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  }, [errors]);

  const handleSelection = useCallback((key, id) => {
    setFormData(p => ({ ...p, [key]: id, ...(key === 'selectedColor' ? { selectedMirror: null } : {}) }));
    track(key === 'selectedColor' ? 'ProductColorSelected' : 'ProductMirrorSelected', { id });
    setErrors(p => ({ ...p, [key]: '' }));
  }, [track]);

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1 && !formData.selectedColor) newErrors.selectedColor = 'الرجاء اختيار لون';
    if (step === 2 && !formData.selectedMirror) newErrors.selectedMirror = 'الرجاء اختيار شكل المرآة';
    if (step === 3) {
      if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
      if (!formData.address.trim()) newErrors.address = 'عنوان التوصيل مطلوب';
      const cleanPhone = formData.phoneLocalPart.replace(/\s/g, '');
      if (!cleanPhone) newErrors.phoneLocalPart = 'رقم الهاتف مطلوب';
      else if (!CONFIG.PHONE_REGEX.test(cleanPhone.startsWith('0') ? cleanPhone : `0${cleanPhone}`)) {
        newErrors.phoneLocalPart = 'رقم هاتف غير صحيح';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = (direction) => {
    if (direction === 'next' && validateStep(currentStep)) {
      if (currentStep === 2) track('AddToCart');
      setCurrentStep(p => p + 1);
      scrollToTop();
    } else if (direction === 'prev' && currentStep > 1) {
      setCurrentStep(p => p - 1);
      scrollToTop();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    track('InitiateCheckout');

    const color = AVAILABLE_COLORS.find(c => c.id === formData.selectedColor);
    const mirror = MIRROR_STYLES.find(m => m.id === formData.selectedMirror);

    // On applique .trim() ici juste avant l'envoi
    addToQueue({
      eventId: utils.generateUUID(),
      selectedColorName: color?.name || "N/A",
      selectedMirrorName: mirror?.name || "N/A",
      fullName: formData.fullName.trim(),
      phone: formData.phoneLocalPart.replace(/\s/g, ''),
      address: formData.address.trim(),
      comments: formData.mirrorName.trim() || "",
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    });

    await new Promise(r => setTimeout(r, 600)); // UX delay
    track('Purchase', { value: CONFIG.PRICE, currency: CONFIG.CURRENCY });
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const resetForm = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setFormData({ selectedColor: null, selectedMirror: null, fullName: '', phoneLocalPart: '', address: '', mirrorName: '' });
    scrollToTop();
  };

  return (
    <section id="order" ref={orderSectionRef} className="py-6 bg-slate-50 relative overflow-hidden min-h-[600px]" dir="rtl">
      <GlobalStyles />
      {toast && <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-white text-sm font-tajawal animate-fade-in flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'warning' ? 'bg-orange-500' : 'bg-green-600'}`}><span>{toast.msg}</span></div>}

      <div className="container mx-auto px-4 max-w-md relative z-10">
        {!isOnline && <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-tajawal animate-fade-in"><WifiOff size={14} /> <span>وضع غير متصل: سيتم حفظ الطلب محلياً.</span></div>}
        {hasPermanentErrors && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-tajawal animate-fade-in"><AlertCircle size={14} /> <span>فشل إرسال بعض الطلبات. يرجى الاتصال بنا.</span></div>}
        {queueLength > 0 && isOnline && !hasPermanentErrors && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-tajawal animate-pulse"><Loader2 size={14} className="animate-spin" /> <span>جاري مزامنة الطلبات ({queueLength})...</span></div>}

        <div className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-200/50 border border-gray-50">
          <div className="mb-6 relative px-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax="3">
             <div className="flex items-center justify-between relative z-10">
                {[1, 2, 3].map(step => (
                    <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${currentStep >= step ? 'bg-[#055c3a] text-white border-[#055c3a] scale-110' : 'bg-white text-gray-300 border-gray-200'}`}>{currentStep > step ? <CheckCircle size={16} /> : step}</div>
                ))}
             </div>
             <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -z-0 mx-6" />
             <div className="absolute top-4 right-0 h-0.5 bg-[#055c3a] -z-0 mx-6 transition-all duration-500" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%', left: 'auto' }} />
          </div>

          {currentStep === 1 && (
            <StepSelectionGrid 
              title="إختر اللون اللذي يعجبك" 
              items={AVAILABLE_COLORS} 
              selectedId={formData.selectedColor} 
              onSelect={(id) => handleSelection('selectedColor', id)} 
              onNext={() => navigate('next')} 
              error={errors.selectedColor} 
            />
          )}

          {currentStep === 2 && (
            <StepSelectionGrid 
              title="إختر شكل المرٱة المناسب لك" 
              items={MIRROR_STYLES} 
              selectedId={formData.selectedMirror} 
              onSelect={(id) => handleSelection('selectedMirror', id)} 
              getImageUrl={(item) => AVAILABLE_COLORS.find(c => c.id === formData.selectedColor)?.images[item.id]}
              onNext={() => navigate('next')} 
              onPrev={() => navigate('prev')} 
              error={errors.selectedMirror} 
            />
          )}
          
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="animate-slide-in space-y-4" noValidate>
              <div className="text-center mb-4"><h2 className="text-xl font-black text-gray-800 font-cairo">معلومات التوصيل</h2><div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 mt-2"><Gift className="h-5 w-5 text-orange-500 animate-bounce" /><span className="text-orange-700 font-bold text-sm font-tajawal">+ إسمك هدية</span></div></div>
              <div className="space-y-4">
                <FormField name="fullName" icon={User} placeholder="الاسم الكامل" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} type="text" />
                <FormField name="phoneLocalPart" icon={Phone} placeholder="رقم الهاتف" value={formData.phoneLocalPart} onChange={handleInputChange} error={errors.phoneLocalPart} type="tel" prefix="+212" />
                <FormField name="address" icon={MapPin} placeholder="المدينة - الحي" value={formData.address} onChange={handleInputChange} error={errors.address} type="textarea" />
                <FormField name="mirrorName" icon={Sparkles} placeholder="الاسم فوق المرآة (اختياري)" value={formData.mirrorName} onChange={handleInputChange} type="text" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => navigate('prev')} className="w-[20%] bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors"><ArrowRight className="w-6 h-6" /></button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#055c3a] text-white py-4 rounded-xl font-cairo font-black text-xl shadow-lg hover:bg-[#044c30] flex items-center justify-center gap-3 disabled:opacity-70 transition-all">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle className="w-6 h-6" /><span>تأكـــيد الطلب</span></>}</button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {showSuccess && <SuccessPopup fullName={formData.fullName} onClose={resetForm} />}
    </section>
  );
};

export default EliteOrderForm;