const VotingSection = () => {
  return (
    <section className="py-0 bg-white">
      {/* Imagen del polo con hipervínculo */}
      <div className="flex justify-center">
        <a
          href="https://www.instagram.com/p/DE2wu0NP12X/?igsh=MW9jNmMyMjd6dWJ6ZA=="
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/polo-carnavalero.png"
            alt="Polo Carnavalero"
            className="max-w-full object-contain"
            style={{ width: "1024px", height: "auto" }} // Ajusta el tamaño si es necesario
          />
        </a>
      </div>
    </section>
  );
};

export default VotingSection;
