import Chip from "@components/elements/Chip";
import TopAppBar from "@components/TopAppBar";

const LoadingBook = () => {
  return (
    <>
      <TopAppBar title="loading ..." />
      <main className="container mx-auto p-4 pb-24">
        <section className="grid grid-cols-3">
          <div className="h-36 w-24 mb-3 mt-2 bg-gray-200 animate-pulse" />
          <div className="col-span-2">
            <div className="animate-pulse bg-gray-200 h-7 w-48" />
            <b>Shelves</b>
            <div className="mb-2">
              <Chip skeleton />
              <Chip skeleton />
            </div>
            <span className="inline-block ml-2 h-4 w-full bg-gray-200 animate-pulse mt-2" />
          </div>
        </section>
        <section className="flex items-center justify-evenly w-full my-6">
          <div className="h-20 w-1/3 mb-3 mt-2 bg-gray-200 animate-pulse" />
          <div className="h-20 w-1/3 mb-3 mt-2 bg-gray-200 animate-pulse" />
        </section>
        <section className="h-96 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
        <section className="mt-6 h-4 w-1/2 bg-gray-200 animate-pulse" />
      </main>
    </>
  );
};

export default LoadingBook;
