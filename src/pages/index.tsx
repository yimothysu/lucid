"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { ArrowRight } from "react-feather";
import theme from "../app/styles/theme";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRandomVideos } from "../app/firebase/firestore";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import "src/app/globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Head from "next/head";

export async function getStaticProps(context: { locale: any }) {
  // extract the locale identifier from the URL
  const { locale } = context;

  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

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

  const { t } = useTranslation();

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
            title: randomVideos[i].title,
            sampleQuestion:
              randomVideos[i].questionAnswerPairs[randomIndex].question,
            sampleAnswer:
              randomVideos[i].questionAnswerPairs[randomIndex].answer,
          });
        }
      } else {
        newCards = randomVideos.map((video) => ({
          videoId: video.id,
          title: video.title,
          sampleQuestion: video.questionAnswerPairs[0].question,
          sampleAnswer: video.questionAnswerPairs[0].answer,
        })) as Card[];
      }

      setCards(newCards);
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Lucid</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Navbar actionTitle={t("navBarButton")} actionUrl="/retrieve" />
      <main className={styles.mainContainer}>
        <Image
          className={styles.floatingAnimatedImage}
          src="/logo-v0.png"
          alt="logo"
          width={200}
          height={200}
        />
        <h1>{t("title")}</h1>
        <button
          className={styles.actionButton}
          onClick={() => {
            setAnimateBackground(true);
            setTimeout(() => {
              router.push("/retrieve");
            }, 200);
          }}
          style={{
            marginTop: "2rem",
          }}
        >
          <span className={styles.actionButton__span}>{t("tryButton")}</span>
          <ArrowRight />
        </button>
        <div className={styles.cardsGrid}>
          {cards.map((card, index) => (
            <Link href={`/videos/${card.videoId}`} key={card.videoId}>
              <Card id={index} {...card} />
            </Link>
          ))}
        </div>
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          animate={animateBackground ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.2 }}
          style={
            animateBackground
              ? {
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: theme.colors.primary,
                  position: "absolute",
                  top: 0,
                }
              : {}
          }
        ></motion.div>
      </main>
      <Footer />
    </div>
  );
}
