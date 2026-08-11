import LandingNavbar from "../components/navbar/LandingNavbar";
import Hero from "../components/hero/Hero";
import Features from "../components/features/Features";
import About from "../components/about/About";
import Footer from "../components/footer/Footer";
// import LandingNavbar from "../components/navbar/LandingNavbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Landing() {

const navigate = useNavigate();

  useEffect( ()=>{
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if(token && user){
      if(user.role === "admin"){
        navigate("/admin/dashboard", {replace:true});
      }else {
        navigate("/dashboard", {replace:true});
      }
    }
  }, [navigate])
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