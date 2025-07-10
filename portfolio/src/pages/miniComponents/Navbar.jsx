import React, { useState, useEffect } from 'react';
import { Logo, Navcross, Navline } from "../common/Icon";
import { navLinks } from '../common/Helper';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto">
                <div className="flex justify-between items-center py-4 px-6 max-lg:px-4 max-lg:py-2">
                    <div className="">
                        <Logo className=' w-full'/>
                    </div>
                    <nav className="flex xl:gap-[40px] gap-[12px] 2xl:gap-[40px] items-center">
                        <ul
                            className={`${isMenuOpen ? "max-lg:translate-x-0" : "max-lg:translate-x-full"
                                } flex items-center xl:gap-[40px] gap-[20px] 2xl:gap-[40px] max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:left-0 max-lg:w-full max-lg:h-screen max-lg:bg-background max-lg:flex max-lg:items-center max-lg:justify-center max-lg:flex-col max-lg:z-10 max-lg:transition-transform max-lg:duration-300 max-lg:ease-linear`}
                        >
                            {navLinks.map((link, index) => (
                                <li
                                    key={index}
                                    className="relative group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <a
                                        href={link.href}
                                        className="font-normal text-base transition-all duration-300 ease-linear hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <ModeToggle />
                        <button
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                            className="z-10 border lg:hidden cursor-pointer rounded-md text-foreground h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <Navcross /> : <Navline />}
                        </button>

                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;