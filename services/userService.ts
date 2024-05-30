import api from './api';

const getUsers = () => {
  return api.get('/users');
};

export default {
  getUsers,
};
