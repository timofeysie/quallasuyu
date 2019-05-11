import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as jwksRsa from 'jwks-rsa';
import * as jwt from 'express-jwt';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(checkJwt);
  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/${globalPrefix}`);
  });
}

require('dotenv').config();
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://'+AUTH0_DOMAIN+'/.well-known/jwks.json'
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_CLIENT_ID,
  issuer: 'https://'+AUTH0_DOMAIN'+/',
  algorithms: ['RS256']
});

bootstrap();
