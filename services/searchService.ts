import { GOOGLE_API_KEY, GOOGLE_CX } from '../constants';
import { SearchResponse, SearchType } from '../types';

export const performSearch = async (
  query: string,
  type: SearchType,
  page: number = 1
): Promise<SearchResponse> => {
  const startIndex = (page - 1) * 10 + 1;
  let finalQuery = query;

  // Custom logic for video search as per original implementation
  if (type === 'video') {
    finalQuery = `${query} site:youtube.com OR site:aparat.com`;
  }

  let url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
    finalQuery
  )}&start=${startIndex}`;

  if (type === 'image') {
    url += '&searchType=image';
  }

  const response = await fetch(url);
  const data: SearchResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data;
};