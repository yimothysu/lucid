import { NextApiRequest, NextApiResponse } from 'next';
import { streamGPT3 } from '../../utils/call-openai';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const prompt = req.query.prompt as string;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendRegularData = setInterval(() => {
      console.log("haha what am i doing here")
    }, 1000);

    req.on('close', () => {
      clearInterval(sendRegularData);
      res.end();
    });

    try {
      for await (const chunk of streamGPT3(prompt)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        console.log("Streaming response written to response:", chunk);
        res.flushHeaders();
      }
      clearInterval(sendRegularData); // Clear the interval once done
      res.end();
    } catch (error) {
      console.error("Streaming error:", error);
      clearInterval(sendRegularData); // Clear the interval in case of error too
      res.write(`data: {"error": "Internal Server Error"}\n\n`);
      res.end();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
    res.end();
  }
};
