// src/pages/TestAPIComponent.tsx

import { callGenerateText, callGenerateTextNonStreaming, callGenerateImage } from '../utils/api';
import { useState } from 'react';

function TestAPIComponent() {
    const [generatedText, setGeneratedText] = useState('');
    const [sendThingsResult, setSendThingsResult] = useState('');
    const [nonStreamingText, setNonStreamingText] = useState('');

    function testGenerateText() {
        const promptText = "What is a cow?";
        const es = callGenerateText(promptText);

        es.onmessage = function(event) {
            console.log(event.data)
            setGeneratedText(prevText => prevText + event.data);
        };

        es.onerror = function(event) {
            console.error("EventSource failed:", event);
            es.close();
        };
    }

    async function testGenerateTextNonStreaming() {
        const promptText = "What is a cow?";
        const response = await callGenerateTextNonStreaming(promptText);
        const data = await response.json();
        setNonStreamingText(data.text);
    }

    function testSendThings() {
        const es = new EventSource(`/api/sendThings`);

        es.onmessage = function(event) {
            console.log(event.data);
            setSendThingsResult(prevResult => prevResult + event.data);
        };

        es.onerror = function(event) {
            console.error("EventSource failed:", event);
            es.close();
        };
    }

    async function testGenerateImage() {
        const prompt = "Generate an image of a sunset.";
        const imageUrl = await callGenerateImage(prompt);
        console.log("Image URL:", imageUrl);
    }

    return (
        <div>
            <button onClick={testGenerateText}>Test Generate Text</button>
            <button onClick={testGenerateTextNonStreaming}>Test Generate Text Non-Streaming</button>
            <button onClick={testGenerateImage}>Test Generate Image</button>
            <button onClick={testSendThings}>Test Send Things</button>
            <p>{generatedText}</p>
            <p>{nonStreamingText}</p>
            <p>{sendThingsResult}</p>
        </div>
    );
}

export default TestAPIComponent;
