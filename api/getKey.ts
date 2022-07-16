import type { VercelRequest, VercelResponse } from '@vercel/node';

export default (request: VercelRequest, response: VercelResponse) => {  
    response.status(200).send(JSON.stringify(process.env.OPENSEA_API_KEY));
};
