import React from 'react';

    const WerkDeskLogo = ({ className }) => (
      <svg 
        width="auto" 
        height="auto" 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <title>WerkDesk Logo</title>
        <desc>A stylized wrench crossing a desktop monitor.</desc>
        <g transform="translate(0 2)">
          <rect x="6" y="10" width="36" height="24" rx="2" fill="#7C3AED"/>
          <rect x="8" y="12" width="32" height="20" rx="1" fill="white"/>
          <path d="M18 36H30V38H18V36Z" fill="#7C3AED"/>
          <path d="M22 38H26V42H22V38Z" fill="#7C3AED"/>
          
          <g transform="translate(2, -2) rotate(15 24 8)">
            <path d="M28.8235 5.00001C29.4707 4.99929 30.0012 5.52859 30.0005 6.17575L29.992 10.1757C29.9913 10.8229 29.4619 11.3534 28.8148 11.3541L25.9706 11.3565C25.3359 11.3571 24.8192 10.8536 24.8019 10.2201L24.6019 4.2201C24.5847 3.58656 25.0831 3.05236 25.7158 3.0198L28.8235 2.85992C28.8242 2.85992 28.8242 5.00001 28.8235 5.00001Z" fill="#7C3AED"/>
            <path d="M21 6.5 A 2.5 2.5 0 0 1 18.5 9 A 2.5 2.5 0 0 1 16 6.5 A 2.5 2.5 0 0 1 18.5 4 A 2.5 2.5 0 0 1 21 6.5 Z" fill="white"/>
            <circle cx="18.5" cy="6.5" r="1" fill="#7C3AED"/>
          </g>
        </g>
      </svg>
    );

    export default WerkDeskLogo;