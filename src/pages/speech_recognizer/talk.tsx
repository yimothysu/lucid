"use client";

// Import necessary libraries
import styles from '../../app/page.module.css'
import { useState, useEffect } from "react";

// This is the main component of our application
export default function Home() {
  // Define state variables for the result, recording status, and media recorder
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // This array will hold the audio data
  let chunks : BlobPart[] = [];
  // This useEffect hook sets up the media recorder when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const newMediaRecorder = new MediaRecorder(stream);
          newMediaRecorder.onstart = () => {
            chunks = [];
          };
          newMediaRecorder.ondataavailable = e => {
            chunks.push(e.data);
          };
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onerror = function (err) {
              console.error('Error playing audio:', err);
            };
            audio.play();
            try {
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = async function () {
                if(reader.result)
                {
                  const base64Audio = (reader.result as string).split(',')[1]; // Remove the data URL prefix
                  const response = await fetch("/api/speechToText", {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ audio: base64Audio }),
                });
                console.log("here1")
                const data = await response.json();
                console.log(data)
                console.log("here2")
                if (response.status !== 200) {
                  throw data.error || new Error(`Request failed with status ${response.status}`);
                }
                setResult(data.message);
                }
                else
                {
                  console.error('Reader result is null');
                }
              }
            } catch (error) {
              if (error instanceof Error) {
                console.error(error);
                alert(error.message);
              } else {
                console.error(error);
              }
            }
          };
          setMediaRecorder(newMediaRecorder);
        })
        .catch(err => console.error('Error accessing microphone:', err));
    }
  }, []);
  // Function to start recording
  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };
  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };
  // Render the component
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h2>
          Convert audio to text <span>-&gt;</span>
        </h2>
        <button onClick={recording ? stopRecording : startRecording} >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <p>{result}</p>
      </div>
    </main>
  )
}