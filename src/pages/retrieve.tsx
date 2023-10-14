import React, { useState } from "react";

const YouTubeLinkInput = () => {
  const [link, setLink] = useState("");

  const handleSubmit = () => {
    if (
      link.startsWith("https://youtube.com/") ||
      link.startsWith("https://www.youtube.com/")
    ) {
      window.open(link, "_blank"); // Opens the link in a new tab
    } else {
      alert("Please provide a valid YouTube link.");
    }
  };

  return (
    <div className="container">
      <label className="title">Paste YouTube Link Here</label>
      <input
        className="input"
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="https://youtube.com/..."
      />
      <button className="submitButton" onClick={handleSubmit}>
        Go
      </button>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .title {
          font-size: 1.3em;
          font-family: sans-serif;
          margin-bottom: 1rem;
        }

        .input {
          width: 80%;
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid black;
          margin-bottom: 1rem;
        }

        .submitButton {
          // Remove default button styles
          border: none;
          outline: none;
          background: none;
          cursor: pointer;
          font-family: sans-serif;
          font-size: 1em;
          color: white;
          background-color: black;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          width: 80%;
        }
      `}</style>
    </div>
  );
};

export default YouTubeLinkInput;
