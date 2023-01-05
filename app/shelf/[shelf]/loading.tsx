import BookCard from "@components/elements/BookCard";
import TopAppBar from "@components/TopAppBar";

const LoadingShelf = () => {
  return (
    <>
      <TopAppBar title="loading ..." />
      <main className="container mx-auto p-4 transform-gpu transition-all duration-200 ease-out">
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
      </main>
    </>
  );
};

export default LoadingShelf;
