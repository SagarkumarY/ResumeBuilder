import React from 'react'
import {Logo} from '../assets'
import { Link } from 'react-router-dom';
function Footer() {
  return (
    <div className='w-full flex items-center justify-between border-t-2  border-gray-300'>
        <div className=' flex justify-between items-center gap-3 py-3'>
        <img src={Logo} alt="logo" className='w-12 h-auto object-contain' />
            <p className='text-sm text-gray-600'>
                &copy; 2025
            </p>
        </div>
        <div className=' flex justify-between items-center gap-6'>
            <Link to={"/"}  className=' text-sm text-blue-700'>Home</Link> 
            <Link to={"/contact"}  className=' text-sm text-blue-700'>Contact</Link> 
            <Link to={"/"}  className=' text-sm text-blue-700 whitespace-nowrap'>Privacy policy</Link>
        </div>
    </div>
  )
};

export default Footer;