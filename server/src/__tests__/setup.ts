import { config as loadEnv } from "dotenv";

loadEnv({
  path: ".env.test",
});

process.env.NODE_ENV ??= "test";
process.env.MONGO_URI ??= process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/backend-test";
process.env.ACCESS_TOKEN_SECRET ??= process.env.JWT_SECRET ?? "test-access-secret";
process.env.REFRESH_TOKEN_SECRET ??= process.env.REFRESH_SECRET ?? "test-refresh-secret";
process.env.FRONTEND_URL ??= "http://localhost:5173";
process.env.GOOGLE_CLIENT_ID ??= "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "test-google-client-secret";
process.env.GOOGLE_REDIRECT_URI ??=
  process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:5051/api/auth/google/callback";
process.env.SMTP_HOST ??= process.env.MAIL_HOST ?? "localhost";
process.env.SMTP_PORT ??= process.env.MAIL_PORT ?? "1025";
process.env.SMTP_USER ??= process.env.MAIL_USER ?? "test";
process.env.SMTP_PASS ??= process.env.MAIL_PASS ?? "test";
process.env.SENDING_USER ??= "Server <test@example.com>";
process.env.SEND_MAIL ??= "false";
