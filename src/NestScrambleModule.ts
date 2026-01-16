/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import { DynamicModule, MiddlewareConsumer, Module, OnModuleInit, RequestMethod } from '@nestjs/common';
import { PostmanCollectionGenerator } from './generators/PostmanCollectionGenerator';
import { MockMiddleware } from './middleware/MockMiddleware';
import { ScannerService } from './scanner/ScannerService';
import { MockGenerator } from './utils/MockGenerator';
import { OpenApiTransformer } from './utils/OpenApiTransformer';
import { DocsController } from './controllers/DocsController';
import { AutoDetector } from './utils/AutoDetector';

export interface NestScrambleOptions {
  path?: string;
  enableMock?: boolean;
  autoExportPostman?: boolean;
  postmanOutputPath?: string;
  baseUrl?: string;
  sourcePath?: string;
  apiTitle?: string;
  apiVersion?: string;
}

@Module({})
export class NestScrambleModule implements OnModuleInit {
  private static moduleOptions: NestScrambleOptions = {};
  private static detectedPort: number = 3000;

  onModuleInit() {
    this.displayDashboard();
  }

  private displayDashboard() {
    const port = NestScrambleModule.detectedPort;
    const options = NestScrambleModule.moduleOptions;
    const projectStructure = AutoDetector.detectProjectStructure();

    console.log('\n┌──────────────────────────────────────────────────────────┐');
    console.log('│  🚀 Nest-Scramble by Mohamed Mustafa is Active!          │');
    console.log('├──────────────────────────────────────────────────────────┤');
    console.log(`│  📖 Docs: http://localhost:${port}/docs${' '.repeat(Math.max(0, 26 - port.toString().length))}│`);
    console.log(`│  📄 JSON: http://localhost:${port}/docs-json${' '.repeat(Math.max(0, 21 - port.toString().length))}│`);
    if (options.enableMock !== false) {
      console.log(`│  🎭 Mock: http://localhost:${port}/scramble-mock${' '.repeat(Math.max(0, 16 - port.toString().length))}│`);
    }
    console.log(`│  ✨ Scanning: ${projectStructure.sourcePath}${' '.repeat(Math.max(0, 43 - projectStructure.sourcePath.length))}│`);
    console.log(`│  🎯 Controllers: ${projectStructure.controllerPaths.length}${' '.repeat(Math.max(0, 40 - projectStructure.controllerPaths.length.toString().length))}│`);
    console.log('└──────────────────────────────────────────────────────────┘\n');
  }

  static forRoot(options: NestScrambleOptions = {}): DynamicModule {
    // Auto-detect project structure
    const projectStructure = AutoDetector.detectProjectStructure();
    
    // Smart defaults with auto-detection
    const config = {
      path: options.path || '/docs',
      enableMock: options.enableMock !== undefined ? options.enableMock : true,
      autoExportPostman: options.autoExportPostman || false,
      postmanOutputPath: options.postmanOutputPath || 'collection.json',
      baseUrl: options.baseUrl || AutoDetector.detectBaseUrl(),
      sourcePath: options.sourcePath || projectStructure.sourcePath,
      apiTitle: options.apiTitle || AutoDetector.getAppName(),
      apiVersion: options.apiVersion || AutoDetector.getAppVersion(),
    };

    // Store for dashboard display
    NestScrambleModule.moduleOptions = config;
    NestScrambleModule.detectedPort = AutoDetector.detectPort();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 [Nest-Scramble] Zero-Config Auto-Detection Engine`);
    console.log(`   Developed by Mohamed Mustafa | MIT License`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n[Nest-Scramble] 🔍 Auto-detected project structure:`);
    console.log(`   Root: ${projectStructure.rootPath}`);
    console.log(`   Source: ${config.sourcePath}`);
    console.log(`   Config: ${projectStructure.tsConfigPath}`);

    const scanner = new ScannerService();
    const controllers = scanner.scanControllers(config.sourcePath);
    
    console.log(`\n[Nest-Scramble] 📦 Generating OpenAPI specification...`);
    const transformer = new OpenApiTransformer(config.baseUrl);
    const openApiSpec = transformer.transform(
      controllers,
      config.apiTitle,
      config.apiVersion,
      config.baseUrl
    );
    console.log(`[Nest-Scramble] ✅ OpenAPI spec generated successfully`);

    if (config.autoExportPostman) {
      console.log(`[Nest-Scramble] 📤 Exporting Postman collection...`);
      const generator = new PostmanCollectionGenerator(config.baseUrl);
      const collection = generator.generateCollection(controllers);
      require('fs').writeFileSync(config.postmanOutputPath, JSON.stringify(collection, null, 2));
      console.log(`[Nest-Scramble] ✓ Postman collection exported to ${config.postmanOutputPath}`);
    }

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
          useValue: config,
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