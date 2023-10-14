import { useParams } from "next/navigation";
import { useState } from "react";
import ReactPlayer from "react-player";
import styles from "./video.module.css";
import FeatherIcon from "feather-icons-react";
import {
  addVideoQuestion,
  getVideoQuestionAnswer,
} from "@/app/firebase/firestore";
import "@/app/globals.css";

const PROGRESS_INTERVAL_MS = 500;

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

interface ProgressBarProps {
  progress: number;
  duration: number;
  onTimestampClick: (timestamp: Timestamp) => void;
  setProgress: (progress: number) => void;
}

interface Timestamp {
  timestamp: number;
  question: string;
  answer: string;
}

function ProgressBar(props: ProgressBarProps) {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([
    {
      timestamp: 100,
      question: "What is the meaning of life?",
      answer: "42",
    },
  ]);

  return (
    <div
      className={styles.progressBar}
      onClick={(e: React.MouseEvent) => {
        const progress =
          ((e.clientX - e.currentTarget.getBoundingClientRect().left) /
            e.currentTarget.clientWidth) *
          props.duration;
        props.setProgress(progress);
      }}
    >
      <div
        className={styles.progressBar__elapsed}
        style={{ width: (props.progress / props.duration) * 100 + "%" }}
      ></div>
      {timestamps.map((timestamp) => (
        <div
          className={styles.timestamp}
          style={{
            left: (timestamp.timestamp / props.duration) * 100 + "%",
          }}
          onClick={(e: any) => {
            props.onTimestampClick(timestamp);
            e.stopPropagation();
          }}
        ></div>
      ))}
    </div>
  );
}

export default function Video() {
  const [player, setPlayer] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("Answer");

  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const [questionResp, setQuestionResp] = useState<string[]>([]);
  const [answerResp, setAnswerResp] = useState<string[]>([]);

  const params = useParams();

  if (!params) {
    return <div>Loading...</div>;
  }

  if (Array.isArray(params.id)) {
    return <div>WTF</div>;
  }

  const { id } = params;

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

  const onReady = (player: any) => {
    setDuration(player.getDuration());
    setPlayer(player);
  };

  const onProgress = (progress: any) => {
    setElapsedTime(Math.floor(progress.playedSeconds));
  };

  const onTimestampClick = (timestamp: Timestamp) => {
    setCurrentQuestion(timestamp.question);
    setCurrentAnswer(timestamp.answer);
  };

  const setProgress = (time: number) => {
    player.seekTo(time);
  };

  return (
    <main className={styles.main}>
      <div className={styles.topPart}>
        <div className={styles.videoSection}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            progressInterval={PROGRESS_INTERVAL_MS}
            onProgress={onProgress}
            onReady={onReady}
            width="100%"
          />
          <ProgressBar
            progress={elapsedTime}
            duration={duration}
            onTimestampClick={onTimestampClick}
            setProgress={setProgress}
          />
        </div>
        <div className={styles.currentQuestionSection}>
          {currentQuestion && currentAnswer ? (
            <>
              <div className={styles.currentQuestion}>Current Question</div>
              <div className={styles.currentQuestionText}>
                {currentQuestion}
              </div>
              <div className={styles.currentAnswer}>Current Answer</div>
              <div className={styles.currentAnswerText}>{currentAnswer}</div>
            </>
          ) : (
            <div>Click on the progress bar to see questions and answers</div>
          )}
        </div>
      </div>
      <form className={styles.questionForm} onSubmit={onSubmit}>
        <label htmlFor="question" className={styles.questionLabel}>
          Ask a Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={styles.questionInput}
          placeholder="Question"
        />
        <button type="submit" className={styles.questionSubmit}>
          <FeatherIcon icon="arrow-right" />
        </button>
      </form>
      <input
        type="button"
        value="Show Questions"
        onClick={() => {
          onGetQA();
        }}
        className={styles.showQuestions}
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
