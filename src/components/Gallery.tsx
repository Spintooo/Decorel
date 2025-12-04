import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, Eye, Palette, Trash2, ArrowLeft } from 'lucide-react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Configuration for image optimization
const IMAGE_OPTIMIZATION = {
  quality: 75,
  format: 'webp',
  width: 800,
};

// Function to generate optimized image URLs
const optimizeImage = (url) => {
  if (!url) return '';
  // If using an image CDN like Cloudinary, Imgix etc:
  // return `${url}?w=${IMAGE_OPTIMIZATION.width}&q=${IMAGE_OPTIMIZATION.quality}&format=${IMAGE_OPTIMIZATION.format}`;
  
  // Fallback to original if no optimizer service
  return url;
};

// Simple SVG placeholder
const createPlaceholder = (color = '#f0f0f0') => 
  `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="${color}"/></svg>`)}`;

const AVAILABLE_COLORS = [
  { 
    id: 'white', 
    name: 'Blanc Noble', 
    className: 'bg-white',
    ringClass: 'ring-gray-300',
    textClass: 'text-gray-700',
    hex: '#FFFFFF',
    textureSrc: optimizeImage('https://i.ibb.co/XZh7sC8c/ZZ.png')
  },
  { 
    id: 'wood', 
    name: 'Brun Bois Naturel', 
    className: 'bg-[#8B4513]', 
    ringClass: 'ring-amber-800',
    textClass: 'text-amber-900',
    hex: '#8B4513',
    textureSrc: optimizeImage('https://i.ibb.co/0yCXtBfK/FFFF.png')
  },
  { 
    id: 'gold', 
    name: 'Or Élégant', 
    className: 'bg-[#D4AF37]', 
    ringClass: 'ring-yellow-600',
    textClass: 'text-yellow-800',
    hex: '#D4AF37',
    textureSrc: optimizeImage('https://i.ibb.co/s9CP6Bpd/FF.png')
  },
  { 
    id: 'charcoal', 
    name: 'Charbon Luxueux', 
    className: 'bg-[#2C2C2C]', 
    ringClass: 'ring-gray-700',
    textClass: 'text-gray-800',
    hex: '#2C2C2C',
    textureSrc: optimizeImage('https://i.ibb.co/DDznmZnm/DDDD.png')
  },
];

const Gallery = () => {
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const allImages = useMemo(() => [
    // Brown color
    { id: 'brown1', src: optimizeImage("https://i.ibb.co/67GH97G9/1.jpg"), alt: "Miroir de maquillage couleur brun - Design 1", color: 'wood', title: "Brun Élégant - Design 1", placeholder: createPlaceholder('#8B4513') },
    { id: 'brown2', src: optimizeImage("https://i.ibb.co/hF4VznfT/2.jpg"), alt: "Miroir de maquillage couleur brun - Design 2", color: 'wood', title: "Brun Élégant - Design 2", placeholder: createPlaceholder('#8B4513') },
    { id: 'brown3', src: optimizeImage("https://i.ibb.co/rGm3M6D6/3.jpg"), alt: "Miroir de maquillage couleur brun - Design 3", color: 'wood', title: "Brun Élégant - Design 3", placeholder: createPlaceholder('#8B4513') },
    { id: 'brown4', src: optimizeImage("https://i.ibb.co/prQrYdcG/4.jpg"), alt: "Miroir de maquillage couleur brun - Design 4", color: 'wood', title: "Brun Élégant - Design 4", placeholder: createPlaceholder('#8B4513') },
    { id: 'brown5', src: optimizeImage("https://i.ibb.co/G4R7NtMs/5.jpg"), alt: "Miroir de maquillage couleur brun - Design 5", color: 'wood', title: "Brun Élégant - Design 5", placeholder: createPlaceholder('#8B4513') },
    { id: 'brown6', src: optimizeImage("https://i.ibb.co/Fq824N9H/6.jpg"), alt: "Miroir de maquillage couleur brun - Design 6", color: 'wood', title: "Brun Élégant - Design 6", placeholder: createPlaceholder('#8B4513') },
    { id: 'brown7', src: optimizeImage("https://i.ibb.co/Ndp5c8j8/7.jpg"), alt: "Miroir de maquillage couleur brun - Design 7", color: 'wood', title: "Brun Élégant - Design 7", placeholder: createPlaceholder('#8B4513') },
    // Gold color
    { id: 'gold1', src: optimizeImage("https://i.ibb.co/ZRHkZ1RL/1.jpg"), alt: "Miroir de maquillage couleur or - Design 1", color: 'gold', title: "Or Luxueux - Design 1", placeholder: createPlaceholder('#D4AF37') },
    { id: 'gold2', src: optimizeImage("https://i.ibb.co/9m8NfB2v/2.jpg"), alt: "Miroir de maquillage couleur or - Design 2", color: 'gold', title: "Or Luxueux - Design 2", placeholder: createPlaceholder('#D4AF37') },
    { id: 'gold3', src: optimizeImage("https://i.ibb.co/zTyph49S/3.jpg"), alt: "Miroir de maquillage couleur or - Design 3", color: 'gold', title: "Or Luxueux - Design 3", placeholder: createPlaceholder('#D4AF37') },
    { id: 'gold4', src: optimizeImage("https://i.ibb.co/VRBNGvy/4.jpg"), alt: "Miroir de maquillage couleur or - Design 4", color: 'gold', title: "Or Luxueux - Design 4", placeholder: createPlaceholder('#D4AF37') },
    { id: 'gold5', src: optimizeImage("https://i.ibb.co/XZhSvMGD/5.jpg"), alt: "Miroir de maquillage couleur or - Design 5", color: 'gold', title: "Or Luxueux - Design 5", placeholder: createPlaceholder('#D4AF37') },
    { id: 'gold6', src: optimizeImage("https://i.ibb.co/Myfk8VDt/6.jpg"), alt: "Miroir de maquillage couleur or - Design 6", color: 'gold', title: "Or Luxueux - Design 6", placeholder: createPlaceholder('#D4AF37') },
    { id: 'gold7', src: optimizeImage("https://i.ibb.co/YFDNfX7m/7.jpg"), alt: "Miroir de maquillage couleur or - Design 7", color: 'gold', title: "Or Luxueux - Design 7", placeholder: createPlaceholder('#D4AF37') },
    // Charcoal color
    { id: 'charcoal1', src: optimizeImage("https://i.ibb.co/7JLDJv7R/1.jpg"), alt: "Miroir de maquillage couleur charbon - Design 1", color: 'charcoal', title: "Charbon Sophistiqué - Design 1", placeholder: createPlaceholder('#2C2C2C') },
    { id: 'charcoal2', src: optimizeImage("https://i.ibb.co/5hRwtt4K/2.jpg"), alt: "Miroir de maquillage couleur charbon - Design 2", color: 'charcoal', title: "Charbon Sophistiqué - Design 2", placeholder: createPlaceholder('#2C2C2C') },
    { id: 'charcoal3', src: optimizeImage("https://i.ibb.co/DDK1H8fS/3.jpg"), alt: "Miroir de maquillage couleur charbon - Design 3", color: 'charcoal', title: "Charbon Sophistiqué - Design 3", placeholder: createPlaceholder('#2C2C2C') },
    { id: 'charcoal4', src: optimizeImage("https://i.ibb.co/GvPNh9zD/4.jpg"), alt: "Miroir de maquillage couleur charbon - Design 4", color: 'charcoal', title: "Charbon Sophistiqué - Design 4", placeholder: createPlaceholder('#2C2C2C') },
    { id: 'charcoal5', src: optimizeImage("https://i.ibb.co/YB3vJT8R/5.jpg"), alt: "Miroir de maquillage couleur charbon - Design 5", color: 'charcoal', title: "Charbon Sophistiqué - Design 5", placeholder: createPlaceholder('#2C2C2C') },
    { id: 'charcoal6', src: optimizeImage("https://i.ibb.co/3m5x3cR0/6.jpg"), alt: "Miroir de maquillage couleur charbon - Design 6", color: 'charcoal', title: "Charbon Sophistiqué - Design 6", placeholder: createPlaceholder('#2C2C2C') },
    { id: 'charcoal7', src: optimizeImage("https://i.ibb.co/hFWVqqLL/7.jpg"), alt: "Miroir de maquillage couleur charbon - Design 7", color: 'charcoal', title: "Charbon Sophistiqué - Design 7", placeholder: createPlaceholder('#2C2C2C') },
    // White color
    { id: 'white1', src: optimizeImage("https://i.ibb.co/Z6d8d5yn/1.jpg"), alt: "Miroir de maquillage couleur blanc - Design 1", color: 'white', title: "Blanc Pur - Design 1", placeholder: createPlaceholder('#FFFFFF') },
    { id: 'white2', src: optimizeImage("https://i.ibb.co/WNdHL5x6/2.jpg"), alt: "Miroir de maquillage couleur blanc - Design 2", color: 'white', title: "Blanc Pur - Design 2", placeholder: createPlaceholder('#FFFFFF') },
    { id: 'white3', src: optimizeImage("https://i.ibb.co/Z1Rjy8G8/3.jpg"), alt: "Miroir de maquillage couleur blanc - Design 3", color: 'white', title: "Blanc Pur - Design 3", placeholder: createPlaceholder('#FFFFFF') },
    { id: 'white4', src: optimizeImage("https://i.ibb.co/sdx7P55z/4.jpg"), alt: "Miroir de maquillage couleur blanc - Design 4", color: 'white', title: "Blanc Pur - Design 4", placeholder: createPlaceholder('#FFFFFF') },
    { id: 'white5', src: optimizeImage("https://i.ibb.co/GfZKdDVb/5.jpg"), alt: "Miroir de maquillage couleur blanc - Design 5", color: 'white', title: "Blanc Pur - Design 5", placeholder: createPlaceholder('#FFFFFF') },
    { id: 'white6', src: optimizeImage("https://i.ibb.co/nNN35gNG/6.jpg"), alt: "Miroir de maquillage couleur blanc - Design 6", color: 'white', title: "Blanc Pur - Design 6", placeholder: createPlaceholder('#FFFFFF') },
    { id: 'white7', src: optimizeImage("https://i.ibb.co/MDT8b86h/7.jpg"), alt: "Miroir de maquillage couleur blanc - Design 7", color: 'white', title: "Blanc Pur - Design 7", placeholder: createPlaceholder('#FFFFFF') },
  ], []);

  const filteredImages = useMemo(() => {
    if (!selectedColorId) return allImages;
    return allImages.filter(img => img.color === selectedColorId);
  }, [selectedColorId, allImages]);

  const handleColorSelect = (colorId) => {
    setSelectedColorId(prevColorId => (prevColorId === colorId ? null : colorId));
    setLightboxImageIndex(null); 
  };
  
  const clearColorSelection = () => {
    setSelectedColorId(null);
    setLightboxImageIndex(null);
  };

  const openLightbox = (index) => setLightboxImageIndex(index);
  const closeLightbox = () => setLightboxImageIndex(null);

  const nextImage = useMemo(() => () => {
    if (lightboxImageIndex !== null) {
      setLightboxImageIndex((prevIndex) => (prevIndex + 1) % filteredImages.length);
    }
  }, [lightboxImageIndex, filteredImages.length]);

  const prevImage = useMemo(() => () => {
    if (lightboxImageIndex !== null) {
      setLightboxImageIndex((prevIndex) => (prevIndex === 0 ? filteredImages.length - 1 : prevIndex - 1));
    }
  }, [lightboxImageIndex, filteredImages.length]);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (lightboxImageIndex === null) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') nextImage(); 
      if (event.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImageIndex, nextImage, prevImage, closeLightbox]);

  // Preload visible images
  useEffect(() => {
    const preloadImages = filteredImages.slice(0, 3).forEach(img => {
      if (!loadedImages[img.id]) {
        const image = new Image();
        image.src = img.src;
        image.onload = () => {
          setLoadedImages(prev => ({ ...prev, [img.id]: true }));
        };
      }
    });
  }, [filteredImages, loadedImages]);

  const selectedColorDetails = AVAILABLE_COLORS.find(c => c.id === selectedColorId);

  const scrollToOrder = () => {
    const element = document.getElementById('order');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="gallery" className="py-16 lg:py-20 bg-gradient-to-b from-[#F8F6F2] via-[#FAF8F4] to-[#F5F2EC] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center mb-4 glass-effect px-6 py-3 rounded-full border border-wood-light/30">
            <Palette className="w-6 h-6 text-wood mr-3" />
            <span className="font-inter font-semibold text-charcoal">Galerie Exclusive</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-charcoal mb-4 tracking-tight">
            Découvrez Nos Créations
          </h2>
          <p className="text-lg lg:text-xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explorez la collection de miroirs de maquillage artisanaux. Chaque pièce est une œuvre d'art unique, 
            alliant tradition artisanale et design contemporain.
          </p>

          {/* Color Selection */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {AVAILABLE_COLORS.map(color => (
              <button
                key={color.id}
                onClick={() => handleColorSelect(color.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl glass-effect
                            ${selectedColorId === color.id 
                                ? `${color.ringClass} ring-offset-2 ring-2 scale-110 ${color.textClass} font-bold border-wood` 
                                : `border-wood-light/30 hover:border-wood text-charcoal hover:bg-white/80`
                            }`}
              >
                <span className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-inset ring-wood-light/50 shadow-inner flex items-center justify-center">
                  <img 
                    src={color.textureSrc} 
                    alt={`Texture ${color.name}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </span>
                <span className="font-inter font-semibold text-sm sm:text-base">{color.name}</span>
                {selectedColorId === color.id && <CheckCircle className="w-5 h-5 text-green-600" />}
              </button>
            ))}
          </div>
          
          {selectedColorId && (
              <button 
                onClick={clearColorSelection}
                className="mt-4 text-sm text-wood hover:text-wood-dark font-medium transition-colors duration-200 flex items-center justify-center mx-auto bg-wood-light/20 hover:bg-wood-light/30 px-4 py-2 rounded-lg shadow-sm border border-wood-light/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Voir toutes les couleurs
              </button>
          )}
        </div>

        {/* Gallery Title */}
        <div className="text-center mb-10 lg:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-charcoal tracking-tight">
                {selectedColorDetails ? `Collection ${selectedColorDetails.name}` : "Tous Nos Modèles Exclusifs"}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-wood to-gold rounded-full mx-auto mt-4"></div>
        </div>

        {/* Swiper Gallery */}
        {filteredImages.length > 0 ? (
          <div className="relative">
            <Swiper
                modules={[Navigation, Pagination, A11y, EffectCoverflow, Autoplay]}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'} 
                loop={filteredImages.length > 3} 
                autoplay={{ delay: 4000, disableOnInteraction: true }}
                coverflowEffect={{
                    rotate: 25,
                    stretch: -20, 
                    depth: 120,
                    modifier: 1,
                    slideShadows: true, 
                }}
                pagination={{ clickable: true, dynamicBullets: true, el: '.custom-swiper-pagination' }}
                navigation={{
                    nextEl: '.custom-swiper-button-next',
                    prevEl: '.custom-swiper-button-prev',
                }}
                className="pb-12" 
                breakpoints={{
                    320: { 
                        coverflowEffect: { stretch: -15, depth: 80, rotate: 15 },
                    },
                    640: { 
                        coverflowEffect: { stretch: -18, depth: 100, rotate: 20 },
                    },
                    1024: { 
                        coverflowEffect: { stretch: -25, depth: 120, rotate: 25 },
                    },
                }}
            >
                {filteredImages.map((image, index) => (
                <SwiperSlide 
                    key={image.id} 
                    className="!w-[70vw] max-w-[280px] sm:!w-[60vw] sm:max-w-[320px] md:!w-[50vw] md:max-w-[360px] lg:!w-[40vw] lg:max-w-[400px] group"
                >
                    <div
                        className="relative w-full aspect-square rounded-3xl shadow-2xl overflow-hidden cursor-pointer bg-wood-light transform transition-all duration-500 hover:shadow-wood/40 hover:scale-[1.02] border-4 border-white/90"
                        onClick={() => openLightbox(index)}
                    >
                        <img
                            src={loadedImages[image.id] ? image.src : image.placeholder}
                            data-src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            loading="lazy"
                            onLoad={(e) => {
                              if (e.target.dataset.src && !loadedImages[image.id]) {
                                setLoadedImages(prev => ({ ...prev, [image.id]: true }));
                              }
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent flex flex-col justify-end p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <h4 className="text-white text-lg sm:text-xl font-inter font-bold mb-2 group-hover:animate-fade-in-up">{image.title}</h4>
                            <div className="flex items-center text-gold text-sm group-hover:animate-fade-in-up animation-delay-100">
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                <span>Cliquer pour agrandir</span>
                            </div>
                        </div>
                        
                        {/* Badge de couleur */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <span className="font-inter text-xs font-semibold text-charcoal">
                                {AVAILABLE_COLORS.find(c => c.id === image.color)?.name}
                            </span>
                        </div>
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
            
            {filteredImages.length > 1 && ( 
                <>
                    <button aria-label="Image précédente" className="custom-swiper-button-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 glass-effect rounded-full text-wood hover:bg-wood-light/20 hover:text-wood-dark transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-wood">
                        <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
                    </button>
                    <button aria-label="Image suivante" className="custom-swiper-button-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 glass-effect rounded-full text-wood hover:bg-wood-light/20 hover:text-wood-dark transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-wood">
                        <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
                    </button>
                </>
            )}
            <div className="custom-swiper-pagination text-center pt-10"></div> 
          </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-xl sm:text-2xl text-charcoal/70 font-inter">
                    Aucune image disponible pour cette couleur pour le moment.<br/> 
                    Veuillez choisir une autre couleur ou consulter toute notre collection.
                </p>
            </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 lg:mt-16">
          <button
            onClick={scrollToOrder}
            className="inline-flex items-center justify-center px-10 py-4 wood-gradient text-white text-lg font-inter font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-wood focus:ring-offset-2 border-2 border-gold/30 animate-professional-glow"
          >
            <ArrowLeft className="w-5 h-5 mr-3" /> 
            Je veux commander ce produit
          </button>
        </div>

        {/* Lightbox */}
        {lightboxImageIndex !== null && filteredImages[lightboxImageIndex] && (
          <div className="fixed inset-0 bg-charcoal/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="relative w-full max-w-4xl lg:max-w-5xl h-auto max-h-[90vh] bg-charcoal/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-wood-light/20"> 
              {/* Header Lightbox */}
              <div className="flex-shrink-0 p-4 flex justify-between items-center bg-charcoal/90 border-b border-wood-light/20">
                <button
                    onClick={closeLightbox}
                    className="bg-wood-light/20 text-white hover:bg-wood-light/30 p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Fermer"
                > 
                  <X size={24}/> 
                </button>
                <div className="text-center flex-1">
                  <h3 className="text-white font-inter font-semibold text-lg">
                    {filteredImages[lightboxImageIndex].title}
                  </h3>
                </div>
                <div className="w-10"></div> {/* Spacer for balance */}
              </div>
              
              {/* Image Container */}
              <div className="flex-grow flex items-center justify-center overflow-hidden p-6">
                <img
                    src={filteredImages[lightboxImageIndex].src} 
                    alt={filteredImages[lightboxImageIndex].alt}
                    className="max-w-full max-h-full object-contain block rounded-xl shadow-2xl" 
                    loading="eager"
                />
              </div>
              
              {/* Navigation */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 glass-effect text-wood hover:bg-wood-light/20 p-4 rounded-full transition-all duration-300 hover:scale-110 z-10" 
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={28} /> 
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 glass-effect text-wood hover:bg-wood-light/20 p-4 rounded-full transition-all duration-300 hover:scale-110 z-10" 
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={28} /> 
                  </button>
                </>
              )}

              {/* Footer Lightbox */}
              <div className="flex-shrink-0 bg-charcoal/90 text-white px-6 py-4 text-center border-t border-wood-light/20">
                <p className="text-sm font-inter opacity-90">
                  {lightboxImageIndex + 1} sur {filteredImages.length} • {AVAILABLE_COLORS.find(c => c.id === filteredImages[lightboxImageIndex].color)?.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;