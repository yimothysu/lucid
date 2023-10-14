import { useEffect, useState } from 'react';

export default function Transcript() {
    
    const MyComponent = () => {
        const [subtitles, setSubtitles] = useState([]);
        const [videoDetails, setVideoDetails] = useState({});
      
        const videoID = 'FSmCaprEcQM';
        const lang = 'en'; // Optional, default is 'en' (English)
      
        useEffect(() => {
            const fetchSubtitles = async (videoID = 'FSmCaprEcQM', lang = 'en') => {
              try {
                const response = await fetch(
                  `/api/fetch-subtitles?videoID=${videoID}&lang=${lang}`
                );
                const data = await response.json();
                setSubtitles(data.subtitles);
                setVideoDetails(data.videoDetails);
              } catch (error) {
                console.error('Error fetching subtitles:', error);
              }
            };
        
            fetchSubtitles(videoID, lang);
          }, [videoID, lang]);
          return (
            <main>
                {subtitles.map((subtitle, index) => (
                <p key={index}>{subtitle}</p>))}
            </main>
        )
      };
}