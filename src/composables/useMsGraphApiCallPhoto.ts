export async function useMsGraphApiCallPhoto(accessToken: string, endpoint: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(endpoint, options)
    .then((response) => response.blob())
    .catch((error) => {
      console.log(error);
      throw error;
    });
}
