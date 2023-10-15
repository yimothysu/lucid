import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// Backend functions!
// Function to directly call GPT-3 and return output
export async function callGPT3(question: string) {
  console.log("About to send non-streaming question: ", question)
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0].message.content;
}

// Function to directly call GPT-3 and return streamed output
export async function* streamGPT3(question: string) {
  console.log("About to ask GPT about: ", question)
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        stream: true, 
    });
    for await (const part of stream) {
      if(part.choices[0]?.delta?.content !== undefined) {
          yield part.choices[0]?.delta?.content;
      }
  }
  
}

// Function to directly call DALL-E and return link to image
export async function callDALLE(prompt: string) {
  const response = await openai.images.generate({
    prompt: prompt,
    n: 1,
    size: "256x256",
  });
  console.log("Image URL: ", response.data[0].url)
  return response.data[0].url;
}
