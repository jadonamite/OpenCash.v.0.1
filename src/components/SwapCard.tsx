import React, { useState, useEffect } from "react";
import { ArrowDown, ChevronDown, Search } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { JsonRpcProvider, formatEther } from "ethers";
import { useNavigate } from "react-router-dom";

type TokenSymbol = "ETH" | "BTC" | "USDC" | "DAI";
type CurrencySymbol = "NGN" | "GBP" | "GHS" | "USD";

interface Token {
   symbol: TokenSymbol;
   name: string;
   balance: string;
   icon: string;
}

interface Currency {
   symbol: CurrencySymbol;
   name: string;
   flag: string;
}

// Define types for exchange rates
interface ExchangeRates {
   [key: string]: {
      [key: string]: number;
   };
}

const tokens: Token[] = [
   {
      symbol: "ETH",
      name: "Ethereum",
      balance: "1.23",
      icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/eth.svg",
   },
   {
      symbol: "BTC",
      name: "Bitcoin",
      balance: "0.0234",
      icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/btc.svg",
   },
   {
      symbol: "USDC",
      name: "USD Coin",
      balance: "1,005.43",
      icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/usdc.svg",
   },
   {
      symbol: "DAI",
      name: "Dai",
      balance: "750.21",
      icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/dai.svg",
   },
];

const currencies: Currency[] = [
   {
      symbol: "NGN",
      name: "Naira",
      flag: "https://flagcdn.com/w40/ng.png",
   },
   {
      symbol: "GBP",
      name: "Pounds",
      flag: "https://flagcdn.com/w40/gb.png",
   },
   {
      symbol: "GHS",
      name: "Cedis",
      flag: "https://flagcdn.com/w40/gh.png",
   },
   {
      symbol: "USD",
      name: "Dollar",
      flag: "https://flagcdn.com/w40/us.png",
   },
];

// Helper function to safely get the image URL
const getImageUrl = (
   item: Token | Currency | undefined,
   imageKey: "icon" | "flag"
): string => {
   if (!item) return "";
   if (imageKey === "icon" && "icon" in item) {
      return item.icon;
   } else if (imageKey === "flag" && "flag" in item) {
      return item.flag;
   }
   return "";
};

