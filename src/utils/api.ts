import { default as fetch } from 'node-fetch';

const OPENAI_ENDPOINT = "https://api.openai.com/v1/engines/davinci/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function callGPT3(prompt: string) {
    const response = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 64,
          temperature: 0.9,
          top_p: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ["\n"]
        })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API call failed: ${response.statusText}`);
    }

    const data: any = await response.json();
    return data.choices[0].text;
}

export async function generateImage(prompt: string) {
  const resp = await fetch("https://api.quotable.io/random");
  return resp.body!.toString();
}
