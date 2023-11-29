import { ofetch } from 'ofetch';

const api = ofetch.create({ baseURL: process.env.API_URL || '/api' });

export { api };
