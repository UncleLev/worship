import axios from "axios";

export const api = axios.create({
  // baseURL: process.env.API || '',
  // baseURL: 'http://localhost:3000',
  baseURL: 'https://songs-editor.onrender.com',
  timeout: 10000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

