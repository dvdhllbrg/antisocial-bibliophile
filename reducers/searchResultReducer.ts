/* eslint-disable camelcase */
import { SearchResult } from '@custom-types/searchResult';
import authorReducer, { AuthorPropType } from '@reducers/authorReducer';

type SearchResultPropType = {
  best_book: {
    id: string | {_: string};
    title: string;
    image_url: string;
    author: AuthorPropType;
  };
};

export default function userReducer(searchResult: SearchResultPropType): SearchResult {
  return {
    id: typeof searchResult.best_book.id === 'object' ? searchResult.best_book.id._ : searchResult.best_book.id,
    title: searchResult.best_book.title || '',
    image: searchResult.best_book.image_url || '',
    authors: [authorReducer(searchResult.best_book.author)],
  };
}
