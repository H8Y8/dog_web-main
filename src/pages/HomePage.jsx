import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import ScrollText from '../components/ScrollText';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div data-aos="fade-up">
        <About />
      </div>
      <div data-aos="fade-up">
        <ScrollText />
      </div>
      <div data-aos="fade-up">
        <Contact />
      </div>
    </div>
  );
};

export default HomePage; 