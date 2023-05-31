"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineUser, HiAtSymbol, HiFingerPrint, HiCurrencyDollar, HiUserGroup, HiUserCircle } from 'react-icons/hi';
import GoogleLogo from '../../public/assets/google.svg';
import FemaleAvatar from '../../public/assets/FemaleAvatar.svg';
import ComputerRegister from '../../public/assets/computer_register.svg';
import styles from './page.module.css';

const AddUser = () => {
  const [addUserFirstName, setAddUserFirstName] = useState('');
  const [addUserLastName, setAddUserLastName] = useState('');
  const [addUserEmail, setAddUserEmail] = useState('');
  const [addUserPassword, setAddUserPassword] = useState('');
  const [addUserSalary, setAddUserSalary] = useState('');
  const [addUserPosition, setAddUserPosition] = useState('');
  const [addUserTeam, setAddUserTeam] = useState('');
  const [teamNames, setTeamNames] = useState([]);

  useEffect(() => {
    fetch('/getteams')
      .then((response) => response.json())
      .then((data) => {
        setTeamNames(data.teamNames);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const response = await fetch('/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: addUserFirstName,
          lastName: addUserLastName,
          email: addUserEmail,
          password: addUserPassword,
          sal: addUserSalary,
          pos: addUserPosition,
          team: addUserTeam || null,
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
                  value={addUserFirstName}
                  onChange={(e) => setAddUserFirstName(e.target.value)}
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
                  value={addUserLastName}
                  onChange={(e) => setAddUserLastName(e.target.value)}
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
                  value={addUserEmail}
                  onChange={(e) => setAddUserEmail(e.target.value)}
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
                  value={addUserPassword}
                  onChange={(e) => setAddUserPassword(e.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiFingerPrint size={25} />
                </span>
              </div>

              <div className={`${styles.input_group}`}>
                <input
                  type="text"
                  name="salary"
                  placeholder="Salary"
                  required
                  className={`${styles.input_text}`}
                  value={addUserSalary}
                  onChange={(e) => setAddUserSalary(e.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiCurrencyDollar size={25} />
                </span>
              </div>

              <div className={`${styles.input_group}`}>
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  required
                  className={`${styles.input_text}`}
                  value={addUserPosition}
                  onChange={(e) => setAddUserPosition(e.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiUserCircle size={25} />
                </span>
              </div>

              <div className={`${styles.input_group}`}>
                <select
                  name="team"
                  required
                  className={`${styles.input_text}`}
                  value={addUserTeam}
                  onChange={(e) => setAddUserTeam(e.target.value)}
                >
                  <option value="">Select a team</option>
                  {teamNames.map((teamName) => (
                    <option key={teamName} value={teamName}>
                      {teamName}
                    </option>
                  ))}
                </select>
                <span className="icon flex items-center px-4">
                  <HiUserGroup size={25} />
                </span>
              </div>

              <div className="input-button">
                <button type="submit" className={`${styles.button} bg-blue-600`}>
                  ADD USER
                </button>
                <Link href={'/users/'}>
                <p className="text-sm xl:text-lg flex justify-center">
                    Go to  <span className="text-sky-700 font-semibold px-1 xl:text-lg">Users</span>
                </p>
            </Link>
              </div>
            </form>
          </div>
          <div className={`hidden lg:block w-full flex flex-col bg-blue-600 px-12 py-20 bg-no-repeat bg-cover bg-center`}>
            <h1 className="text-white text-3xl font-bold">Introduce an admin, manager or user</h1>
            <div>
              <p className="text-gray-100 text-lg pt-5 pb-10 ml-3 font-semibold">
                Fill in the information and the person can have their own account and team
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

export default AddUser;