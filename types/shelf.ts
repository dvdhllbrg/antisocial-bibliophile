import type { Book } from './book';

export type Shelf = {
    id: string;
    name: string;
    count: number
    main: boolean
    books?: Book[]
};
