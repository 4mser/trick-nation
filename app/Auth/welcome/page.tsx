import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  return (
    <div className='w-full h-[100dvh] bg-gradient-to-br from-neutral-900 via-neutral-950 to-black fixed top-0 left-0 z-10 flex justify-center items-center flex-col'>
      <div className='w-full grid place-items-center'>
        <Image 
          src="/images/logoXplorersCompleto.png"
          width={270}
          height={270}
          alt='Logo Xplorers'
          className='mb-8'
        />
        <div className='space-y-4'>
          <Link href='/Auth/login' className='block text-center border border-white  text-white w-64 py-2 rounded-md transition duration-300 ease-in-out transform hover:bg-white hover:text-neutral-950 hover:scale-105'>
              Iniciar Sesión
          </Link>
          <Link href='/Auth/register' className='block text-center bg-yellow-600 text-white w-64 py-2 rounded-md transition duration-300 ease-in-out transform  hover:scale-105'>
              Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
