const FooterSection = () => {
    return (
      <footer
        className="relative bg-cover bg-center text-white h-[200px] sm:h-[266px]"
        style={{
          backgroundImage: "url('/footersection.png')",
          backgroundSize: "cover", // Ajusta el tamaño para que la imagen no se extienda.
        backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-pink-500 bg-opacity-70"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
            <p className="text-lg md:text-2xl font-nunito font-semibold">
            Una experiencia que tienes que vivir.
          </p>
        </div>
      </footer>
    );
  };
  
  export default FooterSection;
  