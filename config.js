// config.js
const ENV = "production"; // change to 'production' when deploying

const CONFIG = {
  development: {
    API_URL: "http://localhost:3000",
  },
  production: {
    API_URL: "https://todolist-lemon-five.vercel.app",
  },
};

window.APP_CONFIG = CONFIG[ENV];
