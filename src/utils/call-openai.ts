import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to call GPT-3 and return output
export async function callGPT3(question: string) {
  console.log("About to send non-streaming question: ", question)
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0].message.content;
}

// Function for streaming the output.
export async function* streamGPT3(question: string) {
  console.log("About to send streaming question: ", question)
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        stream: true, 
    });
    for await (const part of stream) {
        yield part.choices[0]?.delta?.content;
        console.log("I just yielded a part of the stream: ", part.choices[0]?.delta?.content)
    }
}

// Function to generate image using DALL-E
export async function generateImage(prompt: string) {
  const response = await openai.images.generate({
    prompt: prompt,
    n: 1,
    size: "256x256",
  });
  console.log("Image URL: ", response.data[0].url)
  return response.data[0].url;
}
