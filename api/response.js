export function responseFormat ({ data, error = null, token = {} }) {
  return {
    data,
    meta: {
      error,
      token
    }
  }
}
