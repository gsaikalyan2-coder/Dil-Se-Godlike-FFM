const fs = require('fs');

function convertHtmlToJsx(file, componentName) {
  let content = fs.readFileSync(file, 'utf8');
  
  let bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if(!bodyMatch) {
    console.error("No body found for " + file);
    return;
  }
  
  let html = bodyMatch[1];
  
  let mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    html = `<main className="flex-1 pt-20">\n` + mainMatch[1] + `\n</main>`;
  } else {
    html = html.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
    html = html.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  }
  
  html = html.replace(/class=/g, 'className=');
  html = html.replace(/for=/g, 'htmlFor=');
  
  // Clean up inline styles
  html = html.replace(/style="([^"]+)"/g, (match, styleStr) => {
    const rules = styleStr.split(';').filter(s => s.trim());
    const objStr = rules.map(r => {
      let [k, v] = r.split(':');
      if(!k || !v) return '';
      k = k.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return `'${k}': '${v.trim().replace(/'/g, "\\'")}'`;
    }).join(', ');
    return `style={{${objStr}}}`;
  });
  
  // Handle empty tags like <br> and <hr> ensuring they are closed
  html = html.replace(/<br>/g, '<br />');
  html = html.replace(/<hr([^>]*)>/g, (match, attrs) => {
    if(attrs && attrs.endsWith('/')) return match;
    return `<hr${attrs || ''} />`;
  });

  // Handle self-closing img and svg correctly
  html = html.replace(/<img(.*?)>/g, (match, attrs) => {
    if(attrs.trim().endsWith('/')) return match;
    return `<img${attrs} />`;
  });

  html = html.replace(/<input(.*?)>/g, (match, attrs) => {
    if(attrs.trim().endsWith('/')) return match;
    return `<input${attrs} />`;
  });

  // Fix HTML comments to JSX comments
  html = html.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  // Strip script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  let jsx = `import React from 'react';\n\nconst ${componentName} = () => {\n  return (\n    <div className="bg-background text-on-background min-h-screen font-body w-full">\n      ${html}\n    </div>\n  );\n};\n\nexport default ${componentName};\n`;
  
  fs.writeFileSync('src/pages/' + componentName + '.js', jsx);
  console.log(`Converted ${file} to ${componentName}`);
}

convertHtmlToJsx('heartbreak.html', 'Heartbreak');
convertHtmlToJsx('home.html', 'Home');
