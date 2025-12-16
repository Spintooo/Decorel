import React, { memo, useEffect } from 'react';
import {
    ShieldCheck,
    MapPin,
    Hammer,
    Zap,
    Gem,
    Clock,
    CheckCircle2,
    PackageCheck,
    ChevronDown,
    Star,
    Award,
    Truck,
    Gift
} from 'lucide-react';

// --- STYLES & FONTS ---
const useCriticalStyles = () => {
    useEffect(() => {
        const criticalCSS = `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
      
      :root {
        --primary-green: #055c3a;
        --primary-dark: #033823;
        --accent-green: #f0fdf4;
        --order-green: #068906;
      }
      
      .font-tajawal { font-family: 'Tajawal', sans-serif; }
      .text-primary { color: var(--primary-green); }
      
      /* Animation de pulsation pour le CTA */
      @keyframes pulse-green {
        0% { box-shadow: 0 0 0 0 rgba(6, 137, 6, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(6, 137, 6, 0); }
        100% { box-shadow: 0 0 0 0 rgba(6, 137, 6, 0); }
      }
      .btn-pulse { animation: pulse-green 2s infinite; }
    `;
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
};

// --- COMPOSANTS UI COMPACTS ---

const CTAButton = ({ text, onClick, pulse = false, fullWidth = false }) => (
    <button
        onClick={onClick}
        className={`
      ${fullWidth ? 'w-full' : 'w-auto'}
      ${pulse ? 'btn-pulse' : ''}
      relative overflow-hidden group bg-[#068906] hover:bg-[#057005] 
      text-white font-black py-4 px-6 rounded-xl 
      transform transition-all duration-300 hover:-translate-y-1 shadow-lg
      flex items-center justify-center gap-2 text-lg
    `}
    >
        <span>{text}</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
    </button>
);

// Carte caractéristique version compacte (Horizontale)
const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 h-full">
        <div className="shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-primary">
            <Icon size={20} strokeWidth={2.5} />
        </div>
        <div>
            <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{title}</h3>
            <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
        </div>
    </div>
);

// --- COMPOSANT PRINCIPAL ---
const ProductLandingPage = () => {
    useCriticalStyles();

    const scrollToOrder = () => {
        const element = document.getElementById('order');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div dir="rtl" className="font-tajawal bg-gray-50 text-gray-800 overflow-x-hidden">

            {/* 1. HERO COMPACT */}
            <section className="relative pt-8 pb-10 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    
                    {/* Badge Top */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-green-100 mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-1xl font-bold text-primary">الأكثر طلباً في المغرب 🔥❤️</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
                        ليست مجرد كوافوز... <br />
                        <span className="text-[#046c4e]">
                             بل استثمار في أناقة غرفتك
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-6">
                        إذا كنتِ تبحثين عن متانة تدوم سنوات، وليس منتجًا صينيًا رخيصًا، فهذا هو الاختيار الصحيح.
                    </p>

                    {/* Badges Layout Optimisé */}
                    <div className="max-w-md mx-auto mb-8">
                        {/* Ligne 1 : 2 colonnes */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                                <MapPin className="text-red-600 w-4 h-4" />
                                <span className="font-bold text-sm text-gray-800">المصنع يتواجد بأكادير</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                                <Award className="text-primary w-4 h-4" />
                                <span className="font-bold text-sm text-gray-800">ضمان لمدة سنتين</span>
                            </div>
                        </div>
                        {/* Ligne 2 : Centré */}
                        <div className="flex justify-center">
                             <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                                <Truck className="text-primary w-4 h-4" />
                                <span className="font-bold text-sm text-primary">التوصـــيـــل مجاني لجميع المدن</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. FEATURES COMPACTES */}
            <section className="py-8 bg-white rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-black">لماذا هذا الكوافوز مختلف؟</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureCard 
                            icon={ShieldCheck}
                            title="خامة قوية وعالية الجودة"
                            desc="خشب MDF 18mm عالي الكثافة، معالج ضد الرطوبة. لا انتفاخ، لا تشقق."
                        />
                        <FeatureCard 
                            icon={Gem}
                            title="مرآة كريستالية نقية"
                            desc="زجاج فائق الوضوح ومقاوم للخدش. ستظهر تفاصيل مكياجك بكل دقة."
                        />
                        <FeatureCard 
                            icon={Zap}
                            title="إضاءة LED ذكية"
                            desc="إضاءة متوازنة طبيعية للمكياج، مع استهلاك ضعيف جداً للكهرباء."
                        />
                        <FeatureCard 
                            icon={Hammer}
                            title="ستشتري من المصنع مباشرة"
                            desc="نحن المصنع ولسنا موزعين. نضمن الجودة والسعر لأننا نتحكم في كل التفاصيل."
                        />
                    </div>

                    {/* CTA MILIEU */}
                    <div className="mt-8 flex justify-center">
                        <div className="w-full max-w-sm text-center">
                            <CTAButton 
                                text="أضغط هنا للشراء" 
                                onClick={scrollToOrder} 
                                pulse={true}
                                fullWidth={true}
                            />
                            <p className="text-gray-500 mt-2 text-xs font-bold flex items-center justify-center gap-1">
                                <Gift className="w-3 h-3 text-pink-500" />
                                هدية خاصة: "إسمك مكتوب فوق الكوافوز"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. DIMENSIONS (Gardé tel quel mais marges réduites) */}
            <section className="py-10 bg-gray-50">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-6">
                         مقاييــس المنتج
                    </h2>

                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <div className="p-4 bg-gradient-to-b from-gray-50 to-white flex justify-center">
                            <img 
                                src="https://i.ibb.co/DDbRcrqx/FINALE-min.webp" 
                                alt="مخطط أبعاد طاولة الزينة" 
                                className="w-full h-auto max-h-[400px] object-contain"
                                loading="lazy"
                            />
                        </div>
                        
                        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 bg-gray-900 text-white p-4">
                            <div className="text-center">
                                <span className="block text-gray-400 text-[10px] font-bold uppercase mb-1">الارتفاع</span>
                                <span className="block text-xl font-black text-green-400">77 cm</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-gray-400 text-[10px] font-bold uppercase mb-1">العرض</span>
                                <span className="block text-xl font-black text-green-400">80 cm</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-gray-400 text-[10px] font-bold uppercase mb-1">العمق</span>
                                <span className="block text-xl font-black text-green-400">27 cm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CONTENU & INSTALLATION */}
            <section className="py-10 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    
                    {/* Installation Simple */}
                    <div className="flex items-start gap-4 mb-8 p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="bg-white p-2 rounded-lg text-primary shrink-0 shadow-sm">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">تركيب سهل في 5 دقائق</h3>
                            <p className="text-sm text-gray-700 leading-snug">
                                لا حاجة لاي معلم لتركيب الكوافوز، نرسل لك فيديو شرح واضح خطوة بخطوة، وتقومين بالتركيب بنفسك بكل سهولة ومتعة.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Liste */}
                        <div>
                            <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                                <PackageCheck className="text-primary w-5 h-5" />
                                ما الذي تشتريه فعليًا؟
                            </h3>
                            <ul className="space-y-2">
                                {[
                                    "صناعة مغربية 100% (جودة المعمل)",
                                    "منتج خارج مباشرة من أكادير",
                                    "جودة أعلى من المنتجات الصينية",
                                    "موديل يعيش معك سنوات",
                                    "شكل راقي يرفع مستوى جمالية غرفتك فوراً"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <CheckCircle2 className="text-green-600 w-4 h-4 shrink-0" />
                                        <span className="font-medium text-gray-800">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Carte Confiance */}
                        <div className="bg-gray-900 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 rounded-full blur-[40px] opacity-20"></div>
                            <div className="relative z-10 text-center">
                                <Star className="w-8 h-8 text-yellow-400 mb-2 mx-auto" fill="currentColor" />
                                <h3 className="text-xl font-bold mb-2">الثقة قبل البيع</h3>
                                <p className="text-gray-300 text-sm mb-0">
                                    ضمان الجودة 2 سنوات. نحن واثقون من منتجنا لأننا نحن من صنعه.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA FINAL */}
            <section className="py-6 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 max-w-sm text-center">
                    <CTAButton 
                        text="الشراء مباشرة من المصنع" 
                        onClick={scrollToOrder} 
                        pulse={true}
                        fullWidth={true}
                    />
                    <p className="mt-3 text-xs text-gray-600 font-semibold flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                         الخلاص فاش توصلك الطلبية | قلب عاد خلص
                    </p>
                </div>
            </section>

        </div>
    );
};

export default memo(ProductLandingPage);