"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./video.module.css";
import { ArrowRight } from "react-feather";
import { addVideoQuestion, getVideoTimeStamps } from "@/app/firebase/firestore";
import "@/app/globals.css";
import { useRouter } from "next/router";

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
  timeStampItems: Timestamp[];
}

interface Timestamp {
  timestamp: number;
  question: string;
  answer: string;
}

function ProgressBar(props: ProgressBarProps) {
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
      {props.timeStampItems.map((timestamp) => (
        <div
          key={timestamp.timestamp}
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

  const [timeStamps, setTimeStamps] = useState<Timestamp[]>([]);

  const router: any = useParams();

  const { id } = router;

  useEffect(() => {
    getVideoTimeStamps(id).then((data) => {
      setTimeStamps(data);
    });
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    addVideoQuestion({
      videoId: id,
      question,
      answer,
      timestamp: elapsedTime,
    }).then(() => {
      setTimeStamps([
        ...timeStamps,
        { timestamp: elapsedTime, question, answer },
      ]);
    });
  };

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
            timeStampItems={timeStamps}
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
          <ArrowRight />
        </button>
      </form>
      {timeStamps &&
        timeStamps.map((pair, index) => {
          return (
            <QuestionAndAnswer
              key={`${question} ${index}`}
              question={pair.question}
              answer={pair.answer}
            />
          );
        })}
    </main>
  );
}
