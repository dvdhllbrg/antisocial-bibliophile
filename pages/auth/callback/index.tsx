import axios from 'axios';
import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    async function authorizeGoodreads() {
      try {
        await axios.get('/api/auth/authorize');
        window.location.href = '/';
      } catch (err) {
        console.error(err);
      }
    }
    authorizeGoodreads();
  }, []);

  return <p>Loading</p>;
}
