import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import HeaderSection from "../components/HeaderSection";
import VotingSection from "../components/VotingSection";
import OrderForm from "../components/OrderForm";
import BenefitsSection from "../components/BenefitsSection";
import PricesSection from "../components/PricesSection";
import SponsorsSection from "../components/SponsorsSection";
import GallerySection from "../components/GallerySection";
import FooterSection from "../components/FooterSection";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <HeaderSection />
      <VotingSection />
      <BenefitsSection />
      <PricesSection />
      <OrderForm />
      <SponsorsSection /> 
      <GallerySection />
      <FooterSection /> 
    </div>
  );
}