// HTTP Error Handling Utilities
// Single Responsibility Principle - Only handles error transformation and logging

export function handleRequestError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(String(error));
}
