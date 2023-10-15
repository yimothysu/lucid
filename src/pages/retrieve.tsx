import { useRouter } from "next/router";
import React, { useState } from "react";
import theme from "@/app/styles/theme";
import { ArrowRight } from "react-feather";
import Image from "next/image";
import "@/app/globals.css";
import Navbar from "@/app/components/navbar";
import { motion } from "framer-motion";
const { colors } = theme;

function FadeUpComponent(props: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Initial state
      animate={{ opacity: 1, y: 0 }} // End state
      exit={{ opacity: 0, y: 50 }} // Exit state
      transition={{ duration: props.delay }} // Optional: Transition settings
    >
      {props.children}
    </motion.div>
  );
}

const YouTubeLinkInput = () => {
  const [link, setLink] = useState("");

  const router = useRouter();

  const handleSubmit = (e: any) => {
    if (
      link.startsWith("https://youtube.com/") ||
      link.startsWith("https://www.youtube.com/")
    ) {
      const suffix = link.split("/").pop();
      const suffix2 = suffix?.split("v=")[1];
      const id = suffix2?.split("&")[0];
      router.push(`/videos/${id}`);
    } else {
      alert("Please provide a valid YouTube link.");
    }
    e.preventDefault();
  };

  return (
    <div className="wrapper">
      <Navbar />
      <div className="container">
        <FadeUpComponent delay={0.5}>
          <Image src="/logo-v0.png" alt="logo" width={80} height={80} />
        </FadeUpComponent>
        <FadeUpComponent delay={0.7}>
          <div className="title">Paste YouTube Link Here</div>
        </FadeUpComponent>
        <FadeUpComponent delay={0.9}>
          <form className="inputs" onSubmit={handleSubmit}>
            <input
              className="link-input"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://youtube.com/..."
            />
            <button className="submitButton" type="submit">
              <ArrowRight />
            </button>
          </form>
        </FadeUpComponent>
      </div>
      <style jsx>{`
        .wrapper {
          background-color: ${colors.funOffWhite};
          min-height: 100vh;
        }

        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 80vh;
          background-color: ${colors.funOffWhite};
        }

        .title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: ${colors.text};
        }

        .inputs {
          display: flex;
          height: 3rem;
        }

        .link-input {
          padding: 0.5rem;
          border-radius: 0;
          border: none;
          font-size: 1.25rem;
          width: min(90vw, 400px);
          height: 100%;
        }

        .submitButton {
          // Remove default button styles
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: black;
          background-color: ${colors.secondary};
          padding: 0.5rem 1rem;
          padding-top: 0.7rem;
          height: 100%;
          vertical-align: middle;
        }

        .submitButton:hover {
          background-color: ${colors.primary};
        }
      `}</style>
    </div>
  );
};

export default YouTubeLinkInput;
