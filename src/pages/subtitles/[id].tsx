'use client'
import {useEffect, useState} from "react"
import { useParams } from "next/navigation";

type subItem = {
    start: string,
    dur: string,
    text: string
}

type subItems = {
    subtitles: subItem[]
}

export default function Subtitles () {
    
    const params = useParams()


    if (!params) {
        return <div>Loading...</div>;
    }
    const { id } = params;
    
    const [subtitles, setSubtitles] = useState<subItems>();


    useEffect(() => {
        const fetchSubtitles = async (videoID = id, lang = 'en') => {
          try {
            const response = await fetch(
              `/api/fetch-subtitles?videoID=${videoID}&lang=${lang}`
            );
            console.log("Here!")
            const data = await response.json();
            console.log(data);

            setSubtitles(data);
    
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
          <h1>Subtitles: 
          {subtitles.subtitles.map((subtitle, index) => (
          <span key={index}>{subtitle.text} </span>))} </h1>
          
        </div>
      ) : (
        <p>Loading subtitles...</p>
      )}
        </div>
    )
}


