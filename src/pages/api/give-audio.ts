import { NextApiRequest, NextApiResponse } from 'next';

const voice = require("elevenlabs-node");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const apiKey = "b765ae621b7da38b329758e6f42305eb";
    const voiceID = "ThT5KcBeYPX3keUQqHPh";  

    try {
      const ttsStream = await voice.textToSpeechStream(apiKey, voiceID, req.query.text as string);
      let chunksAnswer: Buffer = Buffer.alloc(0);

      ttsStream.on('data', (chunk: any) => {
        chunksAnswer = Buffer.concat([chunksAnswer, chunk]);
      });

      ttsStream.on('end', () => {
        res.setHeader('Content-Type', 'audio/mp3');
        res.status(200).send(chunksAnswer);
      });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(404).send('Balls');
  }
};