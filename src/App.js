import React, { useState, useRef } from "react";
import axios from "axios";
import Recorder from "./components/Recorder";

function App() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Crea una referencia para el objeto Audio
  const audioRef = useRef(null);

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob);
  };

  const sendAudio = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.wav");
    console.log("Tipo de archivo:", audioBlob.type);
    console.log("Tamaño del archivo:", audioBlob.size); // Agrega esta línea

    try {
      // const response = await axios.post("https://bookish-barnacle-v6v69pvx7ww2p6r6-8000.app.github.dev/transcribe/", formData, {
      const response = await axios.post("http://localhost:8000/transcribe/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Obtiene la ruta del archivo de audio de la respuesta
      const audioPath = response.data.audio_path;

      // Construye la URL completa del archivo de audio
      const audioURL = `http://localhost:8000${audioPath}`; // Incluye el puerto del backend

      // Crea un nuevo objeto Audio y guárdalo en la referencia
      audioRef.current = new Audio(audioURL); 

      audioRef.current.play();
    } catch (error) {
      console.error("Error al enviar el audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para detener la reproducción
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reinicia la posición del audio
    }
  };

  return (
    <div>
      <Recorder onRecordingComplete={handleRecordingComplete} />
      {audioBlob && (
        <button onClick={sendAudio} disabled={isLoading}>
          Enviar audio
        </button>
      )}
      {/* Agrega el botón para detener el audio */}
      {audioRef.current && audioRef.current.currentTime > 0 && ( 
        <button onClick={stopAudio}>
          Detener audio
        </button>
      )}
      {isLoading && <p>Procesando...</p>}
    </div>
  );
}

export default App;