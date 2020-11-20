import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  
  static validateRequest(request: Request): boolean {
    const authorization = Buffer.from(
      request.headers['basic-authorization'] as string,
      'base64'
    ).toString('ascii');
    const [username, password] = authorization.split(':');
    return username === process.env.BASIC_AUTH_USERNAME && password === process.env.BASIC_AUTH_PASSWORD;
  }
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return BasicAuthGuard.validateRequest(request);
  }
}
