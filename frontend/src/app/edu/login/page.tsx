"use client";

import { useState } from 'react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className='m-4'>
        <img src="../smk.png" width={60} height={60} />
      </div>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-sm text-gray-700 space-y-4">

        {/* <div className="text-black text-center bg-gray-100 p-1 gap-1 flex items-center justify-center rounded-full">
          <button 
            className={`w-full h-8 rounded-full text-gray-700 cursor-pointer ${isLogin ? 'bg-white' : 'bg-transparent'}`}
            onClick={() => setIsLogin(true)}
          >
            Masuk
          </button>
          <button
            className={`w-full h-8 rounded-full text-gray-700 cursor-pointer ${!isLogin ? 'bg-white' : 'bg-transparent'}`}
            onClick={() => setIsLogin(false)}
          >
            Daftar
          </button>
        </div> */}

        <div>
          <h2 className="font-bold text-lg">Selamat Datang</h2>
          <p className="text-xs">Masuk ke akun anda untuk melanjutkan pembelajaran</p>
        </div>

        <form className="space-y-4">
          
          <label htmlFor="email" className='font-medium text-gray-700'>Email</label>
          <input
            type="email" name="email"
            placeholder="name@example.com"
            className="w-full px-4 py-2 mt-1 rounded-md focus:outline-none bg-gray-100 ring ring-gray-100 text-gray-400 focus:ring focus:ring-orange-600 transition"
          />
        
          <label htmlFor="password" className='font-medium text-gray-700'>Password</label>
          <input
            type="password" name="password"
            placeholder="name@example.com"
            className="w-full px-4 py-2 mt-1 rounded-md focus:outline-none bg-gray-100 ring ring-gray-100 text-gray-400 focus:ring focus:ring-orange-600 transition"
          />

          {/* {!isLogin && (
            <div>
              <label htmlFor="password" className='font-medium text-gray-700'>I'm a</label>
              <select className="w-full px-3 py-2 mt-1 rounded-md focus:outline-none bg-gray-100 text-gray-400">
                <option value="siswa">Siswa</option>
                <option value="guru">Guru</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )} */}

          <div className="space-y-2 mt-2">
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 ring ring-orange-600 rounded-md hover:bg-orange-700 transition cursor-pointer"
            >
              Masuk
            </button>

            <div className="flex items-center">
              <div className='flex-grow border-t border-gray-300'></div>
                <span className='flex-shrink mx-4 text-gray-500 text-sm font-light text-xs'>atau</span>
              <div className='flex-grow border-t border-gray-300'></div>
            </div>

            <button
              type="submit"
              className="w-full py-2 ring rounded-md bg-transparent hover:bg-gray-100 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <img src="./google.svg" alt="" width={16} height={16} />
              Masuk dengan Google
            </button>
          </div>
        </form>

        
      </div>
    </div>
  );
}