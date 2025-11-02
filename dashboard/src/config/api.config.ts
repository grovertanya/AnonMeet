// config/api.config.ts
export const API_CONFIG = {
  baseURL: 'https://anonmeet.onrender.com/',
  wsURL: 'ws://localhost:5000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const ENDPOINTS = {
  meetings: {
    create: '/meetings',
    join: '/meetings/:id/join',
    leave: '/meetings/:id/leave',
    list: '/meetings',
    get: '/meetings/:id',
    update: '/meetings/:id',
    delete: '/meetings/:id',
  },
  users: {
    list: '/users',
  },
  media: {
    token: '/media/token',
    upload: '/media/upload',
  },
};