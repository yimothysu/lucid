// Import necessary libraries
import { OpenAI } from 'openai';
import { exec } from 'child_process';
import type { NextApiRequest, NextApiResponse } from 'next'
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream, promises as fsPromises } from 'fs';
import { join } from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';


ffmpeg.setFfmpegPath(ffmpegInstaller.path);
 
// Promisify the exec function from child_process
const util = require('util');
const execAsync = util.promisify(exec);
// Configure the OpenAI API client

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    // Process a POST request
     // Check if the OpenAI API key is configured

   
  // Extract the audio data from the request body
  const base64Audio = req.body.audio;
  // Convert the Base64 audio data back to a Buffer
  const audio = Buffer.from(base64Audio, 'base64');
  try {
    // Convert the audio data to text
    const text = await convertAudioToText(audio);
    // Return the transcribed text in the response
    return res.status(200).json({message: text});
  } catch(error: any) {
    // Handle any errors that occur during the request
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return res.status(500).json({ message: error.response.data });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return res.status(500).json({ message: "An error occurred during your request." });
    }
  }
  }
}


// This function converts audio data to text using the OpenAI API


async function convertAudioToText(audioData: Buffer) {
  // Convert the audio data to MP3 format
  const mp3AudioData = audioData;

  // Write the MP3 audio data to a temporary file
  const tempFilePath = join(".", 'temp.webm');
  await fsPromises.writeFile(tempFilePath, mp3AudioData);

  // Create a Readable stream from the temporary file
  const audioStream = fs.createReadStream("video4OkCZoSdYJ0.mp3");
  const audioStream2 = fs.createReadStream(tempFilePath);
  
  const response = await openai.audio.transcriptions.create(
    {
        file: audioStream2,
        model: 'whisper-1'
    }
  );

  // The API response contains the transcribed text
  const transcribedText = response.text;

  // Delete the temporary file
  await fsPromises.unlink(tempFilePath);

  return transcribedText;
}

// This function converts audio data to MP3 format using ffmpeg
/*async function convertAudioToMp3(audioData: Buffer): Promise<Buffer> {
   
    const inStream = new Readable();
    inStream.push(audioData);
    inStream.push(null);

    let outBuffer = Buffer.alloc(0);

    ffmpeg(inStream)
      .inputFormat('webm')
      .outputFormat('mp3')
      .on('end', () => console.log("FFmpeg has finished"))
      .on('error', (error)=> {
        console.log(error)
      })
      .on('data', (chunk: any) => {
        outBuffer = Buffer.concat([outBuffer, chunk]);
      })
     
    
      return outBuffer
}*/

/*
async function convertAudioToMp3(audioData: Buffer): Promise<Buffer> {
   
    const inStream = new Readable();
    inStream.push(audioData);
    inStream.push(null);

    let outBuffer = Buffer.alloc(0);

    return new Promise((resolve, reject) => {
        ffmpeg(inStream)
          .inputFormat('webm')
          .outputFormat('mp3')
          .on('end', () => {
            console.log("FFmpeg has finished");
            resolve(outBuffer);
          })
          .on('error', (error) => {
            console.log(error);
            reject(error);
          })
          .on('data', (chunk: any) => {
            outBuffer = Buffer.concat([outBuffer, chunk]);
          })
          .run();
      });
     
    
      return outBuffer
}*/