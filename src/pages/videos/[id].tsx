"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./video.module.css";
import { ArrowRight } from "react-feather";
import { addVideoQuestion, getVideoTimeStamps } from "@/app/firebase/firestore";
import "@/app/globals.css";
import { useRouter } from "next/router";
import { callGenerateText } from "@/utils/api";
import Navbar from "@/app/components/navbar";

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
  start: string;
  dur: string;
  text: string;
};

type subItems = {
  subtitles: subItem[];
};

function whatToRender(intervalArray: any[], curTimeStamp: any) {
  let startIndex = -1;
  let endIndex = -1;

  for (let i = 0; i < intervalArray.length; i++) {
    if (
      curTimeStamp >= intervalArray[i].start - 30 &&
      curTimeStamp <= intervalArray[i].end + 10
    ) {
      if (startIndex === -1) {
        startIndex = i;
      }
      endIndex = i;
    }
  }

  return [startIndex, endIndex];
}

const Spinner = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" stroke-dasharray="63" stroke-dashoffset="21">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-dashoffset"
        dur="8s"
        repeatCount="indefinite"
        keyTimes="0; 0.5; 1"
        values="-16; -47; -16"
        calcMode="spline"
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
      />
    </circle>
  </svg>
);

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
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const [timeStamps, setTimeStamps] = useState<Timestamp[]>([]);

  const [subtitles, setSubtitles] = useState<subItems>();

  const [result, setResult] = useState();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  let chunks : BlobPart[] = [];

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

  const lang = "en";

  const fetchSubtitles = async (videoID = id) => {
    try {
      const response = await fetch(
        `/api/fetch-subtitles?videoID=${videoID}&lang=${lang}`
      );
      //console.log("Here!");
      const data = await response.json();
      //console.log(data);

      setSubtitles(data);
    } catch (error) {
      console.error("Error fetching subtitles:", error);
    }
  };

  fetchSubtitles();

  if (typeof window !== 'undefined') {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const newMediaRecorder = new MediaRecorder(stream);
        newMediaRecorder.onstart = () => {
            console.log("zoom!")
          chunks = [];
        };
        newMediaRecorder.ondataavailable = e => {
          chunks.push(e.data);
        };
        newMediaRecorder.onstop = async () => {
            console.log("I have stop")
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.onerror = function (err) {
            console.error('Error playing audio:', err);
          };
          audio.play();
          try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async function () {
              if(reader.result)
              {
                const base64Audio = (reader.result as string).split(',')[1]; // Remove the data URL prefix
                const response = await fetch("/api/speechToText", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ audio: base64Audio }),
              });
              console.log("here1")
              const data = await response.json();
              console.log(data)
              console.log("here2")
              if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
              }
              setResult(data.message);
              }
              else
              {
                console.error('Reader result is null');
              }
            }
          } catch (error) {
            if (error instanceof Error) {
              console.error(error);
              alert(error.message);
            } else {
              console.error(error);
            }
          }
        };
        setMediaRecorder(newMediaRecorder);
      })
      .catch(err => console.error('Error accessing microphone:', err));
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!videoId || Array.isArray(videoId)) {
      return;
    }

    setSubmitting(true);
    let llmAnswer = "";
    const es = await callGenerateText(question);
    es.onmessage = async (event) => {
      if (event.data === "JimSu123!") {
        const titleResp = await fetch(`/api/ytTitle?videoId=${id}`);
        const title = await titleResp.text();
        const cleanedTitle = title.substring(1, title.length - 1);

        addVideoQuestion({
          videoId: videoId,
          question,
          answer: llmAnswer,
          timestamp: elapsedTime,
          title: cleanedTitle,
        }).then(() => {
          setTimeStamps([
            ...timeStamps,
            { timestamp: elapsedTime, question, answer: llmAnswer },
          ]);
        });
        setSubmitting(false);
        setQuestion("");
        setCurrentQuestion(question);
        setCurrentAnswer(llmAnswer);

        es.close();
        return;
      }

      // The event object contains the data sent by the server
      const eventData = JSON.parse(event.data);
      llmAnswer += eventData;
      //console.log("Received event:", eventData);

      // You can update your UI or perform other actions based on the received data
    };
    // for await (const part of stream) {
    //   llmAnswer += part;
    //   console.log(llmAnswer);
    // }
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
    setElapsedTime(timestamp.timestamp);
    setProgress(timestamp.timestamp);
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

  const startRecording = () => {
    if (mediaRecorder) {
        console.log("I am on");
      mediaRecorder.start();
      setRecording(true);
    }
  };
  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
        console.log("I am off");
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  //console.log(intervals);

  return (
    <main className={styles.main}>
      <Navbar />
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
          <div className="info-box">
            <textarea
              value={subtitles?.subtitles
                .filter((subtitle, index) => {
                  const [startIndex, endIndex] = whatToRender(
                    intervals,
                    elapsedTime
                  );
                  return index >= startIndex && index <= endIndex;
                })
                .map((subtitle) => subtitle.text.replace(/\[.*\]/g, ""))
                .join(" ")}
              readOnly
              style={{
                width: "100%",
                height: "100px",
              }}
            />
          </div>
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
          {submitting ? <Spinner /> : <ArrowRight />}
        </button>
        <div
          style={{
            marginTop: "1rem",
          }}
        ></div>
      </form>
      <button onClick={recording ? stopRecording : startRecording} >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <p>{result}</p>
    </main>
  );
}
