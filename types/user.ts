import type { Shelf } from '@custom-types/shelf';

export type User = {
  id: string;
  loggedIn: boolean;
  name: string;
  image: string;
  thumbnail: string;
  shelves: Shelf[];
  tags?: Shelf[];
};
