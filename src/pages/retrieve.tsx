import { useRouter } from "next/router";
import React, { useState } from "react";
import theme from "@/app/styles/theme";
import FeatherIcon from "feather-icons-react";
import "@/app/globals.css";

const { colors } = theme;

const YouTubeLinkInput = () => {
  const [link, setLink] = useState("");

  const router = useRouter();

  const handleSubmit = (e: any) => {
    if (
      link.startsWith("https://youtube.com/") ||
      link.startsWith("https://www.youtube.com/")
    ) {
      const suffix = link.split("/").pop();
      const id = suffix?.split("v=")[1];
      router.push(`/videos/${id}`);
    } else {
      alert("Please provide a valid YouTube link.");
    }
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="title">Paste YouTube Link Here</div>
      <form className="inputs" onSubmit={handleSubmit}>
        <input
          className="link-input"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://youtube.com/..."
        />
        <button className="submitButton" type="submit">
          <FeatherIcon icon="arrow-right" />
        </button>
      </form>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: ${colors.primary};
        }

        .title {
          font-size: 1.3em;
          margin-bottom: 1rem;
          color: ${colors.text};
        }

        .inputs {
          display: flex;
          height: 2.5rem;
        }

        .link-input {
          padding: 0.5rem;
          border-radius: 0;
          border: none;
          font-size: 1rem;
          width: min(90vw, 300px);
          height: 100%;
        }

        .submitButton {
          // Remove default button styles
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: white;
          background-color: ${colors.background};
          padding: 0.5rem 1rem;
          height: 100%;
        }

        .submitButton:hover {
          background-color: ${colors.backgroundHover};
        }
      `}</style>
    </div>
  );
};

export default YouTubeLinkInput;
