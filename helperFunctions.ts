export const fetchGraphQL = async (
  schema: string,
  variables: any = {}
): Promise<any> => {
  const graphql = JSON.stringify({
    query: schema,
    variables,
  });
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": "3fVAMs0P7prKMOzAUb4uUoJF9eTrbPTh0X9sqe6vGnECNT0AHa3Bkyndf81V6pS4",
    },
    body: graphql,
  };
  const database_url = "https://data-logger.hasura.app/v1/graphql";
  const res = await fetch(database_url, requestOptions).then((res: any) =>
    res.json()
  );
  return res;
};