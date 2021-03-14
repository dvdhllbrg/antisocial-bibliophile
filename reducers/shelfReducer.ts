/* eslint-disable camelcase */
import { Shelf } from '../types/shelf';

type exclusive = 'true' | 'false';

export type ShelfPropType = {
  id?: string | {_: string};
  name?: string;
  book_count?: number | {_: number};
  exclusive?: exclusive;
  exclusive_flag?: { _: exclusive };
};

export default function shelfReducer(shelf: ShelfPropType): Shelf {
  let count = 0;
  if (shelf.book_count) {
    count = typeof shelf.book_count === 'object' ? shelf.book_count._ : shelf.book_count;
  }
  return {
    id: typeof shelf.id === 'object' ? shelf.id._ : (shelf.id || '0'),
    name: shelf.name || '',
    main: shelf.exclusive === 'true' || (Object.prototype.hasOwnProperty.call(shelf, 'exclusive_flag') && shelf.exclusive_flag._ === 'true'),
    count,
  };
}
