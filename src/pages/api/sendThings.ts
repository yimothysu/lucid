import { NextApiRequest, NextApiResponse } from 'next';
import { streamGPT3 } from '../../utils/call-openai';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Send the headers before the stream starts

    // for await (const chunk of streamGPT3("Respond to this message with hello.")) {
    //    // res.write(`hello world!!!!!!!!!`);
    //   console.log("Streaming response written to response: ", chunk)
    //   }
      
    const sendHelloWorld = setInterval(() => {
        res.write(`data: Hello, world!\n\n`);
      }, 1000);
      
      res.write(`Done`);
    
    
      req.on('close', () => {
      // clearInterval(sendHelloWorld);
      res.end();
    });

  } else {
    res.status(405).json({ error: "Method not allowed" });
    res.end();
  }
};