import { Link } from "react-router-dom";
import {
   Github as GitHub,
   Twitter,
   Disc as Discord,
   Instagram,
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
   return (
      <footer className="bg-[#060910] text-gray-400">
         <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               <div>
                  <Link to="/" className="flex items-center space-x-2 mb-6">
                     <Logo />
                  </Link>
                  <p className="mb-6">
                     The future of peer-to-peer digital asset exchange. Fast,
                     secure, and low-fee transactions for everyone.
                  </p>
                  <div className="flex space-x-4">
                     <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors">
                        <Twitter className="h-5 w-5" />
                     </a>
                     <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors">
                        <Discord className="h-5 w-5" />
                     </a>
                     <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors">
                        <GitHub className="h-5 w-5" />
                     </a>
                     <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors">
                        <Instagram className="h-5 w-5" />
                     </a>
                  </div>
               </div>

               <div>
                  <h3 className="text-white font-semibold text-lg mb-4">
                     Quick Links
                  </h3>
                  <ul className="space-y-3">
                     <li>
                        <Link
                           to="/"
                           className="hover:text-white transition-colors">
                           Home
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="#features"
                           className="hover:text-white transition-colors">
                           Features
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="#about"
                           className="hover:text-white transition-colors">
                           About Us
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="#faq"
                           className="hover:text-white transition-colors">
                           FAQ
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/app"
                           className="hover:text-white transition-colors">
                           Launch App
                        </Link>
                     </li>
                  </ul>
               </div>

               <div>
                  <h3 className="text-white font-semibold text-lg mb-4">
                     Resources
                  </h3>
                  <ul className="space-y-3">
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Documentation
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           API
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Developers
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Blog
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Tutorials
                        </a>
                     </li>
                  </ul>
               </div>

               <div>
                  <h3 className="text-white font-semibold text-lg mb-4">
                     Legal
                  </h3>
                  <ul className="space-y-3">
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Privacy Policy
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Terms of Service
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Disclaimer
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Risk Disclosure
                        </a>
                     </li>
                     <li>
                        <a
                           href="#"
                           className="hover:text-white transition-colors">
                           Cookie Policy
                        </a>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-gray-800 mt-10 pt-8 text-center">
               <p>
                  &copy; {new Date().getFullYear()} OpenCash. All rights
                  reserved.
               </p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
