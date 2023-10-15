"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { ArrowRight } from "react-feather";
import theme from "./styles/theme";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRandomVideos } from "./firebase/firestore";

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
      transition={{ duration: props.id * 0.2 }}
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

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    getRandomVideos().then((randomVideos) => {
      let newCards: Card[] = [];
      if (randomVideos.length < 12) {
        // If we don't have enough videos, try to parse it using repeat videos instead and using different questions
        while (newCards.length < 12) {
          let i = Math.floor(Math.random() * randomVideos.length);
          let randomIndex = Math.floor(
            Math.random() * randomVideos[i].questionAnswerPairs.length
          );
          newCards.push({
            videoId: randomVideos[i].id,
            title: "We ball",
            sampleQuestion:
              randomVideos[i].questionAnswerPairs[randomIndex].question,
            sampleAnswer:
              randomVideos[i].questionAnswerPairs[randomIndex].answer,
          });
        }
      } else {
        newCards = randomVideos.map((video) => ({
          videoId: video.id,
          title: "We ball",
          sampleQuestion: video.questionAnswerPairs[0].question,
          sampleAnswer: video.questionAnswerPairs[0].answer,
        })) as Card[];
      }

      setCards(newCards);
    });
  }, []);

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
