import React from "react";

const PricesSection = () => {
  // Obtener la fecha actual en la zona horaria de Lima, Perú
  const currentDate = new Date().toLocaleString("en-US", { timeZone: "America/Lima" });
  const current = new Date(currentDate);

  // Fechas de los rangos
  const preVentaEnd = new Date("2025-01-26T23:59:59-05:00"); // Hasta el 26 de enero
  const ventaEnd = new Date("2025-02-16T23:59:59-05:00"); // Hasta el 16 de febrero

  // Determinar el precio vigente
  let currentPrice = "";
  if (current <= preVentaEnd) {
    currentPrice = "pre-venta";
  } else if (current <= ventaEnd) {
    currentPrice = "venta";
  } else {
    currentPrice = "rezagados";
  }

  // Estilos dinámicos
  const getImageStyle = (price) => {
    if (price === currentPrice) {
      return {
        width: "calc(100% + 5px)", // Aumentar el tamaño
        height: "calc(100% + 5px)",
        opacity: 1, // Sin transparencia
      };
    } else {
      return {
        width: "calc(100% - 40px)", // Reducir el tamaño
        height: "calc(100% - 40px)",
        opacity: 0.3, // Transparencia del 30%
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-44">
      {/* Sección de contenido principal */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Primera columna: Texto explicativo */}
        <div className="text-left col-span-1">
          <h2
            className="text-lg font-extrabold"
            style={{
              fontFamily: "Nunito ExtraBold, sans-serif",
              fontWeight: 800,
            }}
          >
            Todos los polos son
          </h2>
          <h2
            className="text-xl font-extrabold text-black relative inline-block"
            style={{
              fontFamily: "Nunito ExtraBold, sans-serif",
              fontWeight: 800,
            }}
          >
            A PEDIDO
          </h2>
          {/* Línea naranja */}
          <div className="w-12 h-1 bg-orange-600 mb-4"></div>
          <p
            className="text-sm text-gray-800"
            style={{
              fontFamily: "Nunito Regular, sans-serif",
              fontWeight: 400,
            }}
          >
            Como todos los años, días antes del evento se comunicará por correo,
            WhatsApp y redes sociales la fecha y el lugar de donde se podrán
            recoger los polos.
          </p>
        </div>

        {/* Segunda columna: Precios */}
        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {/* Imagen Pre-Venta */}
          <div className="flex justify-center items-center">
            <img
              src="/icons/price-45.png"
              alt="Pre-Venta"
              style={getImageStyle("pre-venta")}
            />
          </div>

          {/* Imagen Venta */}
          <div className="flex justify-center items-center">
            <img
              src="/icons/price-50.png"
              alt="Venta"
              style={getImageStyle("venta")}
            />
          </div>

          {/* Imagen Rezagados */}
          <div className="flex justify-center items-center">
            <img
              src="/icons/price-55.png"
              alt="Rezagados"
              style={getImageStyle("rezagados")}
            />
          </div>
        </div>
      </div>

      {/* Nota adicional */}
      <p
        className="text-sm mt-10 text-left text-gray-800"
        style={{
          fontFamily: "Nunito Regular, sans-serif",
          fontWeight: 400,
        }}
      >
        * Las tallas grandes (XXL y XXXL) tienen un costo adicional de S/ 5.
      </p>
    </div>
  );
};

export default PricesSection;