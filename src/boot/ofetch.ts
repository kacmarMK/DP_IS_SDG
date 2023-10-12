import { ofetch } from 'ofetch';

const api = ofetch.create({ baseURL: '/api' });

export { api };
