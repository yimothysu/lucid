// src/pages/TestAPIComponent.tsx

import {
  callGenerateText,
  callGenerateTextNonStreaming,
  callGenerateImage,
} from "../utils/api";
import { useState } from "react";

function TestAPIComponent() {
  const [generatedText, setGeneratedText] = useState("");
  const [sendThingsResult, setSendThingsResult] = useState("");
  const [nonStreamingText, setNonStreamingText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function testGenerateText() {
    const promptText = "What is a cow?";
    const es = await callGenerateText(promptText);

    es.onmessage = function (event) {
      console.log(event.data);
      setGeneratedText((prevText) => prevText + event.data);
    };

    es.onerror = function (event) {
      console.error("EventSource failed:", event);
      es.close();
    };
  }

  function testSendThings() {
    const es = new EventSource(`/api/sendThings`);

    es.onmessage = function (event) {
      console.log(event.data);
      setSendThingsResult((prevResult) => prevResult + event.data);
    };

    es.onerror = function (event) {
      console.error("EventSource failed:", event);
      es.close();
    };
  }

  async function testGenerateImage() {
    const prompt =
      "Generate an image of a Jump Trading's headquarter in Chicago surrounded by gangsters who are wishing to enter. Make the image from a birds eye view from the chopper 6 skycam sponsored by Panrea(tm).";
    const imageUrl = await callGenerateImage(prompt, "1024x1024");
    console.log("Image URL:", imageUrl);
    setImageUrl(imageUrl);
  }

  return (
    <div>
      <button onClick={testGenerateText}>Test Generate Text</button>
      <button onClick={testGenerateImage}>Test Generate Image</button>
      <button onClick={testSendThings}>Test Send Things</button>
      <p>{generatedText}</p>
      <p>{sendThingsResult}</p>
      {imageUrl && <img src={imageUrl} alt="Generated image" />}
    </div>
  );
}

export default TestAPIComponent;
