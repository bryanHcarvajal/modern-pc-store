import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause } from 'react-icons/fa';
import { SiAmd } from 'react-icons/si';

import HeroBackgroundVideo from '../assets/videos/hero-background.mp4';
import ryzenLogo from '../assets/images/amd-ryzen-logo.png';
import radeonLogo from '../assets/images/amd-radeon-logo.png';
import AnimatedPercentageCircle from '../components/AnimatedPercentageCircle';

interface ProductFeatureData {
  id: string;
  name: string;
  description: string;
  logo: string;
  alt: string;
  linkText: string;
  linkTo: string; 
  hoverText: string;
}

const ProductFeatureCard: React.FC<{ feature: ProductFeatureData, index: number }> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    inView: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.7, ease: "easeOut", delay: index * 0.15 } 
    }
  };

  const imageVariants = {
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hidden: { opacity: 0, scale: 0.85, transition: { duration: 0.3 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.85, transition: { duration: 0.3, delay: 0.1 } },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } }
  };

  const isRyzen = feature.id === 'ryzen';
  const textAnimationProps = {
    animateText: true,
    textInitialValue: isRyzen ? 0 : 60,
    textFinalValue: isRyzen ? 100 : 240,
    textSuffix: isRyzen ? "%" : " FPS",
    textSize: isRyzen ? "text-4xl" : "text-3xl",
  };

  return (
    <motion.div
      key={feature.id}
      className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}
      variants={cardVariants}
      initial="initial"
      whileInView="inView"
      viewport={{ once: false, amount: 0.25 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative w-full md:w-2/5 flex justify-center items-center h-52 sm:h-64 md:h-72">
        <motion.div
          variants={imageVariants}
          animate={isHovered ? "hidden" : "visible"}
          className="w-auto"
        >
          <img 
            src={feature.logo} 
            alt={feature.alt} 
            className="max-h-40 sm:max-h-52 md:max-h-64 object-contain"
          />
        </motion.div>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
            >
              <AnimatedPercentageCircle
                percentage={100}
                size={170}
                strokeWidth={8}
                duration={1.2}
                {...textAnimationProps}
              />
              <p className="mt-3 text-xs font-medium text-[var(--color-text-secondary)] max-w-[180px]">
                {feature.hoverText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={`w-full md:w-3/5 text-center ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {feature.name}
        </h3>
        <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed mb-8">
          {feature.description}
        </p>
        <Link  
          to={feature.linkTo} 
          className="inline-block px-8 py-3 bg-[var(--color-amd-red)] text-[var(--color-text-primary)] text-base font-semibold rounded-[var(--border-radius-default)] shadow-lg hover:bg-[var(--color-amd-red-darkest)] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-amd-red)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
        >
          {feature.linkText}
        </Link>
      </div>
    </motion.div>
  );
};

const AmdProductsSection = () => {
  const productFeaturesData: ProductFeatureData[] = [
    {
      id: "ryzen",
      name: "Procesadores AMD Ryzen™",
      description: "Desata un rendimiento de élite para gaming, creación y multitarea intensiva con la potencia inigualable de los procesadores Ryzen™.",
      logo: ryzenLogo,
      alt: "Logo AMD Ryzen",
      linkText: "Descubrir Ryzen",
      linkTo: "/products?type=CPU", 
      hoverText: "Aumenta tu productividad con hasta 24 hilos de procesamiento."
    },
    {
      id: "radeon",
      name: "Tarjetas Gráficas AMD Radeon™",
      description: "Experimenta gráficos impresionantes y una jugabilidad fluida con las tarjetas Radeon™, diseñadas para la nueva generación de juegos.",
      logo: radeonLogo,
      alt: "Logo AMD Radeon Graphics",
      linkText: "Explorar Radeon",
      linkTo: "/products?type=GPU", 
      hoverText: "Experimenta un aumento de hasta el 100% en tus FPS en juegos seleccionados."
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[var(--color-amd-red)]">Potencia</span> para Cada Necesidad
        </motion.h2>
        <div className="space-y-20 md:space-y-28">
          {productFeaturesData.map((feature, index) => (
            <ProductFeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const navigate = useNavigate(); 

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  return (
    <>
      <section className="relative h-[100vh] flex items-center justify-start overflow-hidden w-full">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-0 filter blur-sm"
          src={HeroBackgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            className="max-w-lg md:max-w-xl text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <SiAmd className="text-[var(--color-amd-red)] h-12 w-12 md:h-16 md:w-16 mb-5" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-text-primary)] leading-tight">
              La <span className="text-[var(--color-amd-red)]">Nueva Era</span> del PC Gaming
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-md">
              Explora componentes AMD de última generación. Rendimiento sin compromisos para tu PC ideal.
            </p>
            <motion.button
              className="mt-10 px-8 py-3 bg-[var(--color-amd-red)] text-[var(--color-text-primary)] text-lg font-semibold rounded-[var(--border-radius-default)] shadow-md hover:bg-[var(--color-amd-red-darkest)] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-amd-red)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')} 
            >
              Explorar Productos
            </motion.button>
          </motion.div>
        </div>
        <button
          onClick={togglePlayPause}
          className="absolute bottom-6 right-6 z-20 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors"
          aria-label={isVideoPlaying ? "Pausar video" : "Reproducir video"}
        >
          {isVideoPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>
      </section>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-amd-red)] to-transparent"></div>
      <AmdProductsSection />
    </>
  );
};

export default HomePage;