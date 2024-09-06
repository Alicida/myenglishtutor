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

    try {
      const response = await axios.post("https://bookish-barnacle-v6v69pvx7ww2p6r6-8000.app.github.dev/transcribe/", formData, {
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