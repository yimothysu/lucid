import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube"
import styles from "./video.module.css"

interface QuestionAndAnswerProps {
    question: string;
    answer: string;
}

function QuestionAndAnswer(props: QuestionAndAnswerProps) {
    return <div className={styles.questionAndAnswer}>
        <div className={styles.question}>Question</div>
        <div className={styles.questionText}>{props.question}</div>
        <div className={styles.answer}>Answer</div>
        <div className={styles.answerText}>{props.answer}</div>
    </div>
}

export default function Video() {
    const [player, setPlayer] = useState<any>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [question, setQuestion] = useState<string>("Question")
    const [answer, setAnswer] = useState<string>("Answer")

    const handleStateChange = (event: any) => {
        // Store the player object for future use
        setPlayer(event.target);

        // Get the elapsed time and update state
        const currentTime = Math.floor(event.target.getCurrentTime());
        setElapsedTime(currentTime);
    };

    useEffect(() => {
        let timer: any;
        // player.getPlayerState() === 1 means the video is playing
        if (player && player.getPlayerState() === 1) {
            // Poll to get the elapsed time every second
            timer = setInterval(() => {
                const currentTime = Math.floor(player.getCurrentTime());
                setElapsedTime(currentTime);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [player]);

    const params = useParams();
    if (!params) {
        return <div>Loading...</div>
    }
    if (Array.isArray(params.id)) {
        return <div>WTF</div>
    }

    const { id } = params;
    console.log(styles)

    return (
        <main>
            <YouTube videoId={id} onStateChange={handleStateChange} />
            <QuestionAndAnswer question={question} answer={answer} />
        </main>
    )
}