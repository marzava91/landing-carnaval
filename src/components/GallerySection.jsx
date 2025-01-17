import React, { useState } from "react";
import Modal from "react-modal";

const images = [
  "/images/photo-01.JPEG",
  "/images/photo-02.JPEG",
  "/images/photo-03.JPEG",
  "/images/photo-04.JPEG",
  "/images/photo-05.JPEG",
];

const GallerySection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const openModal = (image) => {
    setCurrentImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <section className="py-10 bg-white">
      {/* Título */}
      <div className="max-w-7xl mx-auto px-6 lg:px-44">
        <h2
          className="text-xl"
          style={{
            fontFamily: "Nunito ExtraBold, sans-serif",
            fontWeight: 600,
            color: "#E8007F",
          }}
        >
          Carnavales anteriores:
        </h2>
      </div>

      {/* Galería */}
      <div className="flex justify-center gap-4 flex-wrap mt-8">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Experiencia ${index + 1}`}
            className="w-32 h-32 object-cover cursor-pointer rounded-md"
            onClick={() => openModal(image)}
          />
        ))}
      </div>

      {/* Modal */}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div className="relative bg-white p-4 rounded-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={closeModal}
            >
              X
            </button>
            <img
              src={currentImage}
              alt="Modal de experiencia"
              className="max-w-full max-h-[80vh]"
            />
          </div>
        </Modal>
      )}
    </section>
  );
};

export default GallerySection;
