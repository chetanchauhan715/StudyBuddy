import LandingNavbar from "../components/navbar/LandingNavbar";
import Hero from "../components/hero/Hero";
import Features from "../components/features/Features";
import Footer from "../components/footer/footer";
import About from "../components/about/About";
function Landing(){
   
   return (
   <>
  <LandingNavbar />

  <section id="hero">
    <Hero />
  </section>

  <section id="features">
    <Features />
  </section>

  <section id="about">
    <About/>
  </section>

  <section id="contact">
    <Footer />
  </section>
</>
   )
}

export default Landing;