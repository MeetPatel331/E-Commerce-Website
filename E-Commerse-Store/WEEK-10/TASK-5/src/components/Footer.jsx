import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { IoLogoVenmo } from "react-icons/io5";
import { SiShopify } from "react-icons/si";
import { FaPaypal } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa6";
import { FaCcDiscover } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";



const Footer = () => {
    const logo = 'https://www.stsslings.com/cdn/shop/files/Logo_2.png?v=1715677786&width=200'
    return (
        <div className='footer'>
            <div className='columns'>
                <div className='footer-columns'>
                    <img src={logo} alt="" />
                    <p>Outdoor gear that's built for your legacy</p>
                    <div className='socialMediaIcons'>
                        <button>{<FaFacebookF />}</button>
                        <button>{<FaInstagram />}</button>
                        <button>{<FaXTwitter />}</button>
                    </div>
                </div>
                <div className='footer-columns'>
                    <h2>Quick Links</h2>
                    <div className='line'></div>
                    <ul>
                        <li>Home</li>
                        <li>Our Roots</li>
                        <li>Our Products</li>
                        <li>Products</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div className='footer-columns'>
                    <h2>Links</h2>
                    <div className='line'></div>
                    <ul>
                        <li>Search</li>
                        <li>Privacy Policy</li>
                        <li>Shipping & Returns</li>
                        <li>Terms & Conditions</li>
                        <li>Do not sell my personal information</li>
                    </ul>
                </div>
                <div className='footer-columns'>
                    <h2>Contact Info</h2>
                    <div className='line'></div>
                    <ul>
                        <li><div>
                            <span><FaLocationDot /></span>
                            <p>432 Champions Dr Georgetown, TX 78628, United States</p>
                        </div></li>
                        <li>
                            <div>
                                <span><FaPhoneAlt /></span>
                                <p>512-797-3178 </p>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span><MdEmail /></span>
                                <p>chris@stsslings.com</p>
                            </div>
                        </li>
                         
                    </ul>
                </div>
            </div>
            <p className='copyright'>*Please consult your local concealed carry laws and regulations.</p>
            <div style={{backgroundColor:'lightgray',height:'0.5px',marginBlock:'10px'}}></div>
            <div className='footer-owner'>
                <div className='text'>
                    © 2025, South Texas Slings|Powered by Shopify
                </div>
                <div className='paying'>
                    <ul>
                        <li><SiAmericanexpress /></li>
                        <li><FaCcDiscover /></li>
                        <li><FaCcMastercard /></li>
                        <li><FaPaypal /></li>
                        <li><SiShopify /></li>
                        <li><IoLogoVenmo /></li>
                        <li><FaCcVisa /></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer