import React, { createContext, useContext, useRef, RefObject } from "react";

interface ScrollContextType {
   aboutRef: RefObject<HTMLDivElement>;
   featuresRef: RefObject<HTMLDivElement>;
   faqRef: RefObject<HTMLDivElement>;
   scrollToSection: (sectionName: string) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const aboutRef = useRef<HTMLDivElement>(null);
   const featuresRef = useRef<HTMLDivElement>(null);
   const faqRef = useRef<HTMLDivElement>(null);

   const scrollToSection = (sectionName: string) => {
      switch (sectionName) {
         case "about":
            aboutRef.current?.scrollIntoView({ behavior: "smooth" });
            break;
         case "features":
            featuresRef.current?.scrollIntoView({ behavior: "smooth" });
            break;
         case "faq":
            faqRef.current?.scrollIntoView({ behavior: "smooth" });
            break;
         default:
            break;
      }
   };

   return (
      <ScrollContext.Provider
         value={{
            aboutRef,
            featuresRef,
            faqRef,
            scrollToSection,
         }}>
         {children}
      </ScrollContext.Provider>
   );
};

export const useScroll = () => {
   const context = useContext(ScrollContext);
   if (context === undefined) {
      throw new Error("useScroll must be used within a ScrollProvider");
   }
   return context;
};
