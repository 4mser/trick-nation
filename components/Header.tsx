'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { bottombarLinks } from '@/constants';

const Header: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null; // No renderizar el Header si no está autenticado
  }

  // Dividimos los enlaces en dos partes
  const firstHalfLinks = bottombarLinks.slice(0, 2);
  const secondHalfLinks = bottombarLinks.slice(2);

  return (
    <section className="fixed bottom-0 z-10 w-full bg-neutral-950 border-t border-white/10 ">
      <div className="flex items-center justify-around gap-3">
        {/* Primeros dos enlaces */}
        {firstHalfLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex flex-col items-center gap-[2px]  p-3 py-2 w-16 ${isActive ? "opacity-100" : "opacity-70"}`}
            >
              <div className={`h-1 absolute top-0 bg-gradient-to-tr rounded-full from-amber-500 to-amber-800 shadow-custom-2 transition-all duration-300 ease-in-out ${pathname !== link.route ? 'w-0 ' : 'w-full'}`} />
              <img
                src={link.imgURL}
                alt={link.label}
                width={22}
                height={22}
                className="object-contain"
              />
              <p className="text-[11px] text-light-1/90">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
        {/* Enlace del perfil en el centro */}
        <Link href="/profile">
          <div className=" relative bg-neutral-950 border-t border-white/10  -translate-y-6 rounded-full p-2 ">
            <div className={`transition-all duration-300 ease-in-out ${pathname === '/profile' ? 'p-1 bg-gradient-to-tr from-amber-500 to-amber-800 rounded-full' : ''}`}>
              <img
                src={user.profilePictureUrl ? `${user.profilePictureUrl}` : '/profile.jpeg'}
                alt="Profile Picture"
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
          </div>
        </Link>
        {/* Segundos dos enlaces */}
        {secondHalfLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex flex-col items-center gap-[2px]  p-3 py-2 w-16 ${isActive ? "opacity-100" : "opacity-70"}`}
            >
              <div className={`h-1 absolute top-0 bg-gradient-to-tr rounded-full from-amber-500 to-amber-800 shadow-custom-2 transition-all duration-300 ease-in-out ${pathname !== link.route ? 'w-0 ' : 'w-full'}`} />
              <img
                src={link.imgURL}
                alt={link.label}
                width={22}
                height={22}
                className="object-contain"
              />
              <p className="text-[11px] text-light-1/90">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Header;
