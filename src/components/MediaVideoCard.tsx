import Link from "next/link";

export default function MediaVideoCard() {
  const youtubeUrl = "https://www.youtube.com/watch?v=92UTmMx3P1c";

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="media-video-card video-link-card"
      aria-label="Watch Sea Hawk Overview Video on YouTube"
    >
      {/* Background Image */}
      <div
        className="video-poster-bg"
        style={{ backgroundImage: `url(/images/hero-ship-2.jpg)` }}
      />
      {/* Dark Gradient Overlay */}
      <div className="video-overlay" />

      {/* Center Play Button */}
      <div className="play-button-btn">
        <div className="play-icon-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#0b2233">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      {/* Top Right YouTube Badge */}
      {/* <div className="youtube-badge">
        <svg width="18" height="14" viewBox="0 0 24 17" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <span>Watch on YouTube</span>
      </div> */}
    </a>
  );
}
