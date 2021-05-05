import { RouteOptions } from 'fastify';
import { isAuth } from '../../auth/router/hook';

export const aplyIsAuthOnRequestHook = (routes: RouteOptions[]) => {
  routes.forEach((route: RouteOptions) => {
    route.onRequest = isAuth;
  });
  return routes;
};
