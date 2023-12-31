"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./video.module.css";
import { ArrowRight, Mic, MicOff } from "react-feather";
import { addVideoQuestion, getVideoTimeStamps } from "@/app/firebase/firestore";
import "@/app/globals.css";
import { useRouter } from "next/router";
import { callGenerateText } from "@/utils/api";
import Navbar from "@/app/components/navbar";
import Avatar from "react-avatar";
// @ts-ignore
import { LiveAudioVisualizer } from "react-audio-visualize";
import Head from "next/head";
import Footer from "@/app/components/footer";

const PROGRESS_INTERVAL_MS = 500;

function QuestionAnswerPair(props: {
  question: string;
  answer?: string;
  submitting: boolean;
}) {
  return (
    <div className={styles.questionAnswerPair}>
      <div className={styles.entry}>
        <Avatar
          style={{ aspectRatio: 1 }}
          size="50"
          round={true}
          src="https://graph.facebook.com/100008343750912/picture?width=300&height=300"
        />
        <div className="entryRight">
          <div className={styles.currentQuestion}>Student</div>
          <div className={styles.currentQuestionText}>{props.question}</div>
        </div>
      </div>
      <div className={styles.entry}>
        <Avatar
          style={{ aspectRatio: 1 }}
          size="50"
          round={true}
          src="https://cdn-icons-png.flaticon.com/512/1624/1624640.png"
        />
        <div className="entryRight">
          <div className={styles.currentAnswer}>AI</div>
          <div className={styles.currentAnswerText}>
            {props.answer ? (
              props.answer
            ) : props.submitting ? (
              <i>Generating...</i>
            ) : (
              <i>
                An error occurred while generating an answer to these questions.
              </i>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const augmentPrompt = (
  context: string,
  title: string,
  question: string,
  currentQuestions: string[],
  currentAnswers: string[]
) => {
  // Code to concatenate or format currentQuestions and currentAnswers into a single string, previousQA
  const previousQA = currentQuestions
    .map((q, index) => `Q: ${q}\nA: ${currentAnswers[index] || "Pending"}`)
    .join("\n");

  return `
    I am a university student studying a lecture video titled ${title}. 
    I have included the video title and partial transcript for context on what I read.
    ---
    Transcript:
    ${context}
    ---
    Here is my previous conversation with my professor.
    ${previousQA}
    ---
    Please answer my following question.
    Question:
    ${question}
    ---
    Answer:
  `;
};

const fetchTitle = async (id: string) => {
  const titleResp = await fetch(`/api/ytTitle?videoId=${id}`);
  const title = await titleResp.text();
  const cleanedTitle = title.substring(1, title.length - 1);
  return cleanedTitle;
};

const filterSubtitles = (
  subtitles: any,
  intervals: any[],
  elapsedTime: number
) => {
  return subtitles?.subtitles
    .filter((subtitle: any, index: any) => {
      const [startIndex, endIndex] = whatToRender(intervals, elapsedTime);
      return index >= startIndex && index <= endIndex;
    })
    .map((subtitle: any) => subtitle.text.replace(/\[.*\]/g, ""))
    .join(" ");
};

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
  userTime: number;
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" strokeDasharray="63" strokeDashoffset="21">
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

  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);

  const [lastActiveTimestamp, setLastActiveTimestamp] = useState<number | null>(
    null
  );

  const [timeStamps, setTimeStamps] = useState<Timestamp[]>([]);

  const [subtitles, setSubtitles] = useState<subItems>();
  const [title, setTitle] = useState<string>("");

  // Define state variables for the result, recording status, and media recorder
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // This array will hold the audio data
  let chunks: BlobPart[] = [];
  // This useEffect hook sets up the media recorder when the component mounts

  const router = useRouter();
  const { id } = router.query;
  const videoId = id;

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          newMediaRecorder.onstart = () => {
            chunks = [];
          };
          newMediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onerror = function (err) {
              console.error("Error playing audio:", err);
            };
            //audio.play();
            try {
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = async function () {
                if (reader.result) {
                  const base64Audio = (reader.result as string).split(",")[1]; // Remove the data URL prefix
                  const response = await fetch("/api/speechToText", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ audio: base64Audio }),
                  });
                  const data = await response.json();
                  console.log(data);
                  if (response.status !== 200) {
                    throw (
                      data.error ||
                      new Error(`Request failed with status ${response.status}`)
                    );
                  }
                  setResult(data.message);
                  setQuestion(data.message);
                } else {
                  console.error("Reader result is null");
                }
              };
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
        .catch((err) => {
          console.error("Error accessing microphone:", err);
        });
    }
  }, []);

  const lang = "en";

  useEffect(() => {
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
  }, [id, lang]);

  useEffect(() => {
    if (!videoId || Array.isArray(videoId)) {
      return;
    }
    fetchTitle(videoId).then((data) => {
      setTitle(data);
    });

    getVideoTimeStamps(videoId).then((data) => {
      setTimeStamps(data);
    });
  }, [videoId]);

  if (!videoId) {
    return <main className={styles.main}></main>;
  }

  const fetchAudioData = async (text: string) => {
    try {
      const response = await fetch(`/api/give-audio?text=${text}`);

      if (response.ok) {
        const chunksAnswer = await response.arrayBuffer();
        const audioBlobCur = new Blob([chunksAnswer], { type: "audio/mp3" });
        const audioUrlCur = URL.createObjectURL(audioBlobCur);
        const audioCur = new Audio(audioUrlCur);

        audioCur.onerror = function (err) {
          console.error("Error playing audio:", err);
        };

        audioCur.play();
      } else {
        console.error(
          "Failed to fetch audio:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!videoId || Array.isArray(videoId)) {
      return;
    }

    let localCurrentAnswer = "";
    setSubmitting(true);

    if (lastActiveTimestamp !== null && lastActiveTimestamp !== elapsedTime) {
      // Reset current questions and answers
      setCurrentQuestions([]);
      setCurrentAnswers([]);
    }

    setCurrentQuestions((prevQuestions) => [...prevQuestions, question]);
    setCurrentAnswers((prevAnswers) => [...prevAnswers, ""]);
    const context = filterSubtitles(subtitles, intervals, elapsedTime);

    // Pass currentQuestions and currentAnswers arrays to augmentPrompt
    const es = await callGenerateText(
      augmentPrompt(context, title, question, currentQuestions, currentAnswers)
    );
    console.log(
      augmentPrompt(context, title, question, currentQuestions, currentAnswers)
    );

    es.onmessage = async (event) => {
      if (event.data === "JimSu123!") {
        addVideoQuestion({
          videoId: videoId,
          question,
          answer: localCurrentAnswer,
          timestamp: elapsedTime,
          title: title,
        }).then(() => {
          setTimeStamps([
            ...timeStamps,
            {
              timestamp: elapsedTime,
              question,
              answer: localCurrentAnswer,
              userTime: Date.now(),
            },
          ]);
          setLastActiveTimestamp(elapsedTime); // Update last active timestamp here
        });
        setSubmitting(false);
        setQuestion("");
        fetchAudioData(localCurrentAnswer)
          .then(() => {
            console.log("here");
          })
          .catch((e) => console.log(e));

        es.close();
      } else {
        localCurrentAnswer += event.data;
        setCurrentAnswers((prevAnswers) => {
          const newAnswers = [...prevAnswers];
          newAnswers[newAnswers.length - 1] = localCurrentAnswer;
          return newAnswers;
        });
      }
    };
  };

  const onReady = (player: any) => {
    setDuration(player.getDuration());
    setPlayer(player);
  };

  const onProgress = (progress: any) => {
    setElapsedTime(Math.floor(progress.playedSeconds));
  };

  const onTimestampClick = (clickedTimestamp: Timestamp) => {
    const matchingTimestamps = timeStamps.filter(
      (timestamp) => timestamp.timestamp === clickedTimestamp.timestamp
    );

    // Sort the timestamps
    matchingTimestamps.sort((a, b) => {
      const timeA = a.userTime !== undefined ? a.userTime : a.timestamp;
      const timeB = b.userTime !== undefined ? b.userTime : b.timestamp;

      return timeA - timeB;
    });

    const questions = matchingTimestamps.map((timestamp) => timestamp.question);
    const answers = matchingTimestamps.map((timestamp) => timestamp.answer);

    setCurrentQuestions(questions);
    setCurrentAnswers(answers);
    setElapsedTime(clickedTimestamp.timestamp);
    setLastActiveTimestamp(clickedTimestamp.timestamp);
  };

  const setProgress = (time: number) => {
    player.seekTo(time);
  };

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };
  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
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

  return (
    <main className={styles.main}>
      <Head>
        <title>Lucid - View</title>
        <link rel="shortcut icon" href="../../../favicon.ico" />
      </Head>
      <Navbar actionTitle={"New Lecture"} actionUrl="/retrieve" />
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
              value={filterSubtitles(subtitles, intervals, elapsedTime)}
              readOnly
              style={{
                width: "100%",
                height: "100px",
              }}
            />
          </div>
        </div>
        <div className={styles.currentQuestionSection}>
          {currentQuestions.length > 0 ? (
            <div className={styles.threadContainer}>
              <div className={styles.threadTitle}>
                Thread at {elapsedTime} seconds
              </div>
              <div className={styles.questionsSection}>
                {currentQuestions.map((_, i) => (
                  <QuestionAnswerPair
                    key={i}
                    question={currentQuestions[i]}
                    answer={currentAnswers[i]}
                    submitting={submitting}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.starterText}>
              Click on the progress bar to see questions and answers
            </div>
          )}
        </div>
      </div>
      <div className={styles.questionForm} onSubmit={onSubmit}>
        <label htmlFor="question" className={styles.questionLabel}>
          Ask a Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={styles.questionInput}
          placeholder={"Question"}
        />

        <div className={styles.buttonContainer}>
          <button className={styles.questionSubmit} onClick={onSubmit}>
            {submitting ? <Spinner /> : <ArrowRight />}
          </button>
          <button
            className={styles.questionMic}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? <Mic /> : <MicOff />}
          </button>
          <div>
            {recording ? (
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                barColor={"#f76565"}
                height={35}
              />
            ) : (
              <span>
                Muted. Press the microphone button to start recording.
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            marginTop: "1rem",
          }}
        ></div>
      </div>
      <Footer />
    </main>
  );
}