const SwapCard: React.FC = () => {
   const [sendAmount, setSendAmount] = useState("");
   const [receiveAmount, setReceiveAmount] = useState("");
   const [selectedToken, setSelectedToken] = useState<TokenSymbol | null>(null);
   const [selectedCurrency, setSelectedCurrency] =
      useState<CurrencySymbol | null>(null);
   const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
   const [isCurrencySelectOpen, setIsCurrencySelectOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [swapMode, setSwapMode] = useState<
      "tokenToCurrency" | "currencyToToken"
   >("tokenToCurrency");
   const [userTokenBalances, setUserTokenBalances] = useState<
      Record<string, string>
   >({});

   // Add Privy integration
   const { login, authenticated, user } = usePrivy();
   const navigate = useNavigate();

   // Mock exchange rate data with proper type definitions
   const exchangeRates: ExchangeRates = {
      // Token to Currency rates
      ETH: { NGN: 7500000, GBP: 3500, GHS: 68000, USD: 4500 },
      BTC: { NGN: 95000000, GBP: 46000, GHS: 840000, USD: 60000 },
      USDC: { NGN: 1595, GBP: 0.78, GHS: 14.5, USD: 1 },
      DAI: { NGN: 1590, GBP: 0.77, GHS: 14.3, USD: 0.99 },
      // Currency to Token rates (inverse of above with slight spread)
      NGN: { ETH: 0.00000013, BTC: 0.00000001, USDC: 0.00063, DAI: 0.00063 },
      GBP: { ETH: 0.00029, BTC: 0.000022, USDC: 1.28, DAI: 1.27 },
      GHS: { ETH: 0.000015, BTC: 0.0000012, USDC: 0.069, DAI: 0.068 },
      USD: { ETH: 0.00022, BTC: 0.000017, USDC: 1, DAI: 0.99 },
   };

   // Gets the current exchange rate based on swap mode and selected tokens
   const getCurrentExchangeRate = (): number => {
      if (!selectedToken || !selectedCurrency) return 1;

      if (swapMode === "tokenToCurrency") {
         return exchangeRates[selectedToken]?.[selectedCurrency] || 1;
      } else {
         return exchangeRates[selectedCurrency]?.[selectedToken] || 1;
      }
   };

   const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Improved input validation that allows empty string and proper numeric values
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
         setSendAmount(value);

         // Calculate receive amount only if there's a valid number
         const numericValue = parseFloat(value) || 0;
         if (numericValue > 0) {
            const rate = getCurrentExchangeRate();
            const calculatedValue = (numericValue * rate).toFixed(
               swapMode === "currencyToToken" &&
                  selectedToken &&
                  (selectedToken === "BTC" || selectedToken === "ETH")
                  ? 8
                  : 2
            );
            setReceiveAmount(calculatedValue);
         } else {
            setReceiveAmount("");
         }
      }
   };

   const handleTokenSelect = (symbol: TokenSymbol) => {
      setSelectedToken(symbol);
      setIsTokenSelectOpen(false);

      // Recalculate rates when token changes
      updateReceiveAmount(sendAmount, symbol, selectedCurrency);
   };

   const handleCurrencySelect = (symbol: CurrencySymbol) => {
      setSelectedCurrency(symbol);
      setIsCurrencySelectOpen(false);

      // Recalculate rates when currency changes
      updateReceiveAmount(sendAmount, selectedToken, symbol);
   };

   // Helper function to update receive amount
   const updateReceiveAmount = (
      amount: string,
      token: TokenSymbol | null,
      currency: CurrencySymbol | null
   ) => {
      if (!amount || !token || !currency) {
         setReceiveAmount("");
         return;
      }

      const numericValue = parseFloat(amount) || 0;
      if (numericValue > 0) {
         let rate;
         if (swapMode === "tokenToCurrency") {
            rate = exchangeRates[token]?.[currency] || 1;
         } else {
            rate = exchangeRates[currency]?.[token] || 1;
         }

         const calculatedValue = (numericValue * rate).toFixed(
            swapMode === "currencyToToken" &&
               (token === "BTC" || token === "ETH")
               ? 8
               : 2
         );
         setReceiveAmount(calculatedValue);
      } else {
         setReceiveAmount("");
      }
   };

   const handleSwapDirection = () => {
      // Toggle the swap mode
      const newMode =
         swapMode === "tokenToCurrency" ? "currencyToToken" : "tokenToCurrency";
      setSwapMode(newMode);

      // Swap the amounts but recalculate based on new mode
      if (receiveAmount && sendAmount) {
         setSendAmount(receiveAmount);

         // Recalculate receive amount based on new direction
         const numericValue = parseFloat(receiveAmount) || 0;
         let rate = 1;

         if (selectedToken && selectedCurrency) {
            rate =
               newMode === "tokenToCurrency"
                  ? exchangeRates[selectedToken]?.[selectedCurrency] || 1
                  : exchangeRates[selectedCurrency]?.[selectedToken] || 1;
         }

         if (numericValue > 0) {
            const calculatedValue = (numericValue * rate).toFixed(
               newMode === "currencyToToken" &&
                  selectedToken &&
                  (selectedToken === "BTC" || selectedToken === "ETH")
                  ? 8
                  : 2
            );
            setReceiveAmount(calculatedValue);
         } else {
            setReceiveAmount("");
         }
      }
   };

   // Handle Privy connection and fetch wallet balances
   const handleConnect = async () => {
      try {
         if (!authenticated) {
            await login();
         }

         if (authenticated && user?.wallet?.address) {
            // Fetch wallet balances
            await fetchWalletBalances(user.wallet.address);

            // Redirect to app after successful connection
            navigate("/app");
         }
      } catch (error) {
         console.error("Privy login failed:", error);
      }
   };

   // Fetch wallet balances for tokens
   const fetchWalletBalances = async (address: string) => {
      try {
         const provider = new JsonRpcProvider("https://mainnet.base.org");

         // For demo purposes, let's just fetch ETH balance and use mock data for others
         const ethBalance = await provider.getBalance(address);
         const formattedEthBalance = formatEther(ethBalance);

         // Update balances in state - in a real app, you'd fetch actual token balances
         setUserTokenBalances({
            ETH: parseFloat(formattedEthBalance).toFixed(4),
            BTC: "0.0234", // Mock data
            USDC: "1,005.43", // Mock data
            DAI: "750.21", // Mock data
         });

         console.log("Wallet balances fetched:", userTokenBalances);
      } catch (error) {
         console.error("Failed to fetch wallet balances:", error);
      }
   };

   const filteredTokens = tokens.filter(
      (token) =>
         token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
         token.name.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const filteredCurrencies = currencies.filter(
      (currency) =>
         currency.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
         currency.name.toLowerCase().includes(searchQuery.toLowerCase())
   );

   // Type for section info
   type SectionInfo = {
      title: string;
      isToken: boolean;
      selectAction: () => void;
      selected: TokenSymbol | CurrencySymbol | null;
      items: Token[] | Currency[];
      findItem: (
         symbol: TokenSymbol | CurrencySymbol
      ) => Token | Currency | undefined;
      imageKey: "icon" | "flag";
   };

   // Initialize with default tokens if not selected
   useEffect(() => {
      if (!selectedToken) setSelectedToken("USDC");
      if (!selectedCurrency) setSelectedCurrency("NGN");
   }, []);

   // Recalculate on token/currency selection change
   useEffect(() => {
      if (selectedToken && selectedCurrency && sendAmount) {
         updateReceiveAmount(sendAmount, selectedToken, selectedCurrency);
      }
   }, [selectedToken, selectedCurrency]);

   // Fetch wallet balances when authenticated
   useEffect(() => {
      if (authenticated && user?.wallet?.address) {
         fetchWalletBalances(user.wallet.address);
      }
   }, [authenticated, user?.wallet?.address]);

   // Determine what to show in each section based on swap mode
   const sendSection: SectionInfo =
      swapMode === "tokenToCurrency"
         ? {
              title: "Send",
              isToken: true,
              selectAction: () => setIsTokenSelectOpen(true),
              selected: selectedToken,
              items: tokens,
              findItem: (symbol: TokenSymbol | CurrencySymbol) =>
                 tokens.find((t) => t.symbol === symbol),
              imageKey: "icon",
           }
         : {
              title: "Send",
              isToken: false,
              selectAction: () => setIsCurrencySelectOpen(true),
              selected: selectedCurrency,
              items: currencies,
              findItem: (symbol: TokenSymbol | CurrencySymbol) =>
                 currencies.find((c) => c.symbol === symbol),
              imageKey: "flag",
           };

   const receiveSection: SectionInfo =
      swapMode === "tokenToCurrency"
         ? {
              title: "Receive",
              isToken: false,
              selectAction: () => setIsCurrencySelectOpen(true),
              selected: selectedCurrency,
              items: currencies,
              findItem: (symbol: TokenSymbol | CurrencySymbol) =>
                 currencies.find((c) => c.symbol === symbol),
              imageKey: "flag",
           }
         : {
              title: "Receive",
              isToken: true,
              selectAction: () => setIsTokenSelectOpen(true),
              selected: selectedToken,
              items: tokens,
              findItem: (symbol: TokenSymbol | CurrencySymbol) =>
                 tokens.find((t) => t.symbol === symbol),
              imageKey: "icon",
           };

   // Get token balance - only show for authenticated users
   const getTokenBalance = (symbol: TokenSymbol | null): string => {
      if (!authenticated || !symbol) return "";
      return userTokenBalances[symbol] || "0.00";
   };

   // Helper function to render a section (Send or Receive)
   const renderSection = (sectionInfo: SectionInfo, isInput: boolean) => {
      const sectionTitle = sectionInfo.title;
      const selected = sectionInfo.selected;
      const selectLabel = sectionInfo.isToken
         ? "Select Token"
         : "Select Currency";
      // Get the item if selected
      const selectedItem = selected
         ? sectionInfo.findItem(selected)
         : undefined;
      // Get image URL safely
      const imageUrl = getImageUrl(selectedItem, sectionInfo.imageKey);

      return (
         <div className="p-4 border border-gray-700 rounded-lg bg-[#0d1224] backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
               <span className="text-gray-400">{sectionTitle}</span>
               {/* Only show balance for tokens when authenticated */}
               {authenticated && sectionInfo.isToken && selected && (
                  <span className="text-sm text-gray-400">
                     Balance: {getTokenBalance(selected as TokenSymbol)}
                  </span>
               )}
            </div>
            <div className="flex justify-between items-center">
               {isInput ? (
                  <input
                     type="text"
                     value={sendAmount}
                     onChange={handleSendAmountChange}
                     className="bg-transparent text-2xl text-white w-1/2 focus:outline-none"
                     placeholder="0.0"
                  />
               ) : (
                  <div className="text-2xl text-white">
                     {receiveAmount || "0.00"}
                  </div>
               )}
               <button
                  onClick={sectionInfo.selectAction}
                  className="flex items-center gap-2 bg-[#2d3748] hover:bg-[#3a4a63] text-white py-2 px-4 rounded-lg">
                  {selected ? (
                     <div className="flex items-center gap-2">
                        <img
                           src={imageUrl}
                           alt={selected}
                           className="w-6 h-6"
                        />
                        <span>{selected}</span>
                     </div>
                  ) : (
                     <span className="text-gray-300">{selectLabel}</span>
                  )}
                  <ChevronDown size={18} />
               </button>
            </div>
            {/* Show exchange rate information */}
            {selectedToken && selectedCurrency && (
               <div className="text-sm text-gray-400 mt-2">
                  {swapMode === "tokenToCurrency" && isInput && selected
                     ? `1 ${selected} ≈ ${
                          exchangeRates[selected as TokenSymbol]?.[
                             selectedCurrency
                          ]?.toLocaleString() || "0"
                       } ${selectedCurrency}`
                     : swapMode === "currencyToToken" && isInput && selected
                     ? `1 ${selected} ≈ ${
                          exchangeRates[selected as CurrencySymbol]?.[
                             selectedToken
                          ]?.toLocaleString() || "0"
                       } ${selectedToken}`
                     : swapMode === "tokenToCurrency" && !isInput && selected
                     ? `1 ${selected} ≈ ${(
                          1 /
                          (exchangeRates[selectedToken]?.[
                             selected as CurrencySymbol
                          ] || 1)
                       ).toFixed(8)} ${selectedToken}`
                     : swapMode === "currencyToToken" && !isInput && selected
                     ? `1 ${selected} ≈ ${(
                          1 /
                          (exchangeRates[selected as CurrencySymbol]?.[
                             selectedToken
                          ] || 1)
                       ).toFixed(8)} ${selectedCurrency}`
                     : ""}
               </div>
            )}
         </div>
      );
   };

   return (
      <div className="relative w-full max-w-md mx-auto">
         {/* Glassmorphic Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl filter blur-l"></div>
         <div className="relative bg-[#131722]/60 backdrop-blur-md shadow-xl rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 space-y-4">
               {/* Send Section */}
               {renderSection(sendSection, true)}
               {/* Swap Direction Button */}
               <div className="flex justify-center -my-2 relative z-10">
                  <button
                     onClick={handleSwapDirection}
                     className="h-5 w-5 text-purple-500 transition-transform duration-300 transform hover:scale-150">
                     <ArrowDown size={18} />
                  </button>
               </div>
               {/* Receive Section */}
               {renderSection(receiveSection, false)}
               {/* Token Select Modal */}
               {isTokenSelectOpen && (
                  <div
                     className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                     onClick={() => setIsTokenSelectOpen(false)}>
                     <div
                        className="bg-[#131722] border border-gray-800 rounded-xl w-[90%] max-w-md max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                           <h3 className="text-xl font-semibold text-white">
                              Select a token
                           </h3>
                           <button
                              className="text-gray-400 hover:text-white"
                              onClick={() => setIsTokenSelectOpen(false)}>
                              Close
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-6 w-6"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                 />
                              </svg>
                           </button>
                        </div>
                        <div className="p-4 border-b border-gray-800 relative">
                           <input
                              type="text"
                              placeholder="Search tokens..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-[#161b2b] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                           />
                           <Search
                              size={20}
                              className="absolute top-7 left-8 text-gray-400"
                           />
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                           {filteredTokens.map((token) => (
                              <div
                                 key={token.symbol}
                                 className="flex justify-between items-center p-3 hover:bg-[#21273a] rounded-lg cursor-pointer"
                                 onClick={() =>
                                    handleTokenSelect(token.symbol)
                                 }>
                                 <div className="flex items-center gap-3">
                                    <img
                                       src={token.icon}
                                       alt={token.symbol}
                                       className="w-8 h-8"
                                    />
                                    <div>
                                       <div className="text-white font-medium">
                                          {token.symbol}
                                       </div>
                                       <div className="text-sm text-gray-400">
                                          {token.name}
                                       </div>
                                    </div>
                                 </div>
                                 {/* Only show balance when authenticated */}
                                 {authenticated && (
                                    <div className="text-white">
                                       {getTokenBalance(token.symbol)}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
               {/* Currency Select Modal */}
               {isCurrencySelectOpen && (
                  <div
                     className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                     onClick={() => setIsCurrencySelectOpen(false)}>
                     <div
                        className="bg-[#131722] border border-gray-800 rounded-xl w-[90%] max-w-md max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                           <h3 className="text-xl font-semibold text-white">
                              Select a currency
                           </h3>
                           <button
                              className="text-gray-400 hover:text-white"
                              onClick={() => setIsCurrencySelectOpen(false)}>
                              Close
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-6 w-6"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                 />
                              </svg>
                           </button>
                        </div>
                        <div className="p-4 border-b border-gray-800 relative">
                           <input
                              type="text"
                              placeholder="Search currencies..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-[#161b2b] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                           />
                           <Search
                              size={20}
                              className="absolute top-7 left-8 text-gray-400"
                           />
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                           {filteredCurrencies.map((currency) => (
                              <div
                                 key={currency.symbol}
                                 className="flex justify-between items-center p-3 hover:bg-[#21273a] rounded-lg cursor-pointer"
                                 onClick={() =>
                                    handleCurrencySelect(currency.symbol)
                                 }>
                                 <div className="flex items-center gap-3">
                                    <img
                                       src={currency.flag}
                                       alt={currency.symbol}
                                       className="w-8 h-8 object-cover rounded-full border border-gray-800"
                                    />
                                    <div>
                                       <div className="text-white font-medium">
                                          {currency.symbol}
                                       </div>
                                       <div className="text-sm text-gray-400">
                                          {currency.name}
                                       </div>
                                    </div>
                                 </div>
                                 {/* Currencies don't have balances in wallet */}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
               {/* Action Button - Updated with Privy connect function */}
               <button
                  onClick={handleConnect}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
                  {authenticated ? "Continue" : "Connect Wallet"}
               </button>
            </div>
         </div>
      </div>
   );
};

export default SwapCard;
