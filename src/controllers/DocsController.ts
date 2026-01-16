/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import { Controller, Get, Inject, Res, SetMetadata } from '@nestjs/common';
import { NestScrambleOptions } from '../NestScrambleModule';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller()
@Public()
export class DocsController {
  constructor(
    @Inject('NEST_SCRAMBLE_OPENAPI') private openApiSpec: any,
    @Inject('NEST_SCRAMBLE_OPTIONS') private options: NestScrambleOptions,
  ) {}

  @Get('docs')
  getDocs(@Res() res: any) {
    const primaryColor = this.options.primaryColor || '#00f2ff';
    const customIcon = this.options.customDomainIcon || '';
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${this.options.apiTitle || 'API Documentation'} - Nest-Scramble</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  ${customIcon ? `<link rel="icon" href="${customIcon}" type="image/x-icon">` : ''}
  <style>${this.getProfessionalCSS(primaryColor)}</style>
</head>
<body>
  <div id="api-reference"></div>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  <script>
    console.log('%c🚀 Nest-Scramble by Mohamed Mustafa', 'color: #00f2ff; font-weight: bold; font-size: 16px;');
    
    fetch('/docs-json')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(spec => {
        console.log('%c✅ Spec Loaded:', 'color: #10B981; font-weight: bold;', Object.keys(spec.paths || {}).length, 'endpoints');
        
        if (!spec.paths || Object.keys(spec.paths).length === 0) {
          throw new Error('No endpoints found in OpenAPI spec');
        }
        
        const config = {
          spec: { content: spec },
          darkMode: true,
          layout: 'modern',
          showSidebar: true,
          hideModels: false,
          defaultOpenAllTags: true,
          searchHotKey: 'k'
        };
        
        const container = document.getElementById('api-reference');
        if (container && window.ScalarApiReference) {
          window.ScalarApiReference.mount(container, config);
          console.log('%c✅ Dashboard Ready', 'color: #00f2ff; font-weight: bold;');
        }
      })
      .catch(err => {
        console.error('%c❌ Error:', 'color: #EF4444; font-weight: bold;', err);
        document.getElementById('api-reference').innerHTML = 
          '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:#fff;font-family:Inter,sans-serif"><div style="text-align:center;padding:40px"><h1 style="font-size:64px;margin:0">⚠️</h1><h2 style="margin:20px 0;color:#00f2ff">Failed to Load</h2><p style="color:#999;margin:20px 0">' + err.message + '</p><button onclick="location.reload()" style="padding:12px 32px;background:#00f2ff;border:none;border-radius:8px;color:#000;font-weight:600;cursor:pointer;font-size:14px">Retry</button></div></div>';
      });
  </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  private getProfessionalCSS(primaryColor: string): string {
    return `
    /* 🎨 Professional Three-Column Dashboard by Mohamed Mustafa */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --primary: ${primaryColor};
      --bg-dark: #0a0a0a;
      --bg-card: #141414;
      --border: #2a2a2a;
      --text: #ffffff;
      --text-dim: #999999;
      --green: #10B981;
      --blue: #3B82F6;
      --orange: #F59E0B;
      --purple: #8B5CF6;
      --red: #EF4444;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      background: var(--bg-dark);
      color: var(--text);
      line-height: 1.6;
    }
    
    /* Sidebar - Fixed Navigation */
    aside, nav, [class*="sidebar"] {
      position: fixed !important;
      left: 0;
      top: 0;
      width: 280px !important;
      height: 100vh;
      background: var(--bg-card) !important;
      border-right: 1px solid var(--border) !important;
      overflow-y: auto;
      z-index: 1000;
      padding: 0 !important;
    }
    
    /* Sidebar Header */
    aside::before, [class*="sidebar"]::before {
      content: '👨‍💻 API Dashboard';
      display: block;
      padding: 24px 20px;
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      border-bottom: 1px solid var(--border);
    }
    
    /* Sidebar Links */
    aside a, [class*="sidebar"] a,
    aside button, [class*="sidebar"] button {
      display: block !important;
      padding: 12px 20px !important;
      color: var(--text-dim) !important;
      text-decoration: none !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      border-left: 3px solid transparent !important;
      transition: all 0.2s !important;
    }
    
    aside a:hover, [class*="sidebar"] a:hover {
      background: rgba(255,255,255,0.05) !important;
      color: var(--text) !important;
      border-left-color: var(--primary) !important;
    }
    
    aside a.active, [class*="sidebar"] a.active,
    [aria-selected="true"], [aria-current="page"] {
      background: rgba(0,242,255,0.1) !important;
      color: var(--primary) !important;
      border-left-color: var(--primary) !important;
      font-weight: 600 !important;
    }
    
    /* Main Content Area */
    main, [class*="content"] {
      margin-left: 280px !important;
      padding: 40px !important;
      min-height: 100vh;
    }
    
    /* Three-Column Grid Layout */
    [class*="endpoint"], article {
      display: grid !important;
      grid-template-columns: 1fr 1fr 1fr !important;
      gap: 24px !important;
      max-width: 1600px;
      margin: 0 auto;
    }
    
    /* Column 1: Info & Parameters */
    [class*="description"], [class*="parameters"] {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }
    
    /* Column 2: Request Body Editor */
    [class*="request"], [class*="body"], [class*="editor"] {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }
    
    /* Column 3: Test Panel & Response */
    [class*="test"], [class*="try"], [class*="playground"] {
      background: var(--bg-card);
      border: 1px solid var(--primary);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 0 20px rgba(0,242,255,0.1);
    }
    
    /* HTTP Method Badges */
    [data-method="get"], [class*="method-get"] {
      background: var(--blue) !important;
      color: #fff !important;
      padding: 6px 16px !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      text-transform: uppercase !important;
    }
    
    [data-method="post"], [class*="method-post"] {
      background: var(--green) !important;
      color: #fff !important;
      padding: 6px 16px !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      text-transform: uppercase !important;
    }
    
    [data-method="put"], [class*="method-put"] {
      background: var(--orange) !important;
      color: #fff !important;
      padding: 6px 16px !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      text-transform: uppercase !important;
    }
    
    [data-method="patch"], [class*="method-patch"] {
      background: var(--purple) !important;
      color: #fff !important;
      padding: 6px 16px !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      text-transform: uppercase !important;
    }
    
    [data-method="delete"], [class*="method-delete"] {
      background: var(--red) !important;
      color: #fff !important;
      padding: 6px 16px !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      text-transform: uppercase !important;
    }
    
    /* Send Button */
    button[class*="send"], button[class*="execute"] {
      width: 100% !important;
      padding: 14px 24px !important;
      background: var(--primary) !important;
      color: #000 !important;
      border: none !important;
      border-radius: 8px !important;
      font-weight: 700 !important;
      font-size: 14px !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
    }
    
    button[class*="send"]:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(0,242,255,0.3) !important;
    }
    
    /* Response Terminal */
    [class*="response"], [class*="output"] {
      background: #000 !important;
      border: 1px solid var(--primary) !important;
      border-radius: 8px !important;
      padding: 20px !important;
      font-family: 'JetBrains Mono', monospace !important;
      color: #00ff00 !important;
      font-size: 13px !important;
      max-height: 400px;
      overflow-y: auto;
    }
    
    /* Typography */
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 16px; }
    h2 { font-size: 20px; font-weight: 700; margin: 24px 0 12px; }
    h3 { font-size: 16px; font-weight: 600; margin: 16px 0 8px; }
    p { color: var(--text-dim); line-height: 1.7; }
    
    /* Tables */
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { text-align: left; padding: 12px; background: var(--bg-dark); font-weight: 600; font-size: 12px; text-transform: uppercase; color: var(--text-dim); }
    td { padding: 12px; border-top: 1px solid var(--border); }
    
    /* Inputs */
    input, textarea, select {
      width: 100%;
      background: var(--bg-dark);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px 14px;
      color: var(--text);
      font-size: 14px;
    }
    
    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(0,242,255,0.1);
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-dark); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
    
    /* Branding */
    body::after {
      content: '✨ Powered by Nest-Scramble';
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 8px 16px;
      background: linear-gradient(135deg, var(--primary), var(--purple));
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
    
    /* Responsive */
    @media (max-width: 1200px) {
      [class*="endpoint"], article {
        grid-template-columns: 1fr !important;
      }
    }
    `;
  }


  @Get('docs-json')
  getOpenApiJson(@Res() res: any) {
    try {
      const jsonString = JSON.stringify(this.openApiSpec, null, 2);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(jsonString);
    } catch (error) {
      console.error('[Nest-Scramble] Error serializing OpenAPI spec:', error);
      res.status(500).json({ error: 'Failed to generate OpenAPI specification' });
    }
  }

  @Get('docs/json')
  getOpenApiJsonLegacy(@Res() res: any) {
    return this.getOpenApiJson(res);
  }

  @Get('docs/spec')
  getOpenApiSpec() {
    return this.openApiSpec;
  }
}