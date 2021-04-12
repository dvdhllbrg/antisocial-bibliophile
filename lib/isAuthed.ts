import withSession from '@lib/withSession';

export default function isAuthed() {
  return withSession(async ({ req }) => {
    const gr = req.session.get('goodreads');
    if (!gr || !gr.accessToken) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  });
}
