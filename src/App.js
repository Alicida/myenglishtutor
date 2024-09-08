import React, { useState } from "react";
import axios from "axios";
import Recorder from "./components/Recorder";

function App() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const audioURL = response.data.audio_path;
      const audio = new Audio(audioURL);
      audio.play();
    } catch (error) {
      console.error("Error al enviar el audio:", error);
    } finally {
      setIsLoading(false);
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
      {isLoading && <p>Procesando...</p>}
    </div>
  );
}

export default App;