import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CompanyUser = createParamDecorator((ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	console.log('request._user', request._user);
	return request._user;
});
