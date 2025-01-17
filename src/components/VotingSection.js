const VotingSection = () => {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-44">
        {/* Título y enlace */}
        <h2
          className="text-xl"
          style={{
            fontFamily: "Nunito ExtraBold, sans-serif",
            fontWeight: 600,
            color: "#E8007F",
          }}
        >
          Ayúdanos a elegir el logo de este año:
        </h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline block mt-1" // Agregado block para nuevo renglón y espacio
          style={{
            fontFamily: "Myriad Pro, sans-serif",
            fontWeight: 400,
            color: "#000000",
          }}
        >
          Vota aquí
        </a>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8 mt-8">
        {/* Opción A */}
        <div className="text-center">
          <div className="flex items-center justify-center w-80 h-80">
            <img
              src="/logo-02.png"
              alt="Opción A"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-center mt-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#56CCF2", // Azul claro
              }}
            >
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                A
              </span>
            </div>
          </div>
        </div>

        {/* Opción B */}
        <div className="text-center">
          <div className="flex items-center justify-center w-80 h-80">
            <img
              src="/logo-01.png"
              alt="Opción B"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-center mt-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#F2994A", // Naranja
              }}
            >
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                B
              </span>
            </div>
          </div>
        </div>

        {/* Opción C */}
        <div className="text-center">
          <div className="flex items-center justify-center w-80 h-80">
            <img
              src="/logo-03.png"
              alt="Opción C"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-center mt-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#BB6BD9", // Morado
              }}
            >
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                C
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Votaciones hasta el 19 de Enero */}
      <div className="max-w-7xl mx-auto px-6 lg:px-44 mt-8">
        <p
          className="text-sm"
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 400,
            color: "#000000",
          }}
        >
          Votaciones hasta el 19 de Enero
        </p>
      </div>
    </section>
  );
};

export default VotingSection;
