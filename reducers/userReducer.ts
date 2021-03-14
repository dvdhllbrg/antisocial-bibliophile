/* eslint-disable camelcase */
import { User } from '../types/user';
import shelfReducer, { ShelfPropType } from './shelfReducer';

type UserPropType = {
  id: string;
  name: string;
  image_url: string;
  small_image_url: string;
  user_shelves: {
    user_shelf: ShelfPropType | ShelfPropType[];
  }
};

export default function userReducer(user: UserPropType): User {
  let shelves = [];
  if (user.user_shelves && user.user_shelves.user_shelf) {
    shelves = Array.isArray(user.user_shelves.user_shelf)
      ? user.user_shelves.user_shelf.map(shelfReducer)
      : [shelfReducer(user.user_shelves.user_shelf)];
  }
  return {
    id: user.id || '0',
    name: user.name || '',
    image: user.image_url || '',
    thumbnail: user.small_image_url || '',
    shelves,
  };
}
