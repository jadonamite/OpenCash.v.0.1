import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate hook
import { Menu, X, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { usePrivy } from "@privy-io/react-auth";
import { JsonRpcProvider, formatEther } from "ethers";

interface NavbarProps {
   isLanding?: boolean;
}

const Navbar = ({ isLanding = true }: NavbarProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const { login, user, logout } = usePrivy(); // Adding logout to log out the user
   const navigate = useNavigate(); // Hook for redirection

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };

   const handleConnect = async () => {
      try {
         // Try logging in the user
         await login();

         // Check if the user has connected their wallet and has an address
         if (user?.wallet?.address) {
            const provider = new JsonRpcProvider(
               "https://mainnet.base.org" // Using Base Mainnet RPC
            );

            const balance = await provider.getBalance(user.wallet.address);
            const formattedBalance = formatEther(balance);

            console.log("Connected Address:", user.wallet.address);
            console.log("Balance (Base):", formattedBalance);

            // After successful connection, navigate to the /app page
            navigate("/app");
         } else {
            console.log("No wallet address found.");
         }
      } catch (error) {
         console.error("Privy login failed:", error);
      }
   };

   const handleDisconnect = async () => {
      try {
         // Logging out the user
         await logout();
         console.log("Logged out successfully");

         // Redirect to homepage after logout
         navigate("/");
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   // Automatically redirect the user to /app if they are authenticated
   useEffect(() => {
      if (user?.wallet?.address) {
         navigate("/app");
      }
   }, [user, navigate]);

   return (
      <nav
         className={`relative z-50 ${
            isLanding ? "text-white" : "bg-[#121212] text-white"
         } py-4 px-6 md:px-12`}>
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
               <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
               <div className="flex space-x-6">
                  <Link
                     to="/"
                     className="hover:text-purple-300 transition-colors font-medium">
                     Home
                  </Link>
                  <Link
                     to="#features"
                     className="hover:text-purple-300 transition-colors font-medium">
                     Features
                  </Link>
                  <Link
                     to="#about"
                     className="hover:text-purple-300 transition-colors font-medium">
                     About
                  </Link>
                  <Link
                     to="#faq"
                     className="hover:text-purple-300 transition-colors font-medium">
                     FAQ
                  </Link>
               </div>

               {user?.wallet?.address ? (
                  <motion.button
                     onClick={handleDisconnect} // Handle logout
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                        text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 flex items-center">
                     <Wallet className="mr-2 h-5 w-5" />
                     Disconnect
                  </motion.button>
               ) : (
                  <motion.button
                     onClick={handleConnect} // Handle login
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                        text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 flex items-center">
                     <Wallet className="mr-2 h-5 w-5" />
                     Connect Wallet
                  </motion.button>
               )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
               {user?.wallet?.address ? (
                  <motion.button
                     onClick={handleDisconnect} // Handle logout
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                        text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 flex items-center">
                     <Wallet className="mr-1 h-4 w-4" />
                     Disconnect
                  </motion.button>
               ) : (
                  <motion.button
                     onClick={handleConnect} // Handle login
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                        text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 flex items-center mr-4">
                     <Wallet className="mr-1 h-4 w-4" />
                     Connect
                  </motion.button>
               )}
               <button
                  onClick={toggleMenu}
                  className="text-white focus:outline-none">
                  {isOpen ? (
                     <X className="h-6 w-6" />
                  ) : (
                     <Menu className="h-6 w-6" />
                  )}
               </button>
            </div>
         </div>

         {/* Mobile Navigation */}
         {isOpen && (
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="md:hidden absolute left-0 right-0 top-16 p-4 bg-[#121212] border-t border-gray-800 shadow-lg">
               <div className="flex flex-col space-y-4">
                  <Link
                     to="/"
                     className="hover:text-purple-300 transition-colors font-medium py-2 px-4">
                     Home
                  </Link>
                  <Link
                     to="#features"
                     className="hover:text-purple-300 transition-colors font-medium py-2 px-4">
                     Features
                  </Link>
                  <Link
                     to="#about"
                     className="hover:text-purple-300 transition-colors font-medium py-2 px-4">
                     About
                  </Link>
                  <Link
                     to="#faq"
                     className="hover:text-purple-300 transition-colors font-medium py-2 px-4">
                     FAQ
                  </Link>
               </div>
            </motion.div>
         )}
      </nav>
   );
};

export default Navbar;
