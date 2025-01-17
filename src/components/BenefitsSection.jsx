import React from "react";

const BenefitsSection = () => {
  return (
    <section className="py-10 bg-yellow-400 text-purple-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-44">
        {/* Título */}
        <div>
          <h2
            className="text-xl mb-1 text-white"
            style={{
              fontFamily: "Nunito ExtraBold, sans-serif",
              fontWeight: 600,
            }}
          >
            Adquiere tu polo y obtén
          </h2>
          <h2
            className="text-xl mb-1 text-white"
            style={{
              fontFamily: "Nunito ExtraBold, sans-serif",
              fontWeight: 600,
            }}
          >
            todos estos BENEFICIOS:
          </h2>
          {/* Línea naranja debajo */}
          <div className="w-16 h-1 bg-orange-600"></div>
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Beneficio 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/icons/icon-beer.png"
              alt="Cerveza ilimitada"
              className="w-44 h-44 mb-4"
            />
            <h3
              className="text-lg mb-2 text-white"
              style={{
                fontFamily: "Nunito Bold, sans-serif",
                fontWeight: 700, // Bold
              }}
            >
              Cerveza ilimitada durante el evento
            </h3>
            <p
              className="text-sm"
              style={{
                fontFamily: "Nunito SemiBold, sans-serif",
                fontWeight: 600, // SemiBold
              }}
            >
              Pilsen Callao heladita
            </p>
          </div>

          {/* Beneficio 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/icons/icon-music.png"
              alt="Banda de músicos"
              className="w-44 h-44 mb-4"
            />
            <h3
              className="text-lg mb-2 text-white"
              style={{
                fontFamily: "Nunito Bold, sans-serif",
                fontWeight: 700, // Bold
              }}
            >
              Banda de músicos
            </h3>
            <p
              className="text-sm"
              style={{
                fontFamily: "Nunito SemiBold, sans-serif",
                fontWeight: 600, // SemiBold
              }}
            >
              +15 músicos en escena
            </p>
          </div>

          {/* Beneficio 3 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/icons/icon-ticket.png"
              alt="Pulsera Discoteca"
              className="w-44 h-44 mb-4"
            />
            <h3
              className="text-lg mb-2 text-white"
              style={{
                fontFamily: "Nunito Bold, sans-serif",
                fontWeight: 700, // Bold
              }}
            >
              Pulsera para entrar a Discotecas
            </h3>
            <p
              className="text-sm"
              style={{
                fontFamily: "Nunito SemiBold, sans-serif",
                fontWeight: 600, // SemiBold
              }}
            >
              Diversión asegurada
            </p>
          </div>

          {/* Beneficio 4 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/icons/icon-paint.png"
              alt="Pintura y juego"
              className="w-44 h-44 mb-4"
            />
            <h3
              className="text-lg mb-2 text-white"
              style={{
                fontFamily: "Nunito Bold, sans-serif",
                fontWeight: 700, // Bold
              }}
            >
              Pintura y todo lo necesario para el juego
            </h3>
            <p
              className="text-sm"
              style={{
                fontFamily: "Nunito SemiBold, sans-serif",
                fontWeight: 600, // SemiBold
              }}
            >
              Nos encargamos de todo
            </p>
          </div>
        </div>
      </div>

      {/* Votaciones hasta el 19 de Enero */}
      <div className="max-w-7xl mx-auto px-6 lg:px-44 mt-8">
        <p
          className="text-sm text-purple-900" // Ajustado a morado
          style={{
            fontFamily: "Nunito SemiBold, sans-serif",
            fontWeight: 600,
          }}
        >
          Además que no arruinarás un polo tuyo.
        </p>
      </div>

    </section>
  );
};

export default BenefitsSection;
