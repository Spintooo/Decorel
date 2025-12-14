import React, { useState, useEffect, useRef } from 'react';

// --- Composant pour l'icône officielle de WhatsApp ---
const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
    />
  </svg>
);

// Hook pour les styles critiques et minimalistes
const useMinimalStyles = () => {
  React.useEffect(() => {
    const criticalCSS = `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
      .font-tajawal { font-family: 'Tajawal', sans-serif; }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .animate-fade-in {
        animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      .animate-pulse-slow {
        animation: pulse 2s ease-in-out infinite;
      }
    `;
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

const Footer = () => {
  useMinimalStyles();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);
  const footerRef = useRef(null);

  const whatsappNumber = '212675118958';
  const whatsappMessage = encodeURIComponent('السلام عليكم بغيت نعرف الاشكال والالوان لي عندكم');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollHeight <= clientHeight) {
        setIsButtonVisible(false);
        return;
      }
      
      const scrollableHeight = scrollHeight - clientHeight;
      const scrollPercent = (scrollTop / scrollableHeight) * 100;
      
      // Afficher le bouton sticky après 50% de scroll
      setIsButtonVisible(scrollPercent > 40);
      
      // Vérifier si le footer est visible
      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const footerTop = footerRect.top;
        const windowHeight = window.innerHeight;
        
        // Si le footer entre dans la vue
        setIsFooterInView(footerTop < windowHeight);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsFooterInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 0px 0px'
      }
    );

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const timer = setTimeout(() => {
      if (footerRef.current) {
        observer.observe(footerRef.current);
      }
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Bouton WhatsApp Sticky - Rond et plus petit */}
      {isButtonVisible && !isFooterInView && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          // Modifié ici: w-16 h-16 (plus petit) et rounded-full (rond)
          className="fixed bottom-8 right-8 z-40 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-3xl hover:rotate-3 group animate-fade-in"
          aria-label="Contact WhatsApp"
        >
          <div className="relative">
            {/* Icône légèrement réduite pour aller avec la nouvelle taille du bouton */}
            <WhatsAppIcon className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute -inset-3 bg-[#25D366] rounded-full opacity-20 animate-pulse-slow"></div>
          </div>
          <div className="absolute -bottom-10 right-1/2 translate-x-1/2 bg-black/90 text-white text-xs font-tajawal font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            تواصل معنا
          </div>
        </a>
      )}

      <footer ref={footerRef} className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200/50 font-tajawal relative overflow-hidden">
        {/* Fond décoratif */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#25D366]/5 to-transparent"></div>
        
        {/* Contenu Footer */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Section WhatsApp */}
            <div className="flex-1 max-w-xl">
              <div className="bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 backdrop-blur-sm border border-[#25D366]/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex flex-col sm:flex-row items-center gap-6 group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                      <WhatsAppIcon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-right flex-1">
                    {/* Nouveau texte WhatsApp */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#128C7E] transition-colors duration-300 leading-snug">
                      تواصل معي عبر الواتساب اذا لم يعجبك هذا الشكل لدينا عدة اشكال ومقاسات.
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      رد سريع عبر الواتساب خلال دقائق معدودة ✓
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                      <span className="text-green-600 font-medium">متصل الآن</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Section Copyright et Info */}
            <div className="flex-1 text-center lg:text-right">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
                {/* Titre DECOREL supprimé */}
                
                {/* Nouveau texte Info */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6 font-medium">
  
                  <br className="hidden sm:block" />
                  <span className="block mt-1">
                    </span>أكـــــــادير – المغرب 🇲🇦
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-500 text-sm font-medium">
                    © 2025 DECOREL l جميع الحقوق محفوظة.
                  </p>
                  {/* Texte "Conception technique" supprimé */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Décoration du bas */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#25D366]/30 to-transparent"></div>
      </footer>
    </>
  );
};

export default Footer;