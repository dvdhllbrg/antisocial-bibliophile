import { Shelf } from "@custom-types/shelf";
import { User } from "@custom-types/user";
import shelfReducer, { ShelfPropType } from "@reducers/shelfReducer";

type UserPropType = {
  id: string;
  name: string;
  image_url: string;
  small_image_url: string;
  user_shelves: {
    user_shelf: ShelfPropType | ShelfPropType[];
  };
};

export default function userReducer(user: UserPropType): User {
  let shelves: Shelf[] = [];
  let tags: Shelf[] = [];
  if (user?.user_shelves?.user_shelf) {
    const shelvesAndTags = Array.isArray(user.user_shelves.user_shelf)
      ? user.user_shelves.user_shelf.map(shelfReducer)
      : [shelfReducer(user.user_shelves.user_shelf)];
    shelves = shelvesAndTags.filter((s) => s.main);
    tags = shelvesAndTags.filter((s) => !s.main);
  }
  return {
    id: user?.id || "0",
    loggedIn: true,
    name: user?.name || "",
    image: user?.image_url || "",
    shelves,
    tags,
  };
}
