import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 mt-12 border-t border-gray-800 w-full">
      <a 
        href="https://T.me/shervini" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block text-lg font-bold bg-gradient-to-r from-white via-gray-500 to-gray-900 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        style={{
             backgroundSize: '200% auto',
             textShadow: '0 0 1px rgba(255,255,255,0.1)'
        }}
      >
        Exclusive ☬SHΞN™ made
      </a>
    </footer>
  );
};

export default Footer;