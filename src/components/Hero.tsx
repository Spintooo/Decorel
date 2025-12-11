import React, { useEffect, useState } from 'react';
import { ShoppingCart, Truck, Gift, Star, ShieldCheck, Sparkles } from 'lucide-react';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Vérifier si c'est un mobile au chargement initial
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const shakeButton = () => {
      const buttons = document.querySelectorAll('.cta-button');
      buttons.forEach(button => {
        button.classList.add('shake-animation');
        setTimeout(() => {
          button.classList.remove('shake-animation');
        }, 600);
      });
    };

    // Animation toutes les 3 secondes
    const shakeInterval = setInterval(() => {
      shakeButton();
    }, 5000);

    return () => {
      clearInterval(shakeInterval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Action de scroll mise à jour (Identique à la Navbar)
  const scrollToOrder = () => {
    const element = document.getElementById('order');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Section Hero */}
      <section 
        id="home" 
        className="relative bg-gradient-to-br from-[#F5F1EB] via-[#FAF7F0] to-[#F5F1EB] pt-3 pb-2 lg:pt-4 lg:pb-3 overflow-hidden"
        dir="rtl"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#E8B4A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#9CAF88]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-3 max-w-6xl relative z-10">
          
          {/* Mobile Layout - Optimisé */}
          <div className="block lg:hidden">
            {/* Image mobile */}
            <div className="mb-3 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B4A0]/10 to-[#8B4513]/10 rounded-2xl transform rotate-1"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                  <img 
                    src="https://i.ibb.co/DHCpFtxr/Design-sans-titre-min.png"
                    alt="كوافوز فاخرة بتصميم عصري"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            {/* Prix et Réduction */}
            <div className="bg-gradient-to-br from-white via-white to-[#f8fafc] rounded-2xl px-4 py-2.5 mb-3 shadow-xl border-2 border-[#e2e8f0] backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="font-cairo font-black text-4xl text-[#055c3a]">729</span>
                    <span className="font-tajawal text-lg text-[#055c3a]">درهم</span>
                  </div>
                </div>
                
                <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#cbd5e1] to-transparent mx-4"></div>
                
                <div className="flex flex-col items-center">
                  <span className="font-tajawal text-base text-gray-500 line-through mb-1">950 درهم</span>
                  <span className="bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
عرض لمدة محدودة فقط !
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton d'action Mobile - Couleur #055c3a appliquée */}
            <div className="mt-4 mb-3 px-1">
              <button 
                onClick={scrollToOrder}
                className="cta-button w-full text-white py-4 px-4 rounded-xl font-tajawal font-bold text-lg
                         transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-1px]
                         active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: '#055c3a' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#044a30'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#055c3a'}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>أضغط هنا للشراء</span>
              </button>
            </div>

            {/* NOUVELLES CARTES 70% / 30% */}
            {isMobile && (
              <div className="mt-4 px-1">
                <div className="flex items-stretch gap-2">
                  
                  {/* Carte Livraison (70%) */}
                  <div className="w-[70%] bg-[#055c3a]/5 rounded-xl p-3 shadow-sm border border-[#055c3a]/20 flex items-center justify-center gap-3">
                    <div className="bg-[#055c3a] text-white p-2 rounded-full">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-tajawal font-bold text-[#055c3a]">
                      توصــــيـــل مجـــانـــي وسريع
                    </span>
                  </div>
                  
                  {/* Carte Cadeau (30%) */}
                  <div className="w-[30%] bg-[#E8B4A0]/10 rounded-xl p-2 shadow-sm border border-[#E8B4A0]/40 flex flex-col items-center justify-center text-center">
                    <div className="mb-1">
                      <Gift className="h-5 w-5 text-[#8B4513]" />
                    </div>
                    <span className="text-[11px] font-tajawal font-bold text-[#8B4513] leading-tight">
                      + هدية رائـــعة
                    </span>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-5 lg:gap-10 lg:items-center lg:min-h-[70vh]">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="flex justify-start">
                <div className="inline-flex items-center bg-gradient-to-r from-[#8B4513] via-[#D2B48C] to-[#E8B4A0] text-white px-5 py-2 rounded-full shadow-lg border border-white/30">
                  <Sparkles className="h-4 w-4 ml-2" />
                  <span className="font-tajawal font-bold text-sm">موديل عصري وأنيق</span>
                </div>
              </div>

              <div className="py-2">
                <h1 className="font-cairo font-black text-6xl xl:text-7xl text-[#2C2C2C] leading-none">
                  كوافـــوز راقي مع هدية
                </h1>
              </div>

              <div className="bg-gradient-to-br from-white to-[#FAF7F0] rounded-2xl p-5 shadow-xl border border-[#D2B48C]/30">
                <div className="grid grid-cols-2 gap-4 items-center mb-4">
                  
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-cairo font-black text-5xl text-[#055c3a]">729</span>
                      <span className="font-tajawal text-xl text-[#2C2C2C]">درهم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-tajawal text-lg text-gray-500 line-through">950 درهم</span>
                      <span className="bg-gradient-to-r from-[#E8B4A0] to-[#8B4513] text-white px-2.5 py-1 rounded-lg text-sm font-bold">
                        خصم 23%
                      </span>
                    </div>
                    <p className="text-[#5D8A5F] font-tajawal font-medium text-sm mt-1">
                      وفّري 221 درهم
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#E8B4A0] mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-tajawal text-[#2C2C2C] font-semibold block">+1,200 عميلة</span>
                    <span className="text-xs font-tajawal text-[#9CAF88] block">تقييم ممتاز</span>
                  </div>
                </div>

                <button 
                  onClick={scrollToOrder}
                  className="cta-button w-full text-white py-4 px-6 rounded-xl font-tajawal font-bold text-lg
                             transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.01] 
                             flex items-center justify-center gap-3"
                  style={{ backgroundColor: '#055c3a' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#044a30'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#055c3a'}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>اطلبي الآن - توصيل مجاني</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col items-center bg-white/90 rounded-xl p-3 shadow-sm border border-[#055c3a]/20 flex-1">
                  <div className="bg-[#055c3a] text-white p-1.5 rounded-full mb-2">
                    <Truck className="h-4 w-4" />
                  </div>
                  <span className="block text-xs font-tajawal font-bold text-center">توصيل مجاني</span>
                  <span className="text-[10px] font-tajawal text-gray-600 text-center">جميع المدن</span>
                </div>
                
                <div className="flex flex-col items-center bg-white/90 rounded-xl p-3 shadow-sm border border-[#E8B4A0]/20 flex-1">
                  <div className="bg-[#E8B4A0] text-white p-1.5 rounded-full mb-2">
                    <Gift className="h-4 w-4" />
                  </div>
                  <span className="block text-xs font-tajawal font-bold text-center">هدية فاخرة</span>
                  <span className="text-[10px] font-tajawal text-gray-600 text-center">مع كل طلب</span>
                </div>
                
                <div className="flex flex-col items-center bg-white/90 rounded-xl p-3 shadow-sm border border-[#8B4513]/20 flex-1">
                  <div className="bg-[#8B4513] text-white p-1.5 rounded-full mb-2">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="block text-xs font-tajawal font-bold text-center">ضمان شامل</span>
                  <span className="text-[10px] font-tajawal text-gray-600 text-center">جودة عالية</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B4A0]/15 to-[#8B4513]/15 rounded-3xl transform rotate-2"></div>
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src="https://i.ibb.co/DHCpFtxr/Design-sans-titre-min.png?auto=compress&cs=tinysrgb&w=1000&h=1000&fit=crop"
                    alt="كوافوز فاخرة بتصميم عصري"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-[#D2B48C]/20">
                  <span className="font-aref-ruqaa text-[#8B4513] font-bold">تصميم حصري</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap');
        
        .font-cairo { font-family: 'Cairo', sans-serif; }
        .font-tajawal { font-family: 'Tajawal', sans-serif; }
        .font-almarai { font-family: 'Almarai', sans-serif; }
        .font-ibm-plex-sans { font-family: 'IBM Plex Sans Arabic', sans-serif; }
        .font-aref-ruqaa { font-family: 'Aref Ruqaa', serif; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        .shake-animation {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }

        /* Optimisations pour mobile */
        @media (max-width: 1024px) {
          img {
            content-visibility: auto;
          }
          
          .cta-button {
            touch-action: manipulation;
          }
        }
      `}</style>
    </>
  );
};

export default Hero;