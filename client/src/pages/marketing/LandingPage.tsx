import { Faqs } from "./_components/Faqs";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Pricing } from "./_components/Pricing";
import { PrimaryFeatures } from "./_components/PrimaryFeatures";
import { Testimonials } from "./_components/Testimonials";

const LandingPage = () => {
  return (
    <div className="flex h-full flex-col scroll-smooth bg-white antialiased">
      <Header />

      <main>
        <Hero />
        <PrimaryFeatures />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
