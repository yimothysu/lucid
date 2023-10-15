import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const title = (
        await ytdl.getInfo(
          `https://www.youtube.com/watch?v=${req.query.videoId}`
        )
      ).videoDetails.title;
      res.status(200).json(title);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Invalid videoId" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
