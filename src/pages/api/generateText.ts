import { NextApiRequest, NextApiResponse } from 'next';
import { streamGPT3 } from '../../utils/api';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const prompt = req.query.prompt as string; // Sending the prompt as a query parameter

      // Call the streamGPT3 function, and send chunks as they arrive
      for await (const chunk of streamGPT3(prompt)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        res.flushHeaders(); // Important for some hosting platforms
      }

      res.end();
    } catch (error) {
      console.error("Streaming error:", error);
      res.write(`data: {"error": "Internal Server Error"}\n\n`);
      res.end();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
    res.end();
  }
};
