import React, { memo } from 'react';
import {
    SlidersHorizontal,
    Ruler,
    Shield,
    Zap,
    Eye
} from 'lucide-react';

// Composant de caractéristique optimisé pour l'arabe
const SpecPoint = memo(({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 text-left">
    <div className="flex-shrink-0 mt-1 p-2.5 bg-gradient-to-br from-primary-green/15 to-primary-green/5 rounded-xl">
      <Icon className="w-6 h-6 text-primary-green" strokeWidth={2.5} />
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
));

// Styles critiques avec support RTL
const useCriticalStyles = () => {
  React.useEffect(() => {
    const criticalCSS = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
      
      .font-inter { font-family: 'Inter', sans-serif; }
      .font-tajawal { font-family: 'Tajawal', sans-serif; }
      
      .bg-primary-green { background-color: #055c3a; }
      .text-primary-green { color: #055c3a; }
      .bg-order-green { background-color: #068906; }
      .hover\\:bg-primary-green-dark:hover { background-color: #044a30; }
      .hover\\:bg-order-green-dark:hover { background-color: #057005; }
      .focus-ring-green:focus-visible { 
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(5, 92, 58, 0.5);
      }
      
      /* Optimisations RTL */
      .rtl { direction: rtl; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

const TechnicalSpecsSection = () => {
  useCriticalStyles();

  const scrollToOrder = () => {
    const element = document.getElementById('order');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const specsData = {
    sectionTitle: "مقاييــس المنتج",
    specs: [
      { 
        title: "خامة عالية الجودة", 
        description: "خشب MDF عالي الكثافة، معالج لمقاومة الرطوبة وضمان عمر افتراضي طويل.",
        icon: Shield
      },
      { 
        title: "إضاءة LED ذكية", 
        description: "نظام إضاءة LED مدمج يوفر إضاءة محايدة وموفرة للطاقة لمظهر مثالي.",
        icon: Zap
      },
      { 
        title: "مرآة فائقة الجودة", 
        description: "زجاج كريستالي مقاوم للخدش، يوفر وضوحاً استثنائياً بدون تشويه.",
        icon: Eye
      },
      { 
        title: "تصميم دقيق", 
        description: "أبعاد محسّنة للتكامل المثالي مع مساحتك مع توفير أقصى مساحة تخزين.",
        icon: Ruler
      },
    ],
    dimensions: {
      height: { label: "الارتفاع", value: "77 سم" },
      width: { label: "العرض", value: "80 سم" },
      depth: { label: "العمق", value: "27 سم" }
    },
    cta: {
      button: "اريد شراء هذا المنتج",
      guarantee: "✓ ضمان سنتين مُدرج"
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white font-tajawal rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* 1. En-tête optimisé */}
          <div className="space-y-5">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {specsData.sectionTitle}
            </h2>
          </div>

          {/* 2. Carte dimensions améliorée */}
          <div className="w-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500">
                <div className="p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-white">
                    <img 
                      src="https://i.ibb.co/DDbRcrqx/FINALE-min.webp" 
                      alt="مخطط أبعاد طاولة الزينة" 
                      className="w-full h-auto rounded-2xl shadow-lg ring-1 ring-gray-200"
                      loading="lazy"
                    />
                </div>
                <div className="grid grid-cols-3 gap-6 p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200">
                    <div className="text-center space-y-2">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          {specsData.dimensions.height.label}
                        </p>
                        <p className="font-black text-2xl text-primary-green">
                          {specsData.dimensions.height.value}
                        </p>
                    </div>
                    <div className="text-center space-y-2 border-x border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          {specsData.dimensions.width.label}
                        </p>
                        <p className="font-black text-2xl text-primary-green">
                          {specsData.dimensions.width.value}
                        </p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          {specsData.dimensions.depth.label}
                        </p>
                        <p className="font-black text-2xl text-primary-green">
                          {specsData.dimensions.depth.value}
                        </p>
                    </div>
                </div>
            </div>
          </div>

          {/* 3. Grille de spécifications alignée à gauche */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 pt-6">
            {specsData.specs.map((spec) => (
              <div key={spec.title} className="group">
                <SpecPoint 
                  icon={spec.icon}
                  title={spec.title}
                  description={spec.description}
                />
              </div>
            ))}
          </div>

          {/* 4. CTA avec couleur verte */}
          <div className="space-y-4 pt-4">
            <button
              onClick={scrollToOrder}
              className="px-12 py-5 bg-order-green text-white text-xl font-black rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 focus-ring-green hover:bg-order-green-dark active:scale-95"
            >
              {specsData.cta.button}
            </button>
            <p className="text-base text-gray-600 font-bold">
              {specsData.cta.guarantee}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default memo(TechnicalSpecsSection);