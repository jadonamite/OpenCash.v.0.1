import { useEffect } from "react";
import {
   Activity,
   CreditCard,
   Settings,
   Copy,
   ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import SwapCard from "../components/SwapCard";

const SwapPage = () => {
   useEffect(() => {
      document.title = "OpenCash | Swap";
   }, []);

   // Mock data for wallet address
   const walletAddress = "0x1a2b...3c4d";

   return (
      <div className="flex flex-col min-h-screen bg-[#0a0d14] text-white">
         <Navbar isLanding={false} />

         <main className="flex-grow">
            <div className="container mx-auto px-4 py-8">
               <div className="flex flex-col md:flex-row">
                  {/* Sidebar */}
                  <aside className="w-full md:w-64 mb-8 md:mb-0 md:mr-8">
                     <div className="bg-[#121721] border border-gray-800 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                           <div className="text-sm font-medium text-gray-400">
                              Your Wallet
                           </div>
                           <div className="flex space-x-1">
                              <button className="p-1 hover:text-white text-gray-400">
                                 <Copy className="h-4 w-4" />
                              </button>
                              <button className="p-1 hover:text-white text-gray-400">
                                 <ExternalLink className="h-4 w-4" />
                              </button>
                           </div>
                        </div>
                        <div className="text-white font-mono text-sm truncate mb-4">
                           {walletAddress}
                        </div>
                        <div className="bg-[#0a0d14] rounded-lg p-3">
                           <div className="text-sm font-medium text-gray-400 mb-1">
                              Total Balance
                           </div>
                           <div className="text-xl font-semibold text-white">
                              $0.00
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#121721] border border-gray-800 rounded-xl overflow-hidden">
                        <nav>
                           <ul>
                              <li>
                                 <a
                                    href="#"
                                    className="flex items-center space-x-3 px-4 py-3 text-white bg-[#1c243a]">
                                    <CreditCard className="h-5 w-5" />
                                    <span>Swap</span>
                                 </a>
                              </li>
                              <li>
                                 <a
                                    href="#"
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1c243a] transition-colors">
                                    <Activity className="h-5 w-5" />
                                    <span>Activity</span>
                                 </a>
                              </li>

                              <li>
                                 <a
                                    href="#"
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1c243a] transition-colors">
                                    <Settings className="h-5 w-5" />
                                    <span>Settings</span>
                                 </a>
                              </li>
                           </ul>
                        </nav>
                     </div>
                  </aside>

                  {/* Main Content */}
                  <div className="flex-grow">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}>
                        <h1 className="text-2xl font-bold mb-6">Swap</h1>

                        <SwapCard />

                        <div className="mt-8 bg-[#121721] border border-gray-800 rounded-xl p-6">
                           <h2 className="text-lg font-semibold mb-4">
                              Recent Activity
                           </h2>
                           <div className="text-center py-8 text-gray-400">
                              <p>No recent transactions</p>
                              <p className="text-sm mt-2">
                                 Your recent swap activities will appear here
                              </p>
                           </div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};

export default SwapPage;
