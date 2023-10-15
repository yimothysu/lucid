import { NextApiRequest, NextApiResponse } from 'next';
import { callDALLE } from '../../utils/call-openai';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const imageUrl = await callDALLE(req.body.prompt);
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
