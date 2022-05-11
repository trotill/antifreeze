export function responseFormat ({ data, error = null, token = {} }) {
  return {
    data,
    meta: {
      error,
      token
    }
  }
}

export function reduceSequelizeResponse (rawResponse) {
  let initResult = {}
  if (rawResponse.length) {
    initResult = Object.keys(rawResponse[0]).reduce((acc, next) => {
      acc[next] = []
      return acc
    }, {})
  }
  return rawResponse.reduce((acc, next) => {
    for (const key in next) {
      if (acc[key] === undefined) acc[key] = []
      acc[key].push(next[key])
    }
    return acc
  }, initResult)
}
