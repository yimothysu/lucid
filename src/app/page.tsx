"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { ArrowRight } from "react-feather";
import theme from "./styles/theme";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

function getThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

type Card = {
  videoId: string;
  title: string;
  sampleQuestion: string;
  sampleAnswer: string;
};

type CardProps = Card;

function Card(props: CardProps & { id: number }) {
  return (
    <motion.div
      // Fade in
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: props.id }}
    >
      <div className={styles.cardContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getThumbnailUrl(props.videoId)}
          alt={`Video for ${props.title}`}
          width={240}
          height={135}
        />
        <div className={styles.cardTitle}>{props.title}</div>
        <div className={styles.cardSampleQuestion}>
          Q: {props.sampleQuestion}
        </div>
        <div className={styles.cardSampleAnswer}>A: {props.sampleAnswer}</div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [animateBackground, setAnimateBackground] = useState(false);

  const router = useRouter();

  const cards: Card[] = [
    {
      title: "Never Gonna Give You Up",
      videoId: "dQw4w9WgXcQ",
      sampleQuestion: "What is the first word in the song?",
      sampleAnswer: "We're",
    },
    {
      title: "I went back to Morocco after 7 years",
      videoId: "Y9QWyDMa0rk",
      sampleQuestion:
        "What did the speaker do after 7 years of not being in Morocco?",
      sampleAnswer: "They went back to Morocco",
    },
    {
      title: "Never Gonna Give You Up",
      videoId: "dQw4w9WgXcQ",
      sampleQuestion: "What is the first word in the song?",
      sampleAnswer: "We're",
    },
    {
      title: "I went back to Morocco after 7 years",
      videoId: "Y9QWyDMa0rk",
      sampleQuestion:
        "What did the speaker do after 7 years of not being in Morocco?",
      sampleAnswer: "They went back to Morocco",
    },
    {
      title: "Never Gonna Give You Up",
      videoId: "dQw4w9WgXcQ",
      sampleQuestion: "What is the first word in the song?",
      sampleAnswer: "We're",
    },
    {
      title: "I went back to Morocco after 7 years",
      videoId: "Y9QWyDMa0rk",
      sampleQuestion:
        "What did the speaker do after 7 years of not being in Morocco?",
      sampleAnswer: "They went back to Morocco",
    },
    {
      title: "Never Gonna Give You Up",
      videoId: "dQw4w9WgXcQ",
      sampleQuestion: "What is the first word in the song?",
      sampleAnswer: "We're",
    },
    {
      title: "I went back to Morocco after 7 years",
      videoId: "Y9QWyDMa0rk",
      sampleQuestion:
        "What did the speaker do after 7 years of not being in Morocco?",
      sampleAnswer: "They went back to Morocco",
    },
    {
      title: "Never Gonna Give You Up",
      videoId: "dQw4w9WgXcQ",
      sampleQuestion: "What is the first word in the song?",
      sampleAnswer: "We're",
    },
    {
      title: "I went back to Morocco after 7 years",
      videoId: "Y9QWyDMa0rk",
      sampleQuestion:
        "What did the speaker do after 7 years of not being in Morocco?",
      sampleAnswer: "They went back to Morocco",
    },
    {
      title: "Never Gonna Give You Up",
      videoId: "dQw4w9WgXcQ",
      sampleQuestion: "What is the first word in the song?",
      sampleAnswer: "We're",
    },
    {
      title: "I went back to Morocco after 7 years",
      videoId: "Y9QWyDMa0rk",
      sampleQuestion:
        "What did the speaker do after 7 years of not being in Morocco?",
      sampleAnswer: "They went back to Morocco",
    },
  ];

  return (
    <main className={styles.mainContainer}>
      <Image src="/logo-v0.png" alt="logo" width={200} height={200} />
      <h1>Education reimagined, one lecture at a time.</h1>
      <div className={styles.cardsGrid}>
        {cards.map((card, index) => (
          <a href={`/videos/${card.videoId}`} key={card.videoId}>
            <Card id={index} {...card} />
          </a>
        ))}
      </div>
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={animateBackground ? { scale: 50, opacity: 1 } : {}}
        transition={{ duration: 0.2 }}
        style={
          animateBackground
            ? {
                width: "100vw",
                height: "100vh",
                backgroundColor: theme.colors.primary,
              }
            : {}
        }
      ></motion.div>
      <button
        className={styles.actionButton}
        onClick={() => {
          setAnimateBackground(true);
          setTimeout(() => {
            router.push("/retrieve");
          }, 200);
        }}
      >
        <span className={styles.actionButton__span}>Try it Now</span>
        <ArrowRight />
      </button>
    </main>
  );
}
