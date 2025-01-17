import React from "react";

const SponsorsSection = () => {
  return (
    <section className="py-10 bg-gray-50">
      {/* Título y enlace */}
      <div className="max-w-7xl mx-auto px-6 lg:px-44">
        <h2
          className="text-xl"
          style={{
            fontFamily: "Nunito ExtraBold, sans-serif",
            fontWeight: 600,
            color: "#E8007F",
          }}
        >
          Gracias al auspicio de:
        </h2>
        <a
          href="/informacion-auspiciadores"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline block mt-1"
          style={{
            fontFamily: "Myriad Pro, sans-serif",
            fontWeight: 400,
            color: "#000000",
          }}
        >
          Información para auspiciadores
        </a>
      </div>

      {/* Contenido */}
      <div className="mt-8 text-center">
        <a
          href="https://www.mijimarket.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/mijimarket.png"
            alt="Muji Market"
            className="mx-auto w-40 h-auto"
          />
        </a>
        <p
          className="text-gray-700 mt-2"
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 400,
          }}
        >
          Descarga su app móvil{" "}
          <a
            href="https://play.google.com/store/apps/details?id=com.mujimarket"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            aquí
          </a>
        </p>
      </div>
    </section>
  );
};

export default SponsorsSection;
