import React from 'react';

interface TrustpilotBadgeProps {
  score?: number;       // e.g. 4.8
  totalReviews?: number; // e.g. 12
  profileUrl?: string;
}

/**
 * Trustpilot-style badge with green stars, score, and link.
 * Uses inline SVG stars for pixel-perfect rendering.
 */
export const TrustpilotBadge: React.FC<TrustpilotBadgeProps> = ({
  score = 4.8,
  totalReviews = 12,
  profileUrl = 'https://www.trustpilot.com/review/invoice-gen.net',
}) => {
  // Render 5 Trustpilot-style stars based on score
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fill = i <= Math.floor(score) ? '#00B67A' : i - score < 1 ? '#00B67A' : '#DCDCE6';
      stars.push(
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="2" fill={fill} />
          <path
            d="M12 3.5L14.09 8.63L19.5 9.27L15.5 13.14L16.59 18.5L12 15.77L7.41 18.5L8.5 13.14L4.5 9.27L9.91 8.63L12 3.5Z"
            fill="white"
          />
        </svg>
      );
    }
    return stars;
  };

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="trustpilot-badge"
      title={`Rated ${score} out of 5 on Trustpilot`}
    >
      {/* Top row: Stars */}
      <div className="trustpilot-stars">
        {renderStars()}
      </div>

      {/* Score and label */}
      <div className="trustpilot-info">
        <span className="trustpilot-score">
          TrustScore <strong>{score.toFixed(1)}</strong>
        </span>
        <span className="trustpilot-divider">|</span>
        <span className="trustpilot-reviews">
          {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Trustpilot Logo */}
      <div className="trustpilot-logo">
        <svg width="90" height="22" viewBox="0 0 126 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M33.3 12.8H25.4V15.3H28.3V25.5H31.3V15.3H33.3V12.8ZM36.4 16.5C35.6 16.5 35 16.8 34.5 17.5V16.7H31.8V25.5H34.7V20.7C34.7 19.6 35.3 19 36.1 19C36.2 19 36.3 19 36.5 19L36.8 16.5C36.7 16.5 36.5 16.5 36.4 16.5ZM42.3 16.5C42 16.5 41.7 16.6 41.4 16.7C41.1 16.8 40.9 17 40.7 17.2V16.7H38V25.5H40.9V20.8C40.9 20.3 41 19.8 41.2 19.5C41.4 19.2 41.8 19 42.2 19C43 19 43.3 19.5 43.3 20.6V25.5H46.2V19.7C46.2 17.5 45 16.5 42.3 16.5ZM52.4 18.9C52 18.7 51.6 18.5 51.3 18.4C51 18.3 50.5 18.2 50.1 18.2C49.2 18.2 48.8 18.4 48.8 18.8C48.8 19 48.9 19.2 49.2 19.3C49.5 19.4 49.9 19.5 50.4 19.6C51 19.7 51.5 19.9 51.9 20.1C52.3 20.3 52.7 20.5 53 20.9C53.3 21.3 53.5 21.8 53.5 22.4C53.5 23.4 53.1 24.2 52.3 24.7C51.5 25.2 50.5 25.5 49.3 25.5C48.7 25.5 48 25.4 47.4 25.3C46.8 25.2 46.3 25 45.9 24.7L46.9 22.7C47.2 22.9 47.6 23.1 48.1 23.2C48.6 23.3 49 23.4 49.4 23.4C50.3 23.4 50.7 23.2 50.7 22.8C50.7 22.6 50.6 22.4 50.3 22.3C50 22.2 49.5 22.1 49 22C48.4 21.9 47.9 21.7 47.5 21.5C47.1 21.3 46.7 21.1 46.5 20.7C46.2 20.3 46.1 19.8 46.1 19.2C46.1 18.2 46.5 17.5 47.3 17C48.1 16.5 49 16.3 50.1 16.3C51.2 16.3 52.2 16.5 53 16.9L52.4 18.9ZM57.4 12.8H54.4V15.2H53V17.5H54.4V22.2C54.4 23.6 54.7 24.5 55.3 25C55.9 25.5 56.8 25.7 57.9 25.7C58.5 25.7 59 25.6 59.5 25.5V23.2C59.3 23.3 59 23.3 58.7 23.3C58.3 23.3 57.9 23.2 57.7 23C57.5 22.8 57.4 22.4 57.4 21.9V17.5H59.4V15.2H57.4V12.8ZM65.5 16.5C64 16.5 62.8 16.9 61.8 17.7C60.8 18.5 60.3 19.7 60.3 21.1C60.3 22.6 60.8 23.7 61.7 24.5C62.6 25.3 63.9 25.7 65.4 25.7C66.3 25.7 67.1 25.6 67.7 25.4C68.3 25.2 68.9 24.8 69.3 24.4L67.9 22.6C67.2 23.2 66.4 23.5 65.5 23.5C64.9 23.5 64.4 23.4 64 23.1C63.6 22.8 63.4 22.4 63.3 21.8H69.7C69.8 21.5 69.8 21.2 69.8 20.8C69.8 19.5 69.4 18.4 68.5 17.6C67.6 16.9 66.6 16.5 65.5 16.5ZM63.3 20C63.4 19.5 63.6 19.1 64 18.8C64.4 18.5 64.8 18.3 65.3 18.3C65.8 18.3 66.3 18.5 66.6 18.8C66.9 19.1 67.1 19.5 67.1 20H63.3ZM9.7 25.5L11.3 20.6L7.7 17.6H12.5L14 12.8L15.5 17.6H20.3L16.7 20.6L18.3 25.5L14 22.5L9.7 25.5Z" fill="#191919"/>
        </svg>
      </div>
    </a>
  );
};
