export async function generateText(prompt: string) {
  const resp = await fetch("https://api.quotable.io/random");
  return resp.body!.toString();
}

export async function generateImage(prompt: string) {
  const resp = await fetch("https://api.quotable.io/random");
  return resp.body!.toString();
}

export async function downloadYoutubeLink(url: string) {
  const fs = require('fs');
  const ytdl = require('ytdl-core');
  ytdl(url).pipe(fs.createWriteStream('video.mp4'));
}
