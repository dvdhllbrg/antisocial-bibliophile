import { useRouter } from 'next/router';

export default function Author() {
  const { query } = useRouter();
  const { id } = query;
  return (
    <p>
      Book
      { id }
    </p>
  );
}
