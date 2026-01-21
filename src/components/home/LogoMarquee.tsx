import logoMadville from '@/assets/logos/logo-madville.png';
import logoSolucoes from '@/assets/logos/logo-solucoes.png';
import logoCuritiba from '@/assets/logos/logo-curitiba.png';

const logos = [
  { src: logoMadville, alt: 'GMAD Madville' },
  { src: logoSolucoes, alt: 'GMAD Soluções' },
  { src: logoCuritiba, alt: 'GMAD Curitiba' },
];

export const LogoMarquee = () => {
  // Duplicar logos para criar efeito de loop contínuo
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-8">
      <div className="flex animate-marquee">
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-12 flex items-center justify-center"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-16 md:h-24 w-auto object-contain opacity-15 grayscale hover:opacity-30 hover:grayscale-0 transition-all duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
