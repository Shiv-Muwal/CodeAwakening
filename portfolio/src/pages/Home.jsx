import React from "react";
import Hero from "./miniComponents/Hero";
import Timeline from "./miniComponents/Timeline";
import Skills from "./miniComponents/Skills";
import About from "./miniComponents/About";
import Portfolio from "./miniComponents/Portfolio";
import Contact from "./miniComponents/Contact";
import Navbar from "./miniComponents/Navbar";

const Home = () => {
  return (
    <article className="min-h-screen font-inter overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Timeline />
      <Skills />
      <Portfolio />
      <Contact />
    </article>
  );
};

export default Home;
