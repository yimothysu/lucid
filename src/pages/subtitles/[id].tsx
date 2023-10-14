'use client'
import {useEffect} from "react"
import { useParams } from "next/navigation";

export default function Subtitles () {
    
    const params = useParams()

    if (!params || Array.isArray(params)) {
        return (
            <div>

            </div>
        )
    }

    useEffect(() => {
        const fetchSubtitles = async (videoID = 'FSmCaprEcQM', lang = 'en') => {
          try {
            const response = await fetch(
              `/api/fetch-subtitles?videoID=${videoID}&lang=${lang}`
            );
            console.log("Here!")
            const data = await response.json();
            console.log(data);
            // setSubtitles(data.subtitles);
            // setVideoDetails(data.videoDetails);
          } catch (error) {
            console.error('Error fetching subtitles:', error);
          }
        };
    
        fetchSubtitles();
      }, []);

    return (
        <div>
            So What is a man
        </div>
    )
}