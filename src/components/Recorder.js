import React, { useState, useRef } from "react";

function Recorder({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();
        setRecording(true);

        const audioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const blob = new Blob(audioChunks, { type: "audio/wav" });
          onRecordingComplete(blob);
        };
      });
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Detener grabación" : "Iniciar grabación"}
      </button>
    </div>
  );
}

export default Recorder;