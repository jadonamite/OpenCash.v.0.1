import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What is OpenCash?',
    answer: 'OpenCash is a peer-to-peer platform that allows users to exchange digital assets directly with one another without intermediaries. We provide a secure, fast, and user-friendly interface for all your crypto transactions.'
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply click the "Connect" button in the top right corner, connect your wallet, and you\'re ready to start trading. You can then send and receive various tokens directly from our platform.'
  },
  {
    question: 'Which wallets are supported?',
    answer: 'We support a wide range of wallets including MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, and more. You can connect any Ethereum-compatible wallet to our platform.'
  },
  {
    question: 'What are the fees?',
    answer: 'OpenCash charges a minimal fee of 0.1% per transaction. This fee helps us maintain the platform and continue developing new features for our users. We aim to keep our fees transparent and among the lowest in the industry.'
  },
  {
    question: 'Is OpenCash secure?',
    answer: 'Absolutely! Security is our top priority. We use industry-standard encryption, smart contract audits, and regular security reviews to ensure your assets are protected. Additionally, as a non-custodial platform, you maintain control of your private keys at all times.'
  },
  {
    question: 'Which networks are supported?',
    answer: 'Currently, OpenCash supports Ethereum, Polygon, Binance Smart Chain, Arbitrum, and Optimism. We are continuously working to add more networks to provide you with even more options.'
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#0a0d14]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-3xl mx-auto text-lg"
          >
            Find answers to common questions about OpenCash and how it works.
          </motion.p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="mb-4 border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-4 md:p-6 bg-[#161b2b] hover:bg-[#1c2235] text-left transition-colors focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-6 bg-[#0e1117] text-gray-300">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;