import { callGPT3 } from '../../utils/api';

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const text = await callGPT3(req.body.prompt);
      res.status(200).json({ text });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
