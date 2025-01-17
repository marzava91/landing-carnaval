import Image from "next/image";
import { AiOutlineCalendar, AiOutlineArrowRight } from "react-icons/ai";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa"; // Iconos de redes sociales

const HeaderSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-yellow-400 to-pink-500 text-white py-16">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/headersection.png"
          alt="Fondo Carnaval"
          fill // Reemplaza layout="fill" con fill
          style={{
            objectFit: "cover", // Reemplaza objectFit con esta propiedad
            opacity: 0.6, // Controla la opacidad directamente en el estilo
          }}
          quality={80}
        />
      </div>

      {/* Botones de redes sociales */}
      <div className="absolute top-5 right-8 flex space-x-4 z-20">
        <a
          href="https://wa.me/123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FaWhatsapp className="w-5 h-5" style={{ color: "black" }} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FaInstagram className="w-5 h-5" style={{ color: "black" }} />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FaFacebookF className="w-5 h-5" style={{ color: "black" }} />
        </a>
      </div>

      {/* Contenido superpuesto */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-44">
        <p
          className="text-sm font-bold uppercase tracking-widest text-left"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          #TRUJILLOESCARNAVAL
        </p>
        <h1
          className="text-5xl font-bold mt-2 text-left leading-tight"
          style={{ fontFamily: "Montserrat ExtraBold, sans-serif" }}
        >
          Carnavales de <br /> Cajamarca 2025
        </h1>
        <p
          className="text-xl mt-4 flex items-center gap-2 text-left"
          style={{ fontFamily: "Montserrat SemiBold, sans-serif" }}
        >
          <AiOutlineCalendar className="w-6 h-6" /> Sábado, 1ro de Marzo de 2025
        </p>
        <div className="mt-6">
          <a
            href="#order-form"
            className="inline-flex items-center bg-yellow-400 text-black font-bold rounded-full shadow-lg hover:bg-yellow-500 px-6 py-2"
            style={{ fontFamily: "Nunito ExtraBold, sans-serif" }}
          >
            Comprar Polos
            <AiOutlineArrowRight className="w-5 h-5 ml-2 text-black" />
          </a>          
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
