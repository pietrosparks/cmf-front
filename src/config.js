export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://crunchmyfare.herokuapp.com'
    : 'http://localhost:4000'
