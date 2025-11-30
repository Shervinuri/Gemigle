import React from 'react';
import { SearchResultItem } from '../types';
import { YOUTUBE_PLACEHOLDER } from '../constants';

interface BaseResultProps {
  item: SearchResultItem;
}

export const TextResultCard: React.FC<BaseResultProps> = ({ item }) => (
  <div className="p-4 rounded-lg hover:bg-[#1f1f1f] transition-colors duration-200">
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
      <p className="text-sm text-gray-400 truncate dir-ltr text-left mb-1 font-mono opacity-80">{item.formattedUrl}</p>
      <h3 className="text-xl font-semibold text-orange-500 group-hover:underline mb-2">{item.htmlTitle ? <span dangerouslySetInnerHTML={{ __html: item.htmlTitle }} /> : item.title}</h3>
    </a>
    <p className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.htmlSnippet || item.snippet }} />
  </div>
);

export const ImageResultCard: React.FC<BaseResultProps> = ({ item }) => {
  const imageUrl = item.link;
  const contextUrl = item.image?.contextLink || item.link;

  return (
    <a href={contextUrl} target="_blank" rel="noopener noreferrer" className="block group relative overflow-hidden rounded-lg border-2 border-gray-700 hover:border-orange-500 transition-all duration-300">
      <div className="aspect-square bg-gray-800 w-full relative">
        <img 
          src={imageUrl} 
          alt={item.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400?text=Image+Error";
          }}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            <p className="text-white text-xs truncate w-full">{item.title}</p>
        </div>
      </div>
    </a>
  );
};

export const VideoResultCard: React.FC<BaseResultProps> = ({ item }) => {
  const thumbnail = item.pagemap?.cse_thumbnail?.[0]?.src || YOUTUBE_PLACEHOLDER;

  return (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden group hover:bg-gray-800 transition-colors border border-gray-800 hover:border-gray-700">
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-video">
          <img 
            src={thumbnail} 
            alt={item.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
             <div className="w-12 h-12 bg-orange-500/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-orange-500 group-hover:underline mb-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.htmlTitle }} />
          <p className="text-xs text-gray-500 truncate mb-2 dir-ltr text-right">{item.formattedUrl}</p>
          <p className="text-gray-300 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} />
        </div>
      </a>
    </div>
  );
};