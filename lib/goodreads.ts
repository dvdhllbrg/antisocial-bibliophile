/* eslint-disable no-underscore-dangle */
import { OAuth } from 'oauth';
import axios from 'axios';
import parser from './parser';

const oauth = new OAuth(
  `${process.env.GOODREADS_URL}/oauth/request_token`,
  `${process.env.GOODREADS_URL}/oauth/access_token`,
  process.env.GOODREADS_KEY || '',
  process.env.GOODREADS_SECRET || '',
  '1.0',
  'http://localhost:3000/auth/callback',
  'HMAC-SHA1',
);

// @ts-ignore
const callbackUrl = oauth._authorize_callback;

const getRequestToken = (): Promise<any> => new Promise((resolve, reject) => {
  oauth.getOAuthRequestToken((error, oAuthToken, oAuthTokenSecret) => {
    if (error) {
      reject(error.data);
    }

    resolve({
      oAuthToken,
      oAuthTokenSecret,
      oAuthUrl: `${process.env.GOODREADS_URL}/oauth/authorize?oauth_token=${oAuthToken}&oauth_callback=${callbackUrl}`,
    });
  });
});

const getAccessToken = (oAuthToken: string, oAuthTokenSecret: string): Promise<any> => new Promise((resolve, reject) => {
  if (!oAuthToken || !oAuthTokenSecret) {
    reject(new Error('No request token!'));
  }
  oauth.getOAuthAccessToken(oAuthToken, oAuthTokenSecret, '1',
    (error: { data?: any; }, accessToken: any, accessTokenSecret: any) => {
      if (error) {
        reject(error.data);
      }
      resolve({
        accessToken,
        accessTokenSecret,
      });
    });
});

const getAuthed = async (path: string, accessToken: string, accessTokenSecret: string): Promise<any> => {
  const xmlResponse: string | Buffer | undefined = await new Promise((resolve, reject) => {
    oauth.get(`${process.env.GOODREADS_URL}${path}`,
      accessToken,
      accessTokenSecret,
      (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
  });
  return parser.parseStringPromise(xmlResponse || '');
};

const get = async (path: string, options?: Record<string, string>): Promise<any> => {
  const params = options ? new URLSearchParams(options) : '';
  const xmlResponse = await axios.get(`${process.env.GOODREADS_URL}${path}?key=${process.env.GOODREADS_KEY}&${params.toString()}`);
  return parser.parseStringPromise(xmlResponse.data);
};

export {
  getRequestToken,
  getAccessToken,
  callbackUrl,
  get,
  getAuthed,
};
