"use client"
import GoogleLogo from '../../public/assets/google.svg';
import MaleAvatar from '../../public/assets/MaleAvatar.svg';
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import LoginImage from '../../public/assets/phone_login.svg';
import Image from 'next/image';
import styles from './page.module.css';
import { Dosis } from 'next/font/google';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import router, { useRouter } from 'next/router';
import { NextApiRequest, NextApiResponse } from 'next';


const dosis = Dosis({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});



const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/login-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Login successful');
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.position);
        localStorage.setItem('team', data.team);

        console.log('User Role:', data.position);
        console.log('User Team:', data.team);
        console.log('User email:', data.email);

        location.href='/dashboard';
      } else {
        alert('Incorect email or password');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  return (
    <div className={`${styles.bgColor} h-screen py-40 `}>
      <div className="container mx-auto w-full">
        <div className="flex flex-col lg:flex-row w-5/6 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
          <div className={`hidden lg:block w-full lg:w-1/2 flex flex-col bg-blue-600 p-12 bg-no-repeat bg-cover bg-center`}>
            <h1 className="text-white text-3xl font-bold">Welcome Back</h1>
            <div>
              <p className="text-gray-100 text-lg py-5 ml-3 font-semibold">To keep connected with us please login with your personal information</p>
              <Image src={LoginImage} alt="login page image w-auto h-auto" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 py-16 px-12 bg-gray-50">
            <div className="flex justify-center">
              <Image src={MaleAvatar} alt="male avatar" className="bg-gray-300 rounded-full" width={100} height={100} />
            </div>
            <form className="flex flex-col gap-4 py-8 flex justify-center" onSubmit={submitHandler}>
              <div className={`${styles.input_group}`}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`${styles.input_text}`}
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiAtSymbol size={25} />
                </span>
              </div>

              <div className={`${styles.input_group}`}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={styles.input_text}
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiFingerPrint size={25} />
                </span>
              </div>

                <div className="input-button">
                  <button type="submit" className={`${styles.button} bg-blue-600`}>
                    Login
                  </button>
                </div>

              <div className="input-button">
                <button className={styles.button_custom} type="button">
                  Sign In with Google <Image src={GoogleLogo} alt="google logo image" width={25} height={25} />
                </button>
              </div>
            </form>
            <Link href={'/register/'}>
          <p className="text-sm xl:text-lg flex justify-center">
            Don't have an account yet? <span className="text-sky-700 font-semibold px-1 xl:text-lg">Sign up</span>
          </p>
        </Link>
      </div>
    </div>
  </div>
</div>
  );
};

export default Login;