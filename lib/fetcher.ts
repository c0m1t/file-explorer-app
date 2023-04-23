export default async function fetcher<TData>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<TData> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();

  return data;
}
