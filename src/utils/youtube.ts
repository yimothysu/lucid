import { YoutubeTranscript } from 'youtube-transcript';

export async function returnTranscript(url: string) {
    return YoutubeTranscript.fetchTranscript(url);
  }
