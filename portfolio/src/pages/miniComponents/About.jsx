import React, { useEffect, useState } from "react";
import { User, Heart, Code, Coffee, BookOpen, Target } from "lucide-react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const interests = [
    { icon: Code, label: "Technology", color: "from-blue-500 to-cyan-500" },
    { icon: BookOpen, label: "Literature", color: "from-purple-500 to-pink-500" },
    { icon: Coffee, label: "Cooking", color: "from-orange-500 to-red-500" },
    { icon: Target, label: "Gaming", color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div id="about-section" className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-r from-gradient-accent to-gradient-pink rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <User className="w-8 h-8 text-gradient-primary" />
            <span className="text-lg font-medium text-muted-foreground uppercase tracking-wider">
              Get to know me
            </span>
          </div>
          <h2 className="heading-secondary mb-6">
            <span className="text-gradient">About Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Allow me to introduce myself and share my journey in technology and beyond.
          </p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Image section */}
          <div className={`flex justify-center ${isVisible ? 'animate-slide-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              {/* Image container */}
              <div className="relative modern-card p-8 hover-lift">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="/me.jpg"
                    alt="Shivdayal Singh"
                    className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 modern-card p-3 animate-float">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className={`space-y-8 ${isVisible ? 'animate-slide-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gradient">Shivdayal Singh</h3>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  My name is <span className="text-gradient font-semibold">Shivdayal Singh</span>. 
                  My interests span across technology, literature, and culinary arts. I am certified 
                  in <span className="text-gradient font-semibold">Frontend Development</span> from 
                  Radial Code, Hisar, and in <span className="text-gradient font-semibold">Python Backend</span> 
                  from TCA, Gurgaon.
                </p>
                
                <p>
                  Known for my <span className="text-gradient font-semibold">patience and tenacity</span>, 
                  I bring a focused and aggressive approach to meeting project deadlines and ensuring 
                  high-quality deliverables.
                </p>
                
                <p>
                  I have interests not only in technology but also in reading books, watching movies, 
                  video games, and cooking. I excel in meeting deadlines for my work.
                </p>
              </div>
            </div>

            {/* Interests grid */}
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest, index) => (
                <div 
                  key={interest.label}
                  className="modern-card p-4 group hover-lift"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${interest.color} p-2 mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <interest.icon className="w-full h-full text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground">{interest.label}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="modern-card p-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gradient mb-6">My Philosophy</h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                My <span className="text-gradient font-semibold">dedication and perseverance</span> in 
                timely delivery of work are integral to me. I maintain the courage to face any challenges 
                for extended periods, always striving to deliver exceptional results that exceed expectations.
              </p>
              
              {/* Stats or highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">100%</div>
                  <div className="text-muted-foreground">Commitment</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">24/7</div>
                  <div className="text-muted-foreground">Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">∞</div>
                  <div className="text-muted-foreground">Learning</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-16">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary opacity-60"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animation: 'pulse 2s infinite'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
