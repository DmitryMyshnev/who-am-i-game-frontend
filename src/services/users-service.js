import axios from '../lib/axios';

async function registrationUser(username, email, password) {
  return axios({
    method: 'post',
    url: '/api/v1/users',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      userName: username,
      email: email,
      password: password,
    }),
  });
}
async function authorisationUser(email, password) {
  return axios({
    method: 'post',
    url: '/api/v1/auth/login',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      email,
      password,
    }),
  });
}
async function sendEmail(email) {
  return axios({
    method: 'post',
    url: '/api/v1/users/password-restore',
    data: {
      email: email,
    },
  });
}
async function sendPass(confirmToken, newPassword, confirmPassword) {
  return axios({
    method: 'put',
    url: `/api/v1/users/access`,
    data: {
      confirmToken,
      newPassword,
      confirmPassword,
    },
  });
}
async function updateUser(userId, username) {
  return axios({
    method: 'put',
    url: `/api/v1/users/${userId}/name`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username,
    },
  });
}

async function confirmUser(token) {
  return axios({
    method: 'get',
    url: '/api/v1/users/confirm',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      token,
    },
  });
}

async function logout() {
  return axios({
    method: 'get',
    url: '/api/v1/users/logout',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function getNewToken(token) {
  return axios({
    method: 'post',
    url: '/api/v1/auth',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      refreshToken: token,
    },
  });
}

async function updatePass(userId, oldPassword, newPassword, confirmPassword) {
  return axios({
    method: 'put',
    url: `/api/v1/users/${userId}/password`,
    data: {
      oldPassword,
      newPassword,
      confirmPassword,
    },
  });
}

export {
  registrationUser,
  authorisationUser,
  sendEmail,
  sendPass,
  updateUser,
  confirmUser,
  logout,
  getNewToken,
  updatePass,
};
