"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./video.module.css";
import { ArrowRight } from "react-feather";
import { addVideoQuestion, getVideoTimeStamps } from "@/app/firebase/firestore";
import "@/app/globals.css";
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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

type subItem = {
    start: string,
    dur: string,
    text: string
}

type subItems = {
    subtitles: subItem[]
}

function whatToRender(intervalArray : any[], curTimeStamp: any) {
    let startIndex = -1;
    let endIndex = -1;
  
    for (let i = 0; i < intervalArray.length; i++) {
      if (
        curTimeStamp >= intervalArray[i].start - 30 &&
        curTimeStamp <= intervalArray[i].end
      ) {
        if (startIndex === -1) {
          startIndex = i;
        }
        endIndex = i;
      }
    }
  
    return [startIndex, endIndex];
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

  const [subtitles, setSubtitles] = useState<subItems>();

  const router = useRouter();
  const { id } = router.query;
  const videoId = id;

  useEffect(() => {
    if (!videoId || Array.isArray(videoId)) {
      return;
    }
    getVideoTimeStamps(videoId).then((data) => {
      setTimeStamps(data);
    });
  }, [videoId]);

  if (!videoId) {
    return <main className={styles.main}></main>;
  }

    const lang = 'en'

  const fetchSubtitles = async (videoID = id) => {
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

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!videoId || Array.isArray(videoId)) {
      return;
    }
    addVideoQuestion({
      videoId: videoId,
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


  type Interval = {
    start: number;
    end: number;
  };
  
  const intervals: Interval[] = [];
  if (subtitles) {
    if (Array.isArray(subtitles.subtitles)) {
      const intervalSize = 15; // Number of subtitles per interval
  
      for (let i = 0; i <= subtitles.subtitles.length - intervalSize; i++) {
        const start = i === 0 ? 0 : parseFloat(subtitles.subtitles[i].start);
        const end = parseFloat(subtitles.subtitles[i + intervalSize - 1].start);
        const interval = { start, end };
        intervals.push(interval);
      }
    } else {
      console.log("zoom");
    }
  }
  
    console.log(intervals);

  

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
              key={`${index} ${pair.timestamp} ${pair.question}`}
              question={pair.question}
              answer={pair.answer}
            />
          );
        })}

    <html>
    <head>
    
    </head>
    <body>
    <div className="info-box">
    <TextField
      label="Read-only Text"
     
      value={
        subtitles?.subtitles
          .filter((subtitle, index) => {
            const [startIndex, endIndex] = whatToRender(intervals, elapsedTime);
            return index >= startIndex && index <= endIndex;
          })
          .map((subtitle) => subtitle.text.replace(/\[.*\]/g, ""))
          .join(" ")
      }
      InputProps={{
        readOnly: true,  // Makes the input read-only
        disableUnderline: true,  // Hides the underline
      }}
    />
    </div>
    </body>
    </html>
    </main>
  );
}
