'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HeaderLayout: React.FC = () => {
  const pathname = usePathname();

  return (
    <header>
      <nav>
        <ul className="w-full flex justify-between px-5 py-3">
          {pathname === '/Auth/login' ? (
            <li><Link href="/Auth/register">Register</Link></li>
          ) : (
            <li><Link href="/Auth/login">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default HeaderLayout;
