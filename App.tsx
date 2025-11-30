
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { performSearch } from './services/searchService';
import { SearchType, SearchResponse } from './types';
import { SHEN_LOGO_URL } from './constants';
import { AllIcon, ImageIcon, VideoIcon, SearchIcon } from './components/Icons';
import Footer from './components/Footer';
import { TextResultCard, ImageResultCard, VideoResultCard } from './components/ResultCards';

function App() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Animation States
  const [isSweeping, setIsSweeping] = useState(false); 
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (isLoadMore = false) => {
    const term = query.trim();
    if (!term) return;

    setError(null);
    if (!isLoadMore) {
      setHasSearched(true);
      setLoading(true);
      setCurrentPage(1);
      setResults(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const pageToFetch = isLoadMore ? currentPage + 1 : 1;
      const data = await performSearch(term, searchType, pageToFetch);
      
      if (isLoadMore) {
        setResults(prev => {
          if (!prev) return data;
          return {
            ...data,
            items: [...(prev.items || []), ...(data.items || [])]
          };
        });
        setCurrentPage(pageToFetch);
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || "خطایی در برقراری ارتباط رخ داد");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, searchType, currentPage]);

  useEffect(() => {
    if (hasSearched && query.trim()) {
      handleSearch(false);
    }
  }, [searchType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(false);
    }
  };

  const handleTypeChange = (typeId: string) => {
    setAnimatingButton(typeId);
    setSearchType(typeId as SearchType);
    
    // Duration of 'spin-center' animation - 0.15s
    setTimeout(() => {
      setAnimatingButton(null);
    }, 150);
  };

  const handleLoadMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSearch(true);
  };

  const triggerSweep = () => {
    if (isSweeping) return;
    setIsSweeping(true);
    setTimeout(() => setIsSweeping(false), 600);
  };

  const renderResults = () => {
    if (!results?.items?.length) {
      return <p className="text-center text-gray-500 mt-10">نتیجه‌ای یافت نشد.</p>;
    }

    const gridClasses = {
      all: 'space-y-4',
      image: 'grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      video: 'grid gap-6 grid-cols-1 md:grid-cols-2'
    };

    return (
      <div className={gridClasses[searchType]}>
        {results.items.map((item, index) => {
          const key = `${item.cacheId || item.link}-${index}`;
          if (searchType === 'image') return <ImageResultCard key={key} item={item} />;
          if (searchType === 'video') return <VideoResultCard key={key} item={item} />;
          return <TextResultCard key={key} item={item} />;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-6 transition-all duration-500 ease-in-out bg-[#09090b]">
      
      <main className={`w-full max-w-4xl flex flex-col transition-all duration-700 ${!hasSearched ? 'justify-center min-h-[80vh]' : 'mt-4'}`}>
        
        {/* Header */}
        <div className="w-full max-w-2xl mx-auto text-center z-10">
          <img 
            src={SHEN_LOGO_URL} 
            alt="SHEN Core Engine" 
            className={`mx-auto transition-all duration-500 ${!hasSearched ? 'h-32 w-auto mb-8' : 'h-16 w-auto mb-4'}`}
          />
          
          {/* AI Search Input - The Liquid Train (Clockwise) */}
          <div className={`relative mb-8 group ${isSweeping ? 'sweep-active' : ''}`}>
            
            {/* The Liquid Container - True RGB Train */}
            <div className="liquid-container train-mode bg-[#27272a] p-[2px]">
               <div className="liquid-bg train-gradient"></div>
               
               {/* Inner Input Wrapper */}
               <div className="relative bg-[#18181b] rounded-full overflow-hidden flex items-center shadow-2xl h-14">
                  
                  {/* Sweep Effect Layer */}
                  <div className="sweep-overlay z-20 pointer-events-none">
                    <div className="sweep-bar"></div>
                  </div>

                  <input 
                    ref={searchInputRef}
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={triggerSweep}
                    onFocus={triggerSweep}
                    className="w-full h-full px-6 text-lg bg-transparent text-gray-200 focus:outline-none placeholder-zinc-400 relative z-30"
                    placeholder="جستجو در SHEN Core..."
                  />
                  
                  <button 
                    onClick={() => handleSearch(false)}
                    className="h-full px-6 text-gray-400 hover:text-white transition-colors relative z-30 focus:outline-none"
                  >
                    <SearchIcon className="w-6 h-6" />
                  </button>
               </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {[
              { id: 'all', label: 'همه', icon: AllIcon },
              { id: 'image', label: 'تصاویر', icon: ImageIcon },
              { id: 'video', label: 'ویدیوها', icon: VideoIcon },
            ].map((type) => {
              const isSelected = searchType === type.id;
              const isAnimating = animatingButton === type.id;
              
              return (
                <div key={type.id} className="relative group">
                   {/* Liquid Container */}
                   <div className={`
                      liquid-container 
                      ${isAnimating ? 'spin-mode' : isSelected ? 'reverse-train-mode' : ''} 
                      p-[2px] /* Creates the border thickness gap */
                      bg-transparent /* ESSENTIAL: No background color to cause borders */
                   `}>
                      {/* Gradient ONLY visible when active or animating */}
                      {(isAnimating || isSelected) && (
                        <div className={`liquid-bg ${isAnimating ? 'holo-gradient' : 'train-gradient'}`}></div>
                      )}
                      
                      <button
                        onClick={() => handleTypeChange(type.id)}
                        className={`
                          relative z-10 flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 w-full h-full 
                          focus:outline-none outline-none ring-0 border-0
                          ${isAnimating 
                            ? 'bg-transparent text-white'  
                            : isSelected 
                                ? 'bg-[#18181b] text-white' 
                                : 'bg-[#18181b] text-gray-400 hover:bg-[#27272a] hover:text-gray-200'}
                          ${isAnimating ? 'flash-text' : ''}
                        `}
                      >
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </button>
                   </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        {(hasSearched || loading) && (
          <div className="w-full mt-10 animate-fadeIn">
            {!loading && results?.searchInformation && (
              <p className="text-gray-500 text-sm mb-6 text-center md:text-right px-2 font-mono">
                 یافت شده: {results.searchInformation.formattedTotalResults} ({results.searchInformation.formattedSearchTime} ثانیه)
              </p>
            )}

            {error && (
              <div className="text-red-400 text-center p-4 bg-red-900/10 border border-red-900/30 rounded-lg mb-8 backdrop-blur-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-12">
                <div className="loader"></div>
              </div>
            )}

            {!loading && renderResults()}

            {results?.queries?.nextPage && !loading && (
              <div className="flex justify-center mt-12 mb-8">
                <button 
                  onClick={handleLoadMoreClick}
                  disabled={loadingMore}
                  className="group relative px-8 py-3 rounded-full bg-zinc-800 text-gray-300 overflow-hidden transition-all duration-300 disabled:opacity-50 hover:text-white border border-zinc-700 hover:border-zinc-500 focus:outline-none"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center gap-2">
                    {loadingMore && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    {loadingMore ? 'در حال بارگذاری...' : 'نتایج بیشتر'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
