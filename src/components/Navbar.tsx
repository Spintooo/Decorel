import React, { useState, useEffect, memo } from 'react';
import { Phone } from 'lucide-react';

// Styles minimalistes
const useMinimalStyles = () => {
  useEffect(() => {
    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display.swap');
      
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      body {
        font-family: 'Inter', sans-serif;
      }

      .minimal-nav {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid #e5e5e5;
      }

      .minimal-nav.scrolled {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
      
      .shake-animation {
        animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
      }

      @keyframes continuous-shake {
        0%, 100% { transform: translateX(0) rotate(0); }
        2% { transform: translateX(-2px) rotate(-0.5deg); }
        4% { transform: translateX(2px) rotate(0.5deg); }
        6% { transform: translateX(-2px) rotate(-0.5deg); }
        8% { transform: translateX(2px) rotate(0.5deg); }
        10% { transform: translateX(-1px) rotate(-0.3deg); }
        12% { transform: translateX(1px) rotate(0.3deg); }
        14% { transform: translateX(0) rotate(0); }
      }
      
      .continuous-shake {
        animation: continuous-shake 3s ease-in-out infinite;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  useMinimalStyles();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Gère le cas où la page n'est pas scrollable
      if (scrollHeight <= clientHeight) {
        setIsVisible(true);
        setIsScrolled(false);
        return;
      }

      const scrollableHeight = scrollHeight - clientHeight;
      const scrollPercentage = (scrollTop / scrollableHeight) * 100;

      // Masque la navbar si le scroll est supérieur à 17%
      setIsVisible(scrollPercentage < 2);
      
      // Gère l'ombre de la navbar
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Exécute la fonction une fois au montage pour définir l'état initial
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation de shaking toutes les 3 secondes
  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setIsShaking(true);
      
      // Arrête l'animation après 600ms (durée de l'animation)
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
      
    }, 3000); // Répète toutes les 3 secondes

    return () => clearInterval(shakeInterval);
  }, []);

  const scrollToOrder = () => {
    const element = document.getElementById('order');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header 
        className={`minimal-nav ${isScrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'transform 0.4s ease, box-shadow 0.2s',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)', // Applique la visibilité
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          
          {/* Logo */}
          <button
            onClick={scrollToOrder}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="DECOREL - Retour accueil"
          >
            <img
              src="https://i.ibb.co/0yyWGG3p/ddd-min-removebg-preview.png"
              alt="DECOREL Logo"
              style={{
                height: '45px',
                width: 'auto',
                display: 'block'
              }}
            />
          </button>

          {/* CTA Button avec animation de shaking */}
          <button
            onClick={scrollToOrder}
            className={isShaking ? 'shake-animation' : ''}
            style={{
              background: '#055c3a',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexDirection: 'row-reverse',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#044a30';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#055c3a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Phone size={18} />
            اطلب الآن
          </button>
        </div>
      </header>
      
      {/* Spacer pour compenser la hauteur de la navbar fixe */}
      <div style={{ height: '70px' }} />
    </>
  );
};

export default memo(Navbar);