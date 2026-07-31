import LandingNavbar from "../components/navbar/LandingNavbar";
import Hero from "../components/hero/Hero";
import Features from "../components/features/Features";
import About from "../components/about/About";
import Footer from "../components/footer/Footer";

function Landing() {
  return (
    <>
      <LandingNavbar />

      <main>
        <section id="hero">
          <Hero />
        </section>

        <section id="features" className="page-container">
          <Features />
        </section>

        <section id="about" className="page-container">
          <About />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Landing;