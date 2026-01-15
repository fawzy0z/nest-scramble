/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import { DynamicModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PostmanCollectionGenerator } from './generators/PostmanCollectionGenerator';
import { MockMiddleware } from './middleware/MockMiddleware';
import { ScannerService } from './scanner/ScannerService';
import { MockGenerator } from './utils/MockGenerator';
import { OpenApiTransformer } from './utils/OpenApiTransformer';
import { DocsController } from './controllers/DocsController';

export interface NestScrambleOptions {
  path?: string;
  enableMock?: boolean;
  autoExportPostman?: boolean;
  postmanOutputPath?: string;
  baseUrl?: string;
  sourcePath?: string;
}

@Module({})
export class NestScrambleModule {
  static forRoot(options: NestScrambleOptions = {}): DynamicModule {
    const {
      path = '/docs',
      enableMock = true,
      autoExportPostman = false,
      postmanOutputPath = 'collection.json',
      baseUrl = 'http://localhost:3000',
      sourcePath = 'src',
    } = options;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 [Nest-Scramble] Initializing Documentation Engine`);
    console.log(`   Developed by Mohamed Mustafa | MIT License`);
    console.log(`${'='.repeat(60)}`);

    const scanner = new ScannerService();
    const controllers = scanner.scanControllers(sourcePath);
    
    console.log(`\n[Nest-Scramble] Generating OpenAPI specification...`);
    const transformer = new OpenApiTransformer(baseUrl);
    const openApiSpec = transformer.transform(controllers, 'NestJS API', '1.0.0', baseUrl);
    console.log(`[Nest-Scramble] OpenAPI spec generated successfully`);

    if (autoExportPostman) {
      console.log(`[Nest-Scramble] Exporting Postman collection...`);
      const generator = new PostmanCollectionGenerator(baseUrl);
      const collection = generator.generateCollection(controllers);
      require('fs').writeFileSync(postmanOutputPath, JSON.stringify(collection, null, 2));
      console.log(`[Nest-Scramble] ✓ Postman collection exported to ${postmanOutputPath}`);
    }

    const port = baseUrl.split(':').pop() || '3000';
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ [Nest-Scramble] Ready!`);
    console.log(`📚 API Docs available at: http://localhost:${port}/docs`);
    console.log(`📄 OpenAPI JSON at: http://localhost:${port}/docs-json`);
    if (enableMock) {
      console.log(`🎭 Mock endpoints at: http://localhost:${port}/scramble-mock/*`);
    }
    console.log(`${'='.repeat(60)}\n`);

    return {
      module: NestScrambleModule,
      providers: [
        ScannerService,
        PostmanCollectionGenerator,
        OpenApiTransformer,
        MockGenerator,
        {
          provide: 'NEST_SCRAMBLE_CONTROLLERS',
          useValue: controllers,
        },
        {
          provide: 'NEST_SCRAMBLE_OPENAPI',
          useValue: openApiSpec,
        },
        {
          provide: 'NEST_SCRAMBLE_OPTIONS',
          useValue: options,
        },
      ],
      exports: [ScannerService, PostmanCollectionGenerator, OpenApiTransformer],
      controllers: [DocsController],
      imports: [],
    };
  }

  static forRootAsync(options: NestScrambleOptions = {}): DynamicModule {
    // Similar to forRoot but with async providers if needed
    return this.forRoot(options);
  }

  configure(consumer: MiddlewareConsumer) {
    // Apply mock middleware if enabled
    consumer
      .apply(MockMiddleware)
      .forRoutes({ path: 'scramble-mock/*', method: RequestMethod.ALL });
  }
}