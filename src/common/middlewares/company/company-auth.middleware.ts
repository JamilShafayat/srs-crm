import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { COMPANY_JWT_SECRET } from '../../configs/config';

@Injectable()
export class CompanyAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers['authorization'];
      let token;
      if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
      }
      if (token) {
        const jwtDecode = jwt.verify(token, COMPANY_JWT_SECRET);
        req.body['_user'] = jwtDecode;
        next();
      } else {
        throw new UnauthorizedException('No token provided');
      }
    } catch (e) {
      throw new UnauthorizedException(
        'Authentication failed. Please Try again!',
      );
    }
  }
}
