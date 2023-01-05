import Chip from "@components/elements/Chip";
import TopAppBar from "@components/TopAppBar";

const LoadingHomePage = () => {
  return (
    <>
      <TopAppBar title="My shelves" />
      <main className="container mx-auto p-4">
        <section>
          <h2 className="mt-0 mb-2 text-2xl font-bold">Main</h2>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-12 w-full mb-4" />
          <div className="animate-pulse bg-gray-200 dark:bg-gray-600 border-dark-primaryh-12 w-full mb-4" />
          <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-12 w-full mb-4" />
        </section>
        <section>
          <h2 className="mt-6 mb-4 text-2xl font-bold">Tags</h2>
          <Chip skeleton size="large" />
          <Chip skeleton size="large" />
        </section>
      </main>
    </>
  );
};

export default LoadingHomePage;
