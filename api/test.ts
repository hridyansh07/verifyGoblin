import type { VercelRequest, VercelResponse } from '@vercel/node';

export default (request: VercelRequest, response: VercelResponse) => {
  const  name = "Testing";
  response.status(200).send(`Hello ${name}!`);
};
