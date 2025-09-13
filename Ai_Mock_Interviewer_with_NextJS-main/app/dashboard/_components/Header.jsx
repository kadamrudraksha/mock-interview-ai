"use client"

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for client-side navigation
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // Using icons for the menu button

export const Header = () => {
    const path = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close the mobile menu when the path changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [path]);

    // Define navigation links in an array for easier management
    const navLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'How it works?', href: '/dashboard/how' },
        { name: 'Contact', href: '/dashboard/contact' },
    ];

    return (
        <header className='relative bg-secondary shadow-sm'>
            <div className='flex p-4 items-center justify-between'>
                {/* Logo */}
                <Link href="/dashboard">
                    <Image src={'/logo.svg'} alt='logo' width={160} height={100} priority />
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden md:flex items-center gap-8'>
                    <ul className='flex gap-8'>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`
                                        hover:text-primary hover:font-bold transition-all
                                        ${path === link.href ? 'text-primary font-bold' : ''}
                                    `}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    {/* User Button (visible on all screen sizes) */}
                    <UserButton afterSignOutUrl="/" />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='md:hidden p-2 rounded-md hover:bg-gray-200 transition-colors'
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <nav className='md:hidden absolute top-full left-0 w-full bg-secondary shadow-md z-50'>
                    <ul className='flex flex-col items-center p-4'>
                        {navLinks.map((link) => (
                            <li key={link.href} className='w-full text-center'>
                                <Link
                                    href={link.href}
                                    className={`
                                        block py-3 hover:text-primary hover:font-bold transition-all w-full
                                        ${path === link.href ? 'text-primary font-bold bg-gray-100 rounded' : ''}
                                    `}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
};