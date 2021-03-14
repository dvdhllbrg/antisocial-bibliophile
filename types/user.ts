import type { Shelf } from './shelf';

export type User = {
  id: string;
  name: string;
  image: string
  thumbnail: string
  shelves: Shelf[]
};
