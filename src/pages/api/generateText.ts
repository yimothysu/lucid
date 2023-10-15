import { NextApiRequest, NextApiResponse } from 'next';
import { streamGPT3, callGPT3 } from '../../utils/call-openai';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let prompt: string;
  if (req.method === 'GET') {
    prompt = req.query.prompt as string;
    try {
      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // Call the streamGPT3 function, and send chunks as they arrive
      for await (const chunk of streamGPT3(prompt)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        console.log("Streaming response written to response: ", chunk);
        res.flushHeaders(); // Important for some hosting platforms
      }

      res.write("data: JimSu123!\n\n")
      res.end();
    } catch (error) {
      console.error("Streaming error:", error);
      res.write(`data: {"error": "Internal Server Error"}\n\n`);
      res.end();
    }
  } else if (req.method === 'POST') {
    prompt = req.body.prompt;
    try {
      const response = await callGPT3(prompt);
      res.status(200).json({ data: response });
    } catch (error) {
      console.error("Error in callGPT3:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};