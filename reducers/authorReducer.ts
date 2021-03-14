/* eslint-disable camelcase */
import { Author } from '../types/author';

export type AuthorPropType = {
  id?: string | {_: string};
  name?: string;
  role?: string;
  about?: string;
  image_url?: string;
  small_image_url?: string;
  link?: string;
};

export default function shelfReducer(author: AuthorPropType): Author {
  return {
    id: typeof author.id === 'object' ? author.id._ : (author.id || '0'),
    name: author.name || '',
    role: author.role || '',
    description: author.about || '',
    image: author.image_url || '',
    thumbnail: author.small_image_url || '',
    url: author.link || '',
  };
}
