import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import styles from "./video.module.css";
import {
  addVideoQuestion,
  getVideoQuestionAnswer,
} from "@/app/firebase/firestore";
import "@/app/globals.css";

interface QuestionAndAnswerProps {
  question: string;
  answer: string;
}

function QuestionAndAnswer(props: QuestionAndAnswerProps) {
  return (
    <div className={styles.questionAndAnswer}>
      <div className={styles.question}>Question</div>
      <div className={styles.questionText}>{props.question}</div>
      <div className={styles.answer}>Answer</div>
      <div className={styles.answerText}>{props.answer}</div>
    </div>
  );
}

export default function Video() {
  const [player, setPlayer] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [question, setQuestion] = useState<string>("Question");
  const [answer, setAnswer] = useState<string>("Answer");

  const [questionResp, setQuestionResp] = useState<string[]>([]);
  const [answerResp, setAnswerResp] = useState<string[]>([]);

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
    return <div>Loading...</div>;
  }

  if (Array.isArray(params.id)) {
    return <div>WTF</div>;
  }

  const { id } = params;
  const handleStateChange = (event: any) => {
    // Store the player object for future use
    setPlayer(event.target);

    // Get the elapsed time and update state
    const currentTime = Math.floor(event.target.getCurrentTime());
    setElapsedTime(currentTime);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    addVideoQuestion({
      videoId: id,
      question,
      answer,
      timestamp: elapsedTime,
    }).then(() => {});
  };

  function onGetQA() {
    return getVideoQuestionAnswer(id, elapsedTime).then((data) => {
      setQuestionResp(data.question);
      setAnswerResp(data.answer);
    });
  }

  return (
    <main>
      <YouTube videoId={id} onStateChange={handleStateChange} />
      <form className={styles.answerForm} onSubmit={onSubmit}>
        <label>
          Question
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <label>
          Answer
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <input
        type="button"
        value="Show Questions"
        onClick={() => {
          onGetQA();
        }}
        style={{ marginTop: "20px" }}
      />
      {questionResp &&
        questionResp.length === answerResp.length &&
        questionResp.map((question, index) => {
          return (
            <QuestionAndAnswer
              key={`${question} ${index}`}
              question={question}
              answer={answerResp[index]}
            />
          );
        })}
    </main>
  );
}
