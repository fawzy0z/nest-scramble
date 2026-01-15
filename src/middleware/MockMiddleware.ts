/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { ControllerInfo, MethodInfo } from '../scanner/ScannerService';
import { MockGenerator } from '../utils/MockGenerator';

@Injectable()
export class MockMiddleware implements NestMiddleware {
  constructor(
    @Inject('NEST_SCRAMBLE_CONTROLLERS') private controllers: ControllerInfo[],
    private mockGenerator: MockGenerator,
  ) {}

  use(req: any, res: any, next: any) {
    const path = req.path;

    // Check if path starts with /scramble-mock/
    if (!path.startsWith('/scramble-mock/')) {
      return next();
    }

    // Remove /scramble-mock/ prefix
    const apiPath = path.replace('/scramble-mock', '');

    // Find matching route
    const match = this.findMatchingRoute(apiPath, req.method);
    if (!match) {
      return res.status(404).json({ error: 'Route not found in scanned controllers' });
    }

    // Generate mock response
    const mockData = MockGenerator.generateMock(match.method.returnType);

    // Set appropriate status code (default to 200)
    const statusCode = this.getStatusCode(match.method.httpMethod);

    res.status(statusCode).json(mockData);
  }

  private findMatchingRoute(path: string, method: string): { controller: ControllerInfo; method: MethodInfo } | null {
    for (const controller of this.controllers) {
      for (const methodInfo of controller.methods) {
        if (methodInfo.httpMethod !== method) continue;

        const fullPath = this.buildPath(controller.path, methodInfo.route);
        if (this.matchPath(fullPath, path)) {
          return { controller, method: methodInfo };
        }
      }
    }
    return null;
  }

  private buildPath(controllerPath: string, methodRoute: string): string {
    const parts = [controllerPath, methodRoute].filter(p => p);
    return '/' + parts.join('/').replace(/\/+/g, '/');
  }

  private matchPath(routePath: string, requestPath: string): boolean {
    // Simple path matching - could be enhanced with parameter extraction
    // For now, exact match or with path params like :id
    const routeParts = routePath.split('/').filter(p => p);
    const requestParts = requestPath.split('/').filter(p => p);

    if (routeParts.length !== requestParts.length) return false;

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const requestPart = requestParts[i];

      if (routePart.startsWith(':')) continue; // Path parameter
      if (routePart !== requestPart) return false;
    }

    return true;
  }

  private getStatusCode(httpMethod: string): number {
    switch (httpMethod) {
      case 'POST':
        return 201;
      case 'DELETE':
        return 204;
      default:
        return 200;
    }
  }
}