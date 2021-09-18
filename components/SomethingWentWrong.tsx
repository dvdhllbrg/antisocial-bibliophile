import Image from 'next/image';
import warning from '@images/warning.svg';

export default function SomethingWentWrong() {
  return (
    <main className="prose container mx-auto p-4">
      <div className="mb-3">
          <Image
            src={warning}
            alt=""
          />
        </div>
        <h1>Oh no!</h1>
        <p>
          Sorry, but something didn't go right when we tried to fetch that. Try refreshing and see if that helps!
        </p>
    </main>
  );
}
