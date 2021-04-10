import type { Book } from '@custom-types/book';

export type Shelf = {
    id: string;
    name: string;
    count: number
    main: boolean
    books?: Book[]
};
