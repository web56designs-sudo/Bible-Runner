const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
http.createServer((req,res) => {
  const pathname = new URL(req.url,'http://localhost').pathname;
  const file = path.join(root, pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file,(err,data) => {
    if(err){res.writeHead(404);return res.end('Not found');}
    res.setHeader('Content-Type', ({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(process.env.PORT || 3000,'0.0.0.0',()=>console.log('Bible Runner listening on port '+(process.env.PORT || 3000)));
