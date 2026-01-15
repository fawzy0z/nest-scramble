#!/usr/bin/env node
/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { PostmanCollectionGenerator } from './generators/PostmanCollectionGenerator';
import { ScannerService } from './scanner/ScannerService';

const program = new Command();

program
  .name('nest-scramble')
  .description('Zero-config API Documentation & Postman Generator for NestJS')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate Postman collection from NestJS project')
  .argument('<sourcePath>', 'Path to the source directory (e.g., src)')
  .option('-o, --output <file>', 'Output file path', 'collection.json')
  .option('-b, --baseUrl <url>', 'Base URL for the API', '{{baseUrl}}')
  .action(async (sourcePath: string, options: { output: string; baseUrl: string }) => {
    try {
      console.log('Scanning controllers...');
      const scanner = new ScannerService();
      const controllers = scanner.scanControllers(sourcePath);

      if (controllers.length === 0) {
        console.log('No controllers found.');
        return;
      }

      console.log(`Found ${controllers.length} controllers with ${controllers.reduce((sum, c) => sum + c.methods.length, 0)} methods.`);

      console.log('Generating Postman collection...');
      const generator = new PostmanCollectionGenerator(options.baseUrl);
      const collection = generator.generateCollection(controllers);

      const outputPath = path.resolve(options.output);
      fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));
      console.log(`Postman collection saved to ${outputPath}`);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse();