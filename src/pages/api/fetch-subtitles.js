import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';

export default async function handler(req, res) {
    const { videoID } = req.query;
    const lang = 'en'; // Optional, default is 'en' (English)

  try {
    const subtitles = await getSubtitles({ videoID, lang }); // call this if you only need the subtitles
    const videoDetails = await getVideoDetails({ videoID, lang }); // call this if you need the video title and description, along with the subtitles
    res.status(200).json({ subtitles, videoDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}