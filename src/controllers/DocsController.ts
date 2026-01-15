/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import { Controller, Get, Inject } from '@nestjs/common';

@Controller()
export class DocsController {
  constructor(
    @Inject('NEST_SCRAMBLE_OPENAPI') private openApiSpec: any,
  ) {}

  @Get('docs')
  getDocs() {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Nest-Scramble API Docs</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; }
  </style>
</head>
<body>
  <div id="scalar-container"></div>
  <script>
    window.onload = function() {
      // Simple mock of Scalar API Reference
      const container = document.getElementById('scalar-container');
      container.innerHTML = '<h1>Nest-Scramble API Documentation</h1><p>OpenAPI spec available at <a href="/docs/spec">/docs/spec</a></p>';
    };
  </script>
</body>
</html>
    `;
  }

  @Get('docs/spec')
  getOpenApiSpec() {
    return this.openApiSpec;
  }
}