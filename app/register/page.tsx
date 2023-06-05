"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineUser, HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import GoogleLogo from '../../public/assets/google.svg';
import FemaleAvatar from '../../public/assets/FemaleAvatar.svg';
import ComputerRegister from '../../public/assets/computer_register.svg';
import styles from './page.module.css';

const Register = () => {
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const response = await fetch('/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: registerFirstName,
          lastName: registerLastName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // redirect user to login page, or wherever you want
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className={`${styles.bgColor} h-screen py-5`}>
      <div className="container mx-auto w-full">
        <div className="flex flex-col lg:flex-row w-full  bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
          <div className="w-full py-16 px-12 bg-gray-50">
            <div className="flex justify-center">
              <Image src={FemaleAvatar} alt="female avatar" className="bg-gray-300 rounded-full" width={100} height={100} />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-8 flex justify-center">
              <div className={`${styles.input_group}`}>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  required
                  className={`${styles.input_text}`}
                  value={registerFirstName}
                  onChange={(e) => setRegisterFirstName(e.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiOutlineUser size={25} />
                </span>
              </div>

              <div className={`${styles.input_group}`}>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  required
                  className={`${styles.input_text}`}
                  value={registerLastName}
                  onChange={(e) => setRegisterLastName(e.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiOutlineUser size={25} />
                </span>
              </div>

              <div className={`${styles.input_group}`}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className={`${styles.input_text}`}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
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
                  required
                  className={styles.input_text}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiFingerPrint size={25} />
                </span>
              </div>

              <div className="input-button">
                <button type="submit" className={`${styles.button} bg-blue-600`}>
                  Sign up
                </button>
              </div>

              <div className="input-button">
                <button className={styles.button_custom} type="button">
                  Connect with Google <Image src={GoogleLogo} alt="google logo image" width={25} height={25} />
                </button>
              </div>
            </form>

            {/* bottom  */}
            <Link href="/">
              <p className="text-lg flex justify-center">
                Already a user?
                <span className="text-sky-700 font-semibold px-1 text-lg">Log in</span>
              </p>
            </Link>
          </div>
          <div className={`hidden lg:block w-full flex flex-col bg-blue-600 px-12 py-20 bg-no-repeat bg-cover bg-center`}>
            <h1 className="text-white text-3xl font-bold">New here?</h1>
            <div>
              <p className="text-gray-100 text-lg pt-5 pb-10 ml-3 font-semibold">
                Fill in your information and begin your journey with us
              </p>
              <div className="flex justify-center">
                <Image src={ComputerRegister} alt="login page image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;