import { FetchContext, ofetch } from 'ofetch';
import { useAuthStore } from '@/stores/auth-store';

function onResponseError(context: { response: Response }) {
  const { response } = context;

  if (response.status === 403) {
    const authStore = useAuthStore();
    console.log('403');
    authStore.logout();
  }
}

function onRequest(context: FetchContext) {
  const { options } = context;
  const authStore = useAuthStore();

  if (authStore.jwt) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${authStore.jwt}`,
    };
  }
}

const api = ofetch.create({
  baseURL: process.env.API_URL || '/api',
  onResponseError,
  onRequest,
});

export { api };
