import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Welcome: React.FC = () => {
  return (
    <div className='w-full h-[100dvh] bg-neutral-950 fixed top-0 left-0 z-10 flex justify-center items-center flex-col'>
      <div className='w-full grid place-items-center'>
        <Image 
          src="/images/logoXplorersCompleto.png"
          width={270}
          height={270}
          alt='Logo Xplorers'
          className='mb-8'
        />
        <div className='space-y-4'>
          <Link href='/Auth/login' className='block text-center border border-yellow-600 bg-gradient-to-br from-yellow-600/20 to-transparent text-white w-64 py-2 rounded-md transition duration-300 ease-in-out transform  hover:from-yellow-600/60'>
              Iniciar Sesión
          </Link>
          <Link href='/Auth/register' className='block text-center border border-white/70  text-white w-64 py-2 rounded-md transition duration-300 ease-in-out transform  hover:bg-gradient-to-br from-white/30 to-transparent'>
              Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
