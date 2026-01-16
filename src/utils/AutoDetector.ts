/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import * as fs from 'fs';
import * as path from 'path';

export interface ProjectStructure {
  rootPath: string;
  sourcePath: string;
  packageJson: any;
  tsConfigPath: string;
  hasControllers: boolean;
  controllerPaths: string[];
}

export class AutoDetector {
  /**
   * Auto-detect the project structure and configuration
   */
  static detectProjectStructure(): ProjectStructure {
    const rootPath = process.cwd();
    
    // Try to find package.json
    const packageJsonPath = path.join(rootPath, 'package.json');
    let packageJson: any = {};
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      } catch (error) {
        console.warn('[Nest-Scramble] Could not parse package.json');
      }
    }

    // Auto-detect source path
    const sourcePath = this.detectSourcePath(rootPath);
    
    // Find tsconfig.json
    const tsConfigPath = this.detectTsConfig(rootPath);
    
    // Find controllers
    const controllerPaths = this.findControllers(path.join(rootPath, sourcePath));
    
    return {
      rootPath,
      sourcePath,
      packageJson,
      tsConfigPath,
      hasControllers: controllerPaths.length > 0,
      controllerPaths,
    };
  }

  /**
   * Auto-detect the source directory
   */
  private static detectSourcePath(rootPath: string): string {
    const possiblePaths = ['src', 'lib', 'app', 'source'];
    
    for (const possiblePath of possiblePaths) {
      const fullPath = path.join(rootPath, possiblePath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        // Check if it contains TypeScript files
        const hasTs = this.hasTypeScriptFiles(fullPath);
        if (hasTs) {
          return possiblePath;
        }
      }
    }
    
    // Default to 'src'
    return 'src';
  }

  /**
   * Detect tsconfig.json location
   */
  private static detectTsConfig(rootPath: string): string {
    const possiblePaths = [
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.build.json',
    ];
    
    for (const possiblePath of possiblePaths) {
      const fullPath = path.join(rootPath, possiblePath);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    
    return path.join(rootPath, 'tsconfig.json');
  }

  /**
   * Check if directory has TypeScript files
   */
  private static hasTypeScriptFiles(dirPath: string): boolean {
    try {
      const files = fs.readdirSync(dirPath);
      return files.some(file => file.endsWith('.ts'));
    } catch {
      return false;
    }
  }

  /**
   * Find all controller files recursively
   */
  private static findControllers(dirPath: string, controllers: string[] = []): string[] {
    if (!fs.existsSync(dirPath)) {
      return controllers;
    }

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules and dist
          if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
            this.findControllers(fullPath, controllers);
          }
        } else if (entry.isFile() && entry.name.endsWith('.controller.ts')) {
          controllers.push(fullPath);
        }
      }
    } catch (error) {
      // Silently skip directories we can't read
    }

    return controllers;
  }

  /**
   * Detect the port from environment or default
   */
  static detectPort(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  /**
   * Detect base URL
   */
  static detectBaseUrl(): string {
    const port = this.detectPort();
    const host = process.env.HOST || 'localhost';
    return `http://${host}:${port}`;
  }

  /**
   * Get app name from package.json or default
   */
  static getAppName(): string {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.name || 'NestJS API';
      }
    } catch {
      // Ignore
    }
    return 'NestJS API';
  }

  /**
   * Get app version from package.json or default
   */
  static getAppVersion(): string {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.version || '1.0.0';
      }
    } catch {
      // Ignore
    }
    return '1.0.0';
  }
}
