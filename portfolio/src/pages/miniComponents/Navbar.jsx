import React, { useState, useEffect } from 'react';
import { Logo, Navcross, Navline } from "../common/Icon";
import { navLinks } from '../common/Helper';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add("max-lg:overflow-hidden");
        } else {
            document.body.classList.remove("max-lg:overflow-hidden");
        }

        return () => {
            document.body.classList.remove("max-lg:overflow-hidden");
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg'
                : 'bg-transparent'
            }`}>
            <div className="container mx-auto">
                <div className="flex justify-between items-center py-4 max-lg:px-4 max-lg:py-3">
                    {/* Logo */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
                        <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                            <Logo className="w-full h-8 text-gradient-primary cursor-pointer" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex xl:gap-[40px] gap-[12px] 2xl:gap-[40px] items-center">
                        {/* Desktop Navigation */}
                        <ul className={`${isMenuOpen ? "max-lg:translate-x-0" : "max-lg:translate-x-full"
                            } flex items-center xl:gap-[40px] gap-[20px] 2xl:gap-[40px] max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:left-0 max-lg:w-full max-lg:h-screen max-lg:bg-background/95 max-lg:backdrop-blur-xl max-lg:flex max-lg:items-center max-lg:justify-center max-lg:flex-col max-lg:z-40 max-lg:transition-transform max-lg:duration-300 max-lg:ease-out`}>

                            {/* Mobile menu background decoration */}
                            <div className="hidden max-lg:block absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-full opacity-10 blur-3xl"></div>
                                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-gradient-accent to-gradient-pink rounded-full opacity-10 blur-3xl"></div>
                            </div>

                            {navLinks.map((link, index) => (
                                <li
                                    key={index}
                                    className="relative group max-lg:transform max-lg:translate-y-8 max-lg:opacity-0 max-lg:animate-fade-in"
                                    style={{
                                        animationDelay: isMenuOpen ? `${index * 0.1}s` : '0s',
                                        animationFillMode: 'forwards'
                                    }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <a
                                        href={link.href}
                                        className="relative font-medium text-base lg:text-sm xl:text-base transition-all duration-300 ease-out hover:text-gradient-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gradient-primary focus-visible:ring-offset-2 rounded-sm px-3 py-2 max-lg:text-xl max-lg:py-3"
                                    >
                                        <span className="relative z-10">{link.name}</span>

                                        {/* Hover background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"></div>

                                        {/* Bottom border effect */}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-gradient-primary to-gradient-secondary group-hover:w-full transition-all duration-300"></div>

                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>
                                    </a>
                                </li>
                            ))}

                            {/* Mobile theme toggle */}
                            <li className="lg:hidden max-lg:transform max-lg:translate-y-8 max-lg:opacity-0 max-lg:animate-fade-in max-lg:mt-8"
                                style={{
                                    animationDelay: isMenuOpen ? `${navLinks.length * 0.1}s` : '0s',
                                    animationFillMode: 'forwards'
                                }}>
                                <ModeToggle />
                            </li>
                        </ul>

                        {/* Desktop theme toggle */}
                        <div className="hidden lg:block">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>
                                <ModeToggle />
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                            className="relative z-50 lg:hidden cursor-pointer group p-2 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-gradient-primary/10 hover:to-gradient-secondary/10 hover:border-gradient-primary/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gradient-primary"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {/* Button glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>

                            <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                                {isMenuOpen ? <Navcross /> : <Navline />}
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Navigation backdrop blur overlay for mobile */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-fade-in"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default Navbar;