import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { COMPANY_JWT_SECRET } from '../../configs/config';

@Injectable()
export class CompanyAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authorizationHeader = req.headers['authorization'];
      let token;

      if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
      }
			
      if (token) {
        const jwtDecode = jwt.verify(token, COMPANY_JWT_SECRET);
        req['_user'] = jwtDecode;
				
        return true;
      } else {
        throw new UnauthorizedException('No token provided');
      }
    } catch (e) {
      throw new UnauthorizedException(
        'Authentication failed. Please try again!',
      );
    }
  }
}
