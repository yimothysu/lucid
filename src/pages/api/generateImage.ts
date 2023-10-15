import { NextApiRequest, NextApiResponse } from 'next';
import { callDALLE } from '../../utils/call-openai';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { prompt, size = "1024x1024" } = req.body;
      if (!["256x256", "512x512", "1024x1024"].includes(size)) {
        throw new Error("Invalid size parameter");
      }
      const imageUrl = await callDALLE(prompt, size);
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
