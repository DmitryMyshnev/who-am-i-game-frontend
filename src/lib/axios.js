import axios from 'axios';

export function setToken(token) {
  axios.defaults.headers.common['Authorization'] = token
    ? `Bearer ${token}`
    : undefined;
}

export default axios;
