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
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

ytdl(url)
  .pipe(fs.createWriteStream('video.mp4'));
}
