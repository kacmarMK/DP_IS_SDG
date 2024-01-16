import { ErrorResponse } from '@/models/ErrorResponse';
import { FetchError } from 'ofetch';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth-store';

function handleError(error: unknown, defaultErrorMessage: string): void {
  let message = defaultErrorMessage;

  const authStore = useAuthStore();

  if (error instanceof FetchError) {
    const errorData = error.response?._data;
    if (errorData && typeof errorData === 'object' && 'errors' in errorData) {
      const errorResponse = errorData as ErrorResponse;
      message = errorResponse.errors?.[0] ?? defaultErrorMessage;
    }
    if (
      !errorData &&
      error.response?.status === 403 &&
      authStore.isTokenExpired
    ) {
      message = '';
    }
  }

  if (message.length > 0) {
    toast.error(message);
  }
}

export { handleError };
