'use client'
import {useEffect, useState} from "react"
import { useParams } from "next/navigation";

export default function Subtitles () {
    
    const params = useParams()
    
    const [subtitles, setSubtitles] = useState(null);


    useEffect(() => {
        const fetchSubtitles = async (videoID = 'FSmCaprEcQM', lang = 'en') => {
          try {
            const response = await fetch(
              `/api/fetch-subtitles?videoID=${videoID}&lang=${lang}`
            );
            console.log("Here!")
            const data = await response.json();
            console.log(data);
            setSubtitles(data);
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
            {subtitles ? (
        <div>
          <h1>Subtitles</h1>
          <p>Subtitle 1: {JSON.stringify(subtitles)}</p>
          {/* Render other properties from data */}
        </div>
      ) : (
        <p>Loading subtitles...</p>
      )}
        </div>
    )
}