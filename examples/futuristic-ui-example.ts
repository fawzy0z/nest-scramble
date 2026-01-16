/**
 * Nest-Scramble Futuristic UI - Usage Example
 * Developed by Mohamed Mustafa (@Eng-MMustafa)
 */

import { Module } from '@nestjs/common';
import { NestScrambleModule } from 'nest-scramble';

// ============================================
// Example 1: Full Futuristic Setup
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      // 🎨 Futuristic theme with cyber aesthetics
      theme: 'futuristic',
      
      // 🌈 Custom brand color (Cyber-Cyan by default)
      primaryColor: '#00f2ff',
      
      // 🖼️ Custom favicon for your brand
      customDomainIcon: 'https://your-domain.com/favicon.ico',
      
      // 📝 API metadata
      apiTitle: 'My Futuristic API',
      apiVersion: '2.0.0',
      
      // 🚀 Additional options
      enableMock: true,
      autoExportPostman: true,
      postmanOutputPath: './postman-collection.json',
    }),
  ],
})
export class FuturisticAppModule {}

// ============================================
// Example 2: Custom Purple Theme
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      theme: 'futuristic',
      primaryColor: '#a855f7', // Electric Purple
      apiTitle: 'Purple Dream API',
    }),
  ],
})
export class PurpleThemeModule {}

// ============================================
// Example 3: Classic Professional Theme
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      theme: 'classic',
      primaryColor: '#0066cc', // Corporate Blue
      apiTitle: 'Enterprise API Gateway',
      apiVersion: '1.0.0',
    }),
  ],
})
export class ClassicThemeModule {}

// ============================================
// Example 4: Minimal Setup (Uses Defaults)
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      // Defaults to futuristic theme with #00f2ff
      apiTitle: 'Quick Start API',
    }),
  ],
})
export class MinimalSetupModule {}

// ============================================
// Example 5: Startup/SaaS Branding
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      theme: 'futuristic',
      primaryColor: '#00f2ff',
      customDomainIcon: 'https://startup.com/logo.png',
      apiTitle: 'StartupX Platform API',
      apiVersion: '3.0.0',
      baseUrl: 'https://api.startup.com',
    }),
  ],
})
export class StartupModule {}

// ============================================
// Example 6: Green Eco Theme
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      theme: 'futuristic',
      primaryColor: '#10b981', // Emerald Green
      apiTitle: 'EcoTech API',
      apiVersion: '1.5.0',
    }),
  ],
})
export class EcoThemeModule {}

// ============================================
// Example 7: Orange Energy Theme
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      theme: 'futuristic',
      primaryColor: '#f59e0b', // Amber Orange
      apiTitle: 'Energy Platform API',
    }),
  ],
})
export class EnergyThemeModule {}

// ============================================
// Example 8: Full Configuration
// ============================================
@Module({
  imports: [
    NestScrambleModule.forRoot({
      // UI Customization
      theme: 'futuristic',
      primaryColor: '#00f2ff',
      customDomainIcon: '/favicon.ico',
      
      // API Documentation
      apiTitle: 'Complete API Documentation',
      apiVersion: '2.5.0',
      
      // Routing
      path: '/api-docs',
      
      // Features
      enableMock: true,
      autoExportPostman: true,
      postmanOutputPath: './collections/api.postman.json',
      
      // Server Configuration
      baseUrl: 'https://api.example.com',
      sourcePath: 'src',
    }),
  ],
})
export class FullConfigModule {}

/**
 * 🎨 Available Primary Colors (Examples):
 * 
 * Cyber-Cyan:     #00f2ff (Default)
 * Electric Purple: #a855f7
 * Neon Pink:      #ec4899
 * Emerald Green:  #10b981
 * Amber Orange:   #f59e0b
 * Sky Blue:       #0ea5e9
 * Rose Red:       #f43f5e
 * Violet:         #8b5cf6
 * Lime Green:     #84cc16
 * Fuchsia:        #d946ef
 */

/**
 * 🚀 Features You Get:
 * 
 * ✨ Futuristic Theme:
 * - Deep space dark mode (#050505)
 * - Animated background grid
 * - Glassmorphism cards with backdrop blur
 * - Gradient buttons (cyan → purple)
 * - Spotlight-style search bar
 * - Night Owl code syntax theme
 * - Custom scrollbar styling
 * - Glowing "Powered by Nest-Scramble" badge
 * 
 * 🎭 Easter Eggs:
 * - Beautiful console messages
 * - Theme toggle button (top-right)
 * - localStorage theme persistence
 * 
 * 🖥️ Terminal UI:
 * - Gradient dashboard with ANSI colors
 * - Bold emojis for visual hierarchy
 * - Color-coded sections
 * - Professional startup display
 * 
 * 🎯 Dynamic Branding:
 * - One-line color customization
 * - Custom favicon support
 * - Branded API title
 * - Version display
 */

/**
 * 📖 Usage Instructions:
 * 
 * 1. Import NestScrambleModule in your app.module.ts
 * 2. Configure with forRoot() method
 * 3. Start your NestJS application
 * 4. Navigate to http://localhost:3000/docs
 * 5. Enjoy the futuristic UI! ✨
 * 
 * 🎨 Theme Toggle:
 * - Click the "🎨 Theme" button (top-right)
 * - Switch between Futuristic and Classic
 * - Preference saved in localStorage
 * 
 * 🔍 Console Easter Egg:
 * - Open browser DevTools (F12)
 * - Check the Console tab
 * - See the beautiful messages! 🚀
 */

export default FuturisticAppModule;
