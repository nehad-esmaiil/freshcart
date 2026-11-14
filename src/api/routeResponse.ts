export async function readRouteJson(response: Response) {
  return response.json().catch(() => null);
}

export async function readRouteAction(response: Response) {
  const data = await readRouteJson(response);
  if (response.ok && data && typeof data === 'object') return data;

  return {
    status: 'fail',
    message: typeof data?.message === 'string'
      ? data.message
      : response.ok ? 'Route returned an invalid response.' : 'Route returned HTTP ' + response.status + '.',
  };
}
