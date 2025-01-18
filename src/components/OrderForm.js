import { useState, useEffect } from "react";
import { FiTrash2, FiInfo, FiCopy } from "react-icons/fi"; // Icono de tacho de basura
import { AiOutlinePlus } from "react-icons/ai"; // Icono de "+" para agregar más tallas
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../firebase";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tallas: [{ talla: "XS", cantidad: 1 }],
  });
  const [total, setTotal] = useState(0); // Estado para el precio total
  const [archivos, setArchivos] = useState([]); // Estado para manejar los archivos adjuntos
  const [dialogContent, setDialogContent] = useState(null); // Estado para manejar el contenido del diálogo
  const [showDialog, setShowDialog] = useState(false); // Estado para mostrar u ocultar el diálogo
  const [showSummaryDialog, setShowSummaryDialog] = useState(false); // Estado para mostrar el resumen del pedido
  const [orderSummaryContent, setOrderSummaryContent] = useState(null); // Contenido del resumen del pedido
  const [loading, setLoading] = useState(false); 
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  
  // Calcular automáticamente el total cuando cambien las tallas
  useEffect(() => {
    calcularTotal();
  }, [formData.tallas]);

  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });
  
  const validateField = (field, value) => {
    let error = "";
  
    if (field === "nombre") {
      const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!value.trim()) {
        error = "El nombre es obligatorio.";
      } else if (!nombreRegex.test(value.trim())) {
        error = "Solo se permiten letras y espacios.";
      }
    }
  
    if (field === "correo") {
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        error = "El correo es obligatorio.";
      } else if (!correoRegex.test(value.trim())) {
        error = "Por favor, ingresa un correo válido.";
      }
    }
  
    if (field === "telefono") {
      const telefonoRegex = /^9\d{8}$/;
      if (!value.trim()) {
        error = "El teléfono es obligatorio.";
      } else if (!telefonoRegex.test(value.trim())) {
        error = "Debe ser un número de 9 dígitos y empezar con 9.";
      }
    }
  
    setErrors((prev) => ({ ...prev, [field]: error }));
  };
  
  const isFormValid = () => {
    return (
      !errors.nombre &&
      !errors.correo &&
      !errors.telefono &&
      formData.nombre.trim() &&
      formData.correo.trim() &&
      formData.telefono.trim() &&
      formData.tallas.every((talla) => talla.talla && talla.cantidad > 0) &&
      archivos.length > 0
    );
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };
  

  const handleTallaChange = (index, field, value) => {
    const tallas = [...formData.tallas];
    tallas[index][field] = field === "cantidad" ? parseInt(value) || 1 : value;
    setFormData({ ...formData, tallas });
  };

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const agregarTalla = () => {
    setFormData({
      ...formData,
      tallas: [...formData.tallas, { talla: "", cantidad: 1 }],
    });
  };

  const eliminarTalla = (index) => {
    const tallas = [...formData.tallas];
    tallas.splice(index, 1);
    setFormData({ ...formData, tallas });
  };

  const calcularPrecios = () => {
    const hoy = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Lima" }));
    const fecha26Enero = new Date("2025-01-26T23:59:59-05:00");
    const fecha16Febrero = new Date("2025-02-16T23:59:59-05:00");
  
    let precioBase;
    if (hoy <= fecha26Enero) {
      precioBase = 45;
    } else if (hoy <= fecha16Febrero) {
      precioBase = 50;
    } else {
      precioBase = 55;
    }
  
    return {
      XS: precioBase,
      S: precioBase,
      M: precioBase,
      L: precioBase,
      XL: precioBase,
      XXL: precioBase + 5,
      XXXL: precioBase + 5,
    };
  };
  
  const calcularTotal = () => {
    const precios = calcularPrecios(); // Obtén los precios dinámicos
    const nuevoTotal = formData.tallas.reduce((sum, item) => {
      return sum + (precios[item.talla] || 0) * (item.cantidad || 0);
    }, 0);
  
    setTotal(nuevoTotal);
  };
    
  const obtenerOpcionesDisponibles = (index) => {
    const seleccionadas = formData.tallas
      .map((item, i) => (i !== index ? item.talla : null))
      .filter(Boolean);
    const todasLasOpciones = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    return todasLasOpciones.filter((opcion) => !seleccionadas.includes(opcion));
  };

  const handleFileChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);

    const archivosValidos = nuevosArchivos.filter((archivo) => {
      if (archivo.size > 3 * 1024 * 1024) {
        alert(`El archivo "${archivo.name}" supera los 3MB y no será añadido.`);
        return false;
      }
      if (!["image/png", "image/jpeg"].includes(archivo.type)) {
        alert(`El archivo "${archivo.name}" no es un formato válido (PNG o JPG).`);
        return false;
      }
      return true;
    });

    if (archivos.length + archivosValidos.length > 5) {
      alert("Solo se pueden adjuntar un máximo de 5 archivos.");
      return;
    }

    setArchivos((prev) => [...prev, ...archivosValidos]);
  };

  const eliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files) => {
    const urls = [];
  
    for (const file of files) {
      const fileRef = ref(storage, `evidenciasPagos/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      urls.push(fileUrl);
    }
  
    return urls;
  };
  
  const saveOrder = async (orderData) => {
    const db = getFirestore();
    const ordersCollection = collection(db, "orders");
    const docRef = await addDoc(ordersCollection, orderData);
    return docRef.id; // Devuelve el ID del documento creado
  };
  
  const handleSummaryDialog = () => {
    // Crear el contenido del resumen
    const resumenTallas = formData.tallas
      .map((talla) => `${talla.talla}, ${talla.cantidad} unidad(es)`)
      .join("\n");

    const resumen = (
      <div className="text-left" style={{ color: "#000" }}>
        <p><strong>Nombre Completo:</strong> {formData.nombre}</p>
        <p><strong>Correo Electrónico:</strong> {formData.correo}</p>
        <p><strong>Teléfono:</strong> {formData.telefono}</p>
        <p><strong>Polos:</strong></p>
        <pre>{resumenTallas}</pre>
        <p><strong>Total a Pagar:</strong> S/ {total.toFixed(2)}</p>
      </div>
    );

    setOrderSummaryContent(resumen);
    setShowSummaryDialog(true); // Mostrar el diálogo
  };

  const sendEmail = async (emailContent) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailContent),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el correo.');
      }

    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Hubo un error al enviar el correo.');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      tallas: [{ talla: "", cantidad: 1 }],
    });
    setArchivos([]);
    setTotal(0);
    setShowSummaryDialog(false);
  };

  const ConfirmationDialog = () => (
    <div
      className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center relative"
      style={{ fontFamily: "'Nunito', sans-serif" }} // Aplicar fuente Nunito
    >
      <h2 className="text-2xl font-bold text-[#5B3571] mb-4">¡Felicidades!</h2>
      <h2 className="text-2xl font-bold text-[#5B3571] mb-4">¡Hemos recibido tu pedido!</h2>
      <p className="text-lg text-[#5B3571]">
        Te hemos enviado un correo electrónico con todos los detalles de tu pedido.
        Es posible que este correo te haya llegado a tu bandeja de no deseados.
      </p>
      <button
        onClick={() => setShowConfirmationDialog(false)}
        className="mt-6 bg-[#FFCE19] text-[#5B3571] py-2 px-4 rounded-full font-bold hover:bg-[#f0b517] transition-colors"
      >
        Cerrar
      </button>
    </div>
  );
  
  const handleConfirmOrder = async () => {
    console.log("Confirmando pedido...");
    
    try {

      setShowSummaryDialog(false);// Cerrar el diálogo de resumen
      setLoading(true); // Mostrar un indicador de carga (spinner)
      console.log("Subiendo archivos...");
  
      // Subir archivos adjuntos y obtener los URLs
      const documentUrls = await uploadFiles(archivos);
      console.log("URLs subidas:", documentUrls);

      if (documentUrls.length === 0) {
        console.error("No se pudieron subir los archivos");
        throw new Error("No se pudieron subir los archivos. Intenta nuevamente.");
      }

      // Obtener precios dinámicos
      const precios = calcularPrecios();

      // Definir el orden fijo de las tallas
      const ordenTallas = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

      // Ordenar las tallas del formulario según el orden definido
      const tallasOrdenadas = [...formData.tallas].sort(
        (a, b) => ordenTallas.indexOf(a.talla) - ordenTallas.indexOf(b.talla)
      );
  
      // Crear el objeto del pedido
      console.log("Preparando datos para guardar en Firestore...");
      const orderData = {
        date: new Date().toISOString(),
        name: formData.nombre,
        email: formData.correo,
        phone: parseInt(formData.telefono, 10),
        products: tallasOrdenadas.map((talla) => ({
          size: talla.talla,
          quantity: talla.cantidad,
        })),
        total: total.toFixed(2),
        documents: documentUrls,
        validated: false,
      };

      console.log("Guardando pedido en Firestore...");
      const orderId = await saveOrder(orderData); 
      console.log("Pedido guardado con ID:", orderId);
                   
      console.log("Enviando correo...");
      await sendEmail({
        to: formData.correo,
        subject: "Resumen de tu pedido",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <!-- Encabezado -->
            <div style="padding: 0;">
              <img src="https://firebasestorage.googleapis.com/v0/b/landing-tec.firebasestorage.app/o/headerreception.png?alt=media&token=7e753a9d-a56e-4175-9bcc-165d1ebc7e68" alt="Pedido Recepcionado" style="width: 100%; height: auto; display: block; margin: 0;">
            </div>
            
            <!-- Contenido -->
            <div style="padding: 20px;">
              <p style="font-size: 16px; text-align: left;">Hola, <strong>${formData.nombre}</strong>,</p>
              <p style="font-size: 16px; text-align: left; color: #000;">
                Hemos recibido tu pedido de <strong>${formData.tallas.reduce(
                  (sum, item) => sum + item.cantidad,
                  0
                )} polo(s)</strong>, con el siguiente detalle:
              </p>
              <p style="font-size: 16px; text-align: left;">ID del Pedido: <strong>${orderId}</strong></p>

              <!-- Tabla estilizada -->
              <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 20px; font-size: 16px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f5f5f5; border-bottom: 2px solid #784496;">
                    <th style="text-align: left; padding: 12px; color: #000;">Talla</th>
                    <th style="text-align: right; padding: 12px; color: #000;">Cantidad</th>
                    <th style="text-align: right; padding: 12px; color: #000;">Costo Unit.</th>
                    <th style="text-align: right; padding: 12px; color: #000;">Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${tallasOrdenadas
                    .map((talla) => {
                      const costoUnitario = precios[talla.talla] || 0; // Calcula el costo unitario
                      const subTotal = (costoUnitario * talla.cantidad).toFixed(2); // Calcula el subtotal
                      return `
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${talla.talla}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${talla.cantidad}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">S/ ${costoUnitario.toFixed(2)}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">S/ ${subTotal}</td>
                      </tr>
                    `;
                    })
                    .join("")}
                  <!-- Total -->
                  <tr style="background-color: #f9f9f9;">
                    <td colspan="3" style="padding: 12px; font-weight: bold; text-align: right; border-top: 2px solid #784496;">Total</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #784496;">S/ ${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Sección de archivos adjuntos -->
              <div style="margin-top: 20px;">
                <p style="font-size: 16px; font-weight: bold;">Archivos Adjuntos:</p>
                <ul style="padding-left: 20px; font-size: 16px; color: #000;">
                  ${documentUrls
                    .map(
                      (url, index) =>
                        `<li><a href="${url}" target="_blank" style="color: #784496; text-decoration: none;">Evidencia de pago 0${index + 1}</a></li>`
                    )
                    .join("")}
                </ul>
              </div>


              <!-- Información adicional -->
              <p style="font-size: 16px; margin-top: 20px; color: #000;">
                Pronto agregaremos tu número de teléfono <strong>${formData.telefono}</strong> a nuestro grupo oficial de WhatsApp.
              </p>
              <p style="font-size: 16px; color: #000;">
                En un lapso no mayor a <strong>3 días hábiles</strong>, validaremos si el archivo que nos adjuntaste coincide con el pago de <strong>S/ ${total.toFixed(
                  2
                )}</strong>. Recibirás un correo con la confirmación del pedido. <strong>Con ese correo se podrá recoger el pedido.</strong>
              </p>
              <p style="font-size: 16px; color: #000;">
                Ten en cuenta que la segunda semana de febrero estaremos informando cuándo y dónde serán las entregas de los polos. La comunicación será por nuestras redes sociales, correo electrónico y/o WhatsApp.
              </p>
            </div>

            <!-- Pie -->
            <div style="background-color: #784496; padding: 20px; text-align: center; color: #fff;">
              <p style="margin: 0; font-size: 14px;">Gracias por confiar en nosotros y prepárate para una experiencia inolvidable.</p>
              <p style="margin: 0; font-size: 16px; font-weight: bold;">Atentamente,<br><span style="font-size: 18px;">Equipo de Trujillo es Carnaval</span></p>
            </div>
          </div>
        `,
      });
      
      // Enviar correo al administrador
      console.log("Enviando correo al administrador...");
      const cantidadTotal = formData.tallas.reduce((sum, talla) => sum + talla.cantidad, 0);
      await sendEmail({
        to: "zavaleta.marvin@gmail.com", // Reemplaza con tu correo de administrador
        subject: `NUEVO PEDIDO DE ${cantidadTotal} POLOS`,
        body: `
          <p>Hemos recibido un nuevo pedido de <strong>${formData.nombre}</strong>.</p>
          <p>Total: <strong>S/ ${total.toFixed(2)}</strong></p>
        `,
      });

      console.log("Correos enviados.");

      // Muestra el diálogo de confirmación
      setShowConfirmationDialog(true);
      
      resetForm();
    } catch (error) {
      console.error("Error durante la confirmación:", error);
      toast.error("Error al procesar tu pedido. Intenta nuevamente.");
    } finally {
      setLoading(false); // Desactiva el spinner
    }
  };
  
  const handleCancelOrder = () => {
    // Cierra el modal del resumen del pedido sin enviar el correo
    setShowSummaryDialog(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    let isValid = true;
  
    // Validar que el nombre solo tenga letras
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!formData.nombre.trim()) {
      alert("Por favor, ingresa un nombre completo.");
      isValid = false;
    } else if (!nombreRegex.test(formData.nombre.trim())) {
      alert("El nombre debe contener solo letras y espacios.");
      isValid = false;
    }
  
    // Validar el formato del correo electrónico
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      alert("Por favor, ingresa un correo electrónico.");
      isValid = false;
    } else if (!correoRegex.test(formData.correo.trim())) {
      alert("Por favor, ingresa un correo electrónico válido.");
      isValid = false;
    }
  
    // Validar que el teléfono tenga 9 dígitos y comience con '9'
    const telefonoRegex = /^9\d{8}$/;
    if (!formData.telefono.trim()) {
      alert("Por favor, ingresa un número de WhatsApp.");
      isValid = false;
    } else if (!telefonoRegex.test(formData.telefono.trim())) {
      alert("El teléfono debe contener 9 dígitos y comenzar con 9.");
      isValid = false;
    }
  
    // Validar que todas las tallas seleccionadas sean válidas
    const tallasInvalidas = formData.tallas.some(
      (talla) => !talla.talla || talla.talla === "Seleccionar talla"
    );
    if (tallasInvalidas) {
      alert("Por favor, selecciona una talla válida para cada entrada.");
      isValid = false;
    }
  
    // Validar que al menos un archivo haya sido cargado
    if (archivos.length === 0) {
      alert("Por favor, adjunta al menos una evidencia de pago.");
      isValid = false;
    }
  
    // Si no es válido, detener el proceso
    if (!isValid) return;
  
    // Si todo es válido, mostrar el resumen
    handleSummaryDialog();
  };
  

  return (
    <section id="order-form" className="py-10 bg-gray-100 text-center">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 border-opacity-75"></div>
            <p className="text-yellow-400 text-2xl mt-4">Procesando...</p>
          </div>
        </div>
      )}
    <div className="max-w-2xl mx-auto bg-[#784496] text-white p-6 rounded-lg shadow-md font-nunito">
    <h2 className="text-4xl font-bold text-left relative mb-4">
          Ingresa tu pedido
          <span className="absolute left-0 bottom-[-4px] w-12 h-[3px] bg-yellow-400"></span>
        </h2>
      <form onSubmit={handleSubmit}>
          {/* Nombre completo */}
          <div className="mb-4 relative">
            <label htmlFor="nombre" className="block text-left font-medium">
              Nombre completo:
              <button
                type="button"
                onClick={() =>
                  handleOpenDialog(
                    "Por favor, ingresa el nombre completo de la persona que recogerá el pedido. Si no es posible, el pedido también podrá ser retirado utilizando el correo electrónico registrado."
                  )
                }
                className="ml-1 align-top text-yellow-400"
                style={{ fontSize: "14px" }}
              >
                <FiInfo />
              </button>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border rounded-lg text-black ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nombre && <p className="text-yellow-400 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Correo electrónico */}
          <div className="mb-4 relative">
            <label htmlFor="correo" className="block text-left font-medium">
              Correo electrónico:
              <button
                type="button"
                onClick={() =>
                  handleOpenDialog(
                    "Asegúrate de proporcionar un correo electrónico válido. Recibirás el resumen de tu pedido y la confirmación necesaria para realizar el retiro."
                  )
                }
                className="ml-1 align-top text-yellow-400"
                style={{ fontSize: "14px" }}
              >
                <FiInfo />
              </button>
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border rounded-lg text-black ${
                errors.correo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.correo && <p className="text-yellow-400 text-sm mt-1">{errors.correo}</p>}
          </div>

          {/* Teléfono */}
          <div className="mb-4 relative">
            <label htmlFor="telefono" className="block text-left font-medium">
              Teléfono (con WhatsApp):
              <button
                type="button"
                onClick={() =>
                  handleOpenDialog(
                    "Proporciona tu número de WhatsApp para recibir actualizaciones importantes sobre el estado de tu pedido y otros detalles relevantes del evento. El número debe ser de 9 dígitos y no incluir el +51."
                  )
                }
                className="ml-1 align-top text-yellow-400"
                style={{ fontSize: "14px" }}
              >
                <FiInfo />
              </button>
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border rounded-lg text-black ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.telefono && <p className="text-yellow-400 text-sm mt-1">{errors.telefono}</p>}
          </div>

        {/* Sección de tallas */}
        <div>
            {/* Encabezados de las columnas */}
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center mb-2">
              <span className="self-center text-left font-medium flex items-center">
                  Talla:
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenDialog(
                        "Las tallas son estándar y unisex, ten en cuenta que este polo se va a mojar y pintar."
                      )
                    }
                    className="ml-1 align-top text-yellow-400"
                    style={{ fontSize: "14px" }}
                  >
                    <FiInfo />
                  </button>
              </span>
              <span className="self-center text-left font-medium">Cantidad:</span>
              <span className="text-left font-medium"></span>
          </div>

            {/* Inputs de tallas y cantidades */}
            {formData.tallas.map((tallaItem, index) => (
                <div
                key={index}
                className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-4 items-center"
                >
                {/* Selector de tallas */}
                <select
                    value={tallaItem.talla}
                    onChange={(e) =>
                    handleTallaChange(index, "talla", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-black"
                >
                    <option value="" disabled>
                    Seleccionar talla
                    </option>
                    {obtenerOpcionesDisponibles(index).map((opcion) => (
                    <option key={opcion} value={opcion}>
                        {opcion}
                    </option>
                    ))}
                </select>

                {/* Input de cantidad */}
                <input
                    type="number"
                    value={tallaItem.cantidad}
                    onChange={(e) =>
                    handleTallaChange(index, "cantidad", parseInt(e.target.value))
                    }
                    className="w-full p-2 border rounded-lg text-black"
                    min="1"
                    max="99"
                />

                {/* Botón de eliminar talla */}
                {formData.tallas.length > 1 && (
                    <button
                    type="button"
                    onClick={() => eliminarTalla(index)}
                    className="text-white hover:text-red-500 flex justify-center"
                    >
                    <FiTrash2 size={20} />
                    </button>
                )}
                </div>
            ))}

            {/* Botón para agregar más tallas */}
            <div className="flex justify-start mt-4">
                {formData.tallas.length < 7 && (
                <button
                    type="button"
                    onClick={agregarTalla}
                    className="flex items-center justify-center w-8 h-8 bg-white text-[#784496] rounded-full shadow-md hover:bg-[#784496] hover:text-white transition-colors"
                >
                    <AiOutlinePlus size={16} />
                </button>
                )}
            </div>
        </div>


        <p className="text-left mt-4 font-bold text-2xl">
            Total a Pagar:{" "}
            <span className="text-yellow-300">S/ {total.toFixed(2)}</span>
        </p>

        {/* Texto adicional */}
        <p className="text-left mt-2 font-medium text-lg">
            Hacer los pagos en:
        </p>      

        {/* YAPE */}
        <div className="flex items-center mt-2">
            <p className="text-left text-gray-300">
                <span className="font-bold">YAPE:</span> 906401395
            </p>
            <button
                onClick={() => navigator.clipboard.writeText("906401395")}
                className="ml-2 text-yellow-400 hover:text-yellow-600"
                title="Copiar número"
            >
                <FiCopy />
            </button>
        </div>

        {/* BCP */}
        <div className="flex items-center mt-1 leading-tight">
            <p className="text-left text-gray-300">
                <span className="font-bold">BCP:</span> 570-73172806-0-79
            </p>
            <button
                onClick={() => navigator.clipboard.writeText("57073172806079")}
                className="ml-2 text-yellow-400 hover:text-yellow-600"
                title="Copiar número"
            >
                <FiCopy />
            </button>
        </div>

        {/* BCP CCI */}
        <div className="flex items-center mt-1 leading-tight">
            <p className="text-left text-gray-300">
                <span className="font-bold">BCP CCI:</span> 002-570-173172806-079-08
            </p>
            <button
                onClick={() => navigator.clipboard.writeText("00257017317280607908")}
                className="ml-2 text-yellow-400 hover:text-yellow-600" 
                title="Copiar número" 
            >
                <FiCopy />
            </button>
        </div>

        {/* Nombre */}
        <p className="text-left text-gray-300 mt-1 leading-tight">
            A nombre de <span className="font-bold">NESTOR ANDRÉS ZAVALETA CONTRERAS</span>
        </p>


        {/* Botón "Adjuntar evidencia de pago" */}
        <div className="mt-3 text-left">
            <button
            type="button"
            onClick={() => document.getElementById("fileInput").click()}
            className="bg-yellow-400 text-[#5B3571] py-3 px-6 rounded-full shadow-lg hover:bg-yellow-600 transition-colors text-lg font-bold"
            >
            Adjuntar evidencia de pago
            </button>
            <input
            type="file"
            id="fileInput"
            multiple
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            />
            <p className="text-sm text-gray-300 mt-2">
            Puede adjuntar hasta 5 archivos (PNG o JPG) con un tamaño máximo de 3MB cada
            uno.
            </p>

            <ul className="mt-4">
            {archivos.map((archivo, index) => (
                <li
                key={index}
                className="flex justify-between items-center mb-2 bg-[#5B3571] text-white p-2 rounded-lg"
                >
                <span className="truncate">{archivo.name}</span>
                <button
                    type="button"
                    onClick={() => eliminarArchivo(index)}
                    className="text-white hover:text-red-500 flex justify-center"
                >
                    <FiTrash2 size={20} />
                </button>
                </li>
            ))}
            </ul>
        </div>

        {/* Botón Enviar */}
        <button
          type="submit" // Cambia a submit para que use el evento onSubmit
          className="w-full mt-6 bg-yellow-400 text-[#5B3571] font-bold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 text-2xl"
        >
          Enviar Pedido
        </button>
      </form>
    </div>

    {/* Modal/Dialog */}
    {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md relative">
            <button
              onClick={handleCloseDialog}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              X
            </button>
            {dialogContent}
          </div>
        </div>
      )}

    {/* Modal/Dialog de Resumen del Pedido */}
    {showSummaryDialog && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md relative font-nunito">
          <button
            onClick={handleCancelOrder}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
          {orderSummaryContent}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCancelOrder}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmOrder}
              className="bg-yellow-400 text-[#5B3571] py-2 px-4 rounded-md hover:bg-yellow-500"
            >
              Confirmar y Enviar
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal/Dialog de Pedido enviado */}
    {showConfirmationDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <ConfirmationDialog />
      </div>
    )}
    </section>
  );
};

export default OrderForm;
