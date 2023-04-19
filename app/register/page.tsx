import GoogleLogo from '../../public/assets/google.svg'
import FemaleAvatar from '../../public/assets/FemaleAvatar.svg'
import { HiOutlineUser, HiAtSymbol, HiFingerPrint } from "react-icons/hi"
import ComputerRegister from '../../public/assets/computer_register.svg'
import Image from 'next/image'
import styles from './page.module.css'
import { Dosis } from 'next/font/google'


const dosis = Dosis({
    weight: '400',
    style: 'normal',
    subsets: ['latin']
})


export default function Register() {
    return (
       <div className={`${styles.bgColor} h-screen py-20`}>
        <div className="container mx-auto w-full">
            <div className="flex flex-col lg:flex-row w-full  bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
                <div className="w-full w-1/2 py-16 px-12 bg-gray-50">
                    <div className='flex justify-center'>
                    <Image src={FemaleAvatar} alt="male avatar" className='bg-gray-300 rounded-full' width={100} height={100}/>  
                    </div>
                    <form className="flex flex-col gap-6 py-8 flex justify-center">
                        <div className={`${styles.input_group}`}>
                            <input 
                            type="text" 
                            name="first name"
                            placeholder="First name"
                            className={`${styles.input_text}`}
                            />
                             <span className="icon flex items-center px-4">
                                <HiOutlineUser size={25} />
                            </span>
                        </div>
                        
                        <div className={`${styles.input_group}`}>
                            <input 
                            type="text" 
                            name="second name"
                            placeholder="Second name"
                            className={`${styles.input_text}`}
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
                            className={`${styles.input_text}`}
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
                            <button className={styles.button_custom} type="button"> Connect with Google <Image src={GoogleLogo} alt="google logo image" width={25} height={25} /></button>
                        </div>
                    </form>

                    {/* bottom  */}
                    <p className=" text-lg flex justify-center">Already a user? <span className="text-sky-700 font-semibold px-1 text-lg"> Log in</span></p>
                </div>
                <div className={`${dosis.className} hidden lg:block w-full flex flex-col bg-blue-600 px-12 py-20 bg-no-repeat bg-cover bg-center`}>
                    <h1 className="text-white text-3xl font-bold">New here ?</h1>
                    <div>
                        <p className="text-gray-100 text-lg pt-5 pb-10 ml-3 font-semibold">Fill in your information and begin your journey with us</p>
                        <div className="flex justify-center">
                            <Image src={ComputerRegister} alt="login page image" />
                        </div>    
                    </div>
                </div>
            </div>
            
        </div>
       </div>
    )
}