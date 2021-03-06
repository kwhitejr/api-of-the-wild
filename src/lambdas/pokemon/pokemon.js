const _getPokemonId = event => {
  return event && event.queryStringParameters && event.queryStringParameters.id;
};

const handler = ({ logger, env, request }) => async event => {
  let response;
  const id = _getPokemonId(event);
  if (id === undefined || id === null) {
    response = {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" }),
    };
    logger.warn(`Got bad id: ${id}`);
    return Promise.resolve(response);
  }

  const POKEAPI_BASE_URI = env.POKEAPI_BASE_URI || "https://pokeapi.co";
  const POKEAPI_POKEMON_V2 = "api/v2/pokemon";
  const uri = `${POKEAPI_BASE_URI}/${POKEAPI_POKEMON_V2}/${id}`;
  logger.info(`uri: ${uri}`);

  const rpOptions = {
    uri,
    headers: {
      "User-Agent": "Request-Promise",
    },
    json: true,
    resolveWithFullResponse: true,
  };

  try {
    const result = await request(rpOptions);
    response = {
      statusCode: result.statusCode,
      body: JSON.stringify({
        name: result.body.name,
        weight: result.body.weight,
        id: result.body.id,
      }),
    };
  } catch (err) {
    logger.error(err);
    response = {
      statusCode: err.statusCode || 500,
      body: JSON.stringify(err.message),
    };
    return Promise.resolve(response);
  }
  return Promise.resolve(response);
};

module.exports = {
  _getPokemonId,
  handler,
};
