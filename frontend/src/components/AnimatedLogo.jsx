import React from "react";
import "./AnimatedLogo.css";

const AnimatedLogo = () => {
  return (
    <a href="/" className="noteslab-logo" aria-label="NotesLab">
      <div className="noteslab-mark">
        {/* Glow */}
        <div className="logo-glow" />

        <svg
          className="noteslab-svg"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document */}
          <path
            className="document-outline"
            d="M18 8H50L64 22V68C64 70.2 62.2 72 60 72H18C15.8 72 14 70.2 14 68V12C14 9.8 15.8 8 18 8Z"
          />

          {/* Folded corner */}
          <path
            className="document-fold"
            d="M50 8V20C50 22.2 51.8 24 54 24H64L50 8Z"
          />

          {/* Document lines */}
          <path className="document-line line-one" d="M24 31H45" />

          <path className="document-line line-two" d="M24 38H39" />

          {/* N */}
          <path
            className="logo-n"
            d="M25 55V43C25 41.3 27.1 40.5 28.2 41.8L46 60V43"
          />

          {/* Bottom accent */}
          <path className="document-bottom" d="M23 64H55" />
        </svg>

        {/* Floating particles */}
        <span className="logo-dot dot-one" />
        <span className="logo-dot dot-two" />
        <span className="logo-dot dot-three" />
      </div>

      {/* Wordmark */}
      <div className="noteslab-wordmark">
        <span>Notes</span>
        <span className="wordmark-lab">Lab</span>
      </div>
    </a>
  );
};

export default AnimatedLogo;
