import HeroSection from '../components/home/HeroSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CitizenGuidesSection from '../components/home/CitizenGuidesSection';
import EmergencyHelplinesSection from '../components/home/EmergencyHelplinesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import HomeFaqSection from '../components/home/HomeFaqSection';
import CtaSection from '../components/home/CtaSection';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CitizenGuidesSection />
      <EmergencyHelplinesSection />
      <TestimonialsSection />
      <HomeFaqSection />
      <CtaSection />
    </div>
  );
};

export default Home;
