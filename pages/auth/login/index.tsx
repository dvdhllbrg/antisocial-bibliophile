import axios from 'axios';

export default function Login() {
  const authenticateGoodreads = async () => {
    try {
      const res: any = await axios.get('/api/auth/authenticate');
      window.location.href = res.data.oAuthUrl;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="prose">
      <h1>Login</h1>
      <p>
        To use this app, you need to login with a Goodreads account. When you click the button
        {' '}
        below, you will be directed to the Goodreads site to authenticate, and then be redirected
        {' '}
        back here.
      </p>
      <p>
        <b>Note:</b>
        {' '}
        Even though this app doesn&apos;t show any status updates anyhwere, actions you take will
        {' '}
        still generate them, and they will still be visible on the Goodreads site. Furthermore,
        {' '}
        Goodreads is very aggressive with sending friend requests whenever you sign up.
        {' '}
        There&apos;s not really a way to disable this, so just keep it in mind.
      </p>
      <button
        type="button"
        className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        onClick={authenticateGoodreads}
      >
        Login with Goodreads
      </button>
    </section>
  );
}
