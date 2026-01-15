/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import { ControllerInfo, MethodInfo } from '../scanner/ScannerService';
import { AnalyzedType } from './DtoAnalyzer';

interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
  }>;
  paths: Record<string, Record<string, any>>;
  components: {
    schemas: Record<string, any>;
  };
}

export class OpenApiTransformer {
  private schemas: Record<string, any> = {};
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Transforms ControllerInfo array into OpenAPI 3.0.0 specification
   * @param controllers Array of controller information
   * @param title API title
   * @param version API version
   * @param baseUrl Base URL for the API
   * @returns OpenAPI specification object
   */
  transform(controllers: ControllerInfo[], title = 'NestJS API', version = '1.0.0', baseUrl = 'http://localhost:3000'): OpenApiSpec {
    this.schemas = {};

    const paths: Record<string, Record<string, any>> = {};

    for (const controller of controllers) {
      for (const method of controller.methods) {
        const fullPath = this.buildPath(controller.path, method.route);
        const operation = this.createOperation(method);

        if (!paths[fullPath]) {
          paths[fullPath] = {};
        }

        paths[fullPath][method.httpMethod.toLowerCase()] = operation;
      }
    }

    return {
      openapi: '3.0.0',
      info: {
        title,
        version,
        description: 'Generated from NestJS controllers using nest-scramble',
      },
      servers: [
        {
          url: baseUrl,
        },
      ],
      paths,
      components: {
        schemas: this.schemas,
      },
    };
  }

  private buildPath(controllerPath: string, methodRoute: string): string {
    const parts = [controllerPath, methodRoute].filter(p => p);
    return '/' + parts.join('/').replace(/\/+/g, '/');
  }

  private createOperation(method: MethodInfo): any {
    const operation: any = {
      summary: method.name,
      responses: {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: this.analyzedTypeToSchema(method.returnType),
            },
          },
        },
      },
    };

    // Add parameters
    const parameters: any[] = [];
    for (const param of method.parameters) {
      if (param.decorator?.includes('@Body')) {
        operation.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: this.analyzedTypeToSchema(param.type),
            },
          },
        };
      } else if (param.decorator?.includes('@Query')) {
        // For query params, if it's an object, add properties as query params
        if (param.type.properties) {
          for (const prop of param.type.properties) {
            parameters.push({
              name: prop.name,
              in: 'query',
              schema: this.analyzedTypeToSchema(prop.type),
              required: !prop.type.isOptional,
            });
          }
        }
      } else if (param.decorator?.includes('@Param')) {
        parameters.push({
          name: param.name,
          in: 'path',
          required: true,
          schema: this.analyzedTypeToSchema(param.type),
        });
      }
    }

    if (parameters.length > 0) {
      operation.parameters = parameters;
    }

    // Add code samples
    operation['x-code-samples'] = this.generateCodeSamples(method);

    return operation;
  }

  private analyzedTypeToSchema(type: AnalyzedType): any {
    if (type.isArray) {
      return {
        type: 'array',
        items: this.analyzedTypeToSchema({ ...type, isArray: false }),
      };
    }

    if (type.unionTypes) {
      return {
        oneOf: type.unionTypes.map(t => this.typeStringToSchema(t)),
      };
    }

    if (type.properties) {
      const schemaName = type.type || 'Object';
      if (!this.schemas[schemaName]) {
        const properties: Record<string, any> = {};
        const required: string[] = [];

        for (const prop of type.properties) {
          properties[prop.name] = this.analyzedTypeToSchema(prop.type);
          if (!prop.type.isOptional) {
            required.push(prop.name);
          }
        }

        this.schemas[schemaName] = {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
        };
      }

      return {
        $ref: `#/components/schemas/${schemaName}`,
      };
    }

    return this.typeStringToSchema(type.type);
  }

  private generateCodeSamples(method: MethodInfo): any[] {
    const fullPath = this.buildPath('', method.route); // Assuming base path is handled elsewhere
    const samples = [];

    // Curl sample
    samples.push({
      lang: 'curl',
      source: `curl -X ${method.httpMethod} "${this.baseUrl}${fullPath}" \\\n  -H "Content-Type: application/json" \\\n  -d '{}'`,
    });

    // JavaScript Fetch sample
    samples.push({
      lang: 'javascript',
      source: `fetch('${this.baseUrl}${fullPath}', {\n  method: '${method.httpMethod}',\n  headers: {\n    'Content-Type': 'application/json',\n  },\n  body: JSON.stringify({}),\n})\n  .then(response => response.json())\n  .then(data => console.log(data));`,
    });

    // TypeScript sample
    samples.push({
      lang: 'typescript',
      source: `// Assuming you have the DTO types\nimport axios from 'axios';\n\nconst response = await axios.${method.httpMethod.toLowerCase()}('${this.baseUrl}${fullPath}', {});\nconsole.log(response.data);`,
    });

    return samples;
  }

  private typeStringToSchema(type: string): any {
    const lowerType = type.toLowerCase();

    if (lowerType.includes('string')) {
      return { type: 'string' };
    }

    if (lowerType.includes('number') || lowerType.includes('int') || lowerType.includes('float')) {
      return { type: 'number' };
    }

    if (lowerType.includes('boolean')) {
      return { type: 'boolean' };
    }

    if (lowerType.includes('date')) {
      return { type: 'string', format: 'date-time' };
    }

    // Default to string
    return { type: 'string' };
  }
}