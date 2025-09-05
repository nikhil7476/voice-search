// import React from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// const VoiceSearch = () => {
//   const { transcript, listening } = useSpeechRecognition();

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     return <p>Sorry, your browser does not support speech recognition.</p>;
//   }

//   return (
//     <div>
//       <button onClick={SpeechRecognition.startListening}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <p>{listening ? 'Listening...' : 'Click "Start" to start listening'}</p>
//       <p>{transcript}</p>
//     </div>
//   );
// };

// export default VoiceSearch;

import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaMicrophone, FaMicrophoneSlash, FaCopy } from "react-icons/fa";

const VoiceSearch = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [autoStopTimeout, setAutoStopTimeout] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (listening) {
      if (autoStopTimeout) clearTimeout(autoStopTimeout);
      const timeout = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 10000); // stop after 10s of inactivity
      setAutoStopTimeout(timeout);
    }
    return () => clearTimeout(autoStopTimeout);
  }, [transcript]);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500">
        Sorry, your browser does not support speech recognition.
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <button
          onClick={() => SpeechRecognition.startListening({ continuous: true })}
          style={styles.button}
          title="Start Listening"
        >
          <FaMicrophone color={listening ? "red" : "black"} />
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          style={styles.button}
          title="Stop Listening"
        >
          <FaMicrophoneSlash />
        </button>
        <button onClick={resetTranscript} style={styles.button} title="Clear">
          Clear
        </button>
        <button
          onClick={handleCopy}
          style={styles.button}
          title="Copy to Clipboard"
        >
          <FaCopy />
        </button>
      </div>
      <p style={styles.status}>
        {listening ? "Listening..." : "Click the mic to speak"}
      </p>
      <div style={styles.transcriptBox}>
        {transcript || (
          <span style={{ color: "#999" }}>Transcript will appear here...</span>
        )}
      </div>
      {copied && <p style={{ color: "green" }}>Copied!</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1.5rem",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "1rem",
  },
  button: {
    padding: "10px",
    fontSize: "1.2rem",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "white",
  },
  status: {
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  transcriptBox: {
    minHeight: "60px",
    padding: "10px",
    background: "#f9f9f9",
    borderRadius: "6px",
    border: "1px solid #eee",
    fontSize: "1rem",
    textAlign: "left",
  },
};

export default VoiceSearch;
