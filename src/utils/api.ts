/**
 * callGenerateText - Function to generate text using EventSource
 * @param {string} promptText - The prompt text to generate text from
 * @returns {EventSource} - The EventSource object
 */

export async function callGenerateTextNonStreaming(promptText: string): Promise<Response> {
    const response = await fetch('/api/generateText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
    });

    return response;
}

export async function callGenerateText(promptText: string) {
    const es = new EventSource(`/api/generateText?prompt=${encodeURIComponent(promptText)}`);
    return es;
}
 
/**
 * callGenerateImage - Function to generate image using fetch API
 * @param {string} prompt - The prompt text to generate image from
 * @returns {Promise<string>} - The Promise object represents the URL of the generated image
 */
export async function callGenerateImage(prompt: string) {
    const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        console.error('Error occurred:', await response.text());
        return;
    }

    const { imageUrl } = await response.json();
    return imageUrl;
}