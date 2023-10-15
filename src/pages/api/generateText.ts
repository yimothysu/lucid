import { NextApiRequest, NextApiResponse } from "next";
import { streamGPT3 } from "../../utils/call-openai";

async function writeToStream(res: NextApiResponse, data: string) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  console.log("Streaming response written to response:", data);
  res.flushHeaders();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const prompt = req.query.prompt as string;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    req.on("close", () => {
      res.end();
    });

    try {
      const promises = [];
      for await (const chunk of streamGPT3(prompt)) {
        promises.push(writeToStream(res, chunk || ""));
      }
      await Promise.all(promises);
      await writeToStream(res, "JimSu123!");
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
}
