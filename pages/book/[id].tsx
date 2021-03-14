import { useRouter } from 'next/router';

export default function Book() {
  const { query } = useRouter();
  const { id } = query;
  return (
    <p>
      Book
      { id }
    </p>
  );
}
