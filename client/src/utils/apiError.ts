export const handleApiError = (err: unknown, defaultMessage: string = 'An unknown error occurred'): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return defaultMessage;
};
