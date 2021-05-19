import { RouteOptions } from 'fastify';
import { isAuth } from '../../auth/router/hook';

export const aplyIsAuthPreValidationHook = (routes: RouteOptions[]) => {
  routes.forEach((route: RouteOptions) => {
    route.preValidation = isAuth;
  });
  return routes;
};
