const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir, { extensions: ['html'] }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Clean URLs para o Backoffice
app.get('/backoffice/login', (_req, res) => {
  res.sendFile(path.join(publicDir, 'pages', 'backoffice', 'login.html'));
});

app.get('/backoffice', (_req, res) => {
  res.redirect('/backoffice/dashboard');
});

app.get('/admin', (_req, res) => {
  res.redirect('/backoffice');
});

app.get('/backoffice/dashboard', (_req, res) => {
  res.sendFile(path.join(publicDir, 'pages', 'backoffice', 'dashboard.html'));
});

// Clean URLs para as páginas públicas (remove o /pages/ e o .html)
app.get('/:page', (req, res, next) => {
  const pagePath = path.join(publicDir, 'pages', `${req.params.page}.html`);
  res.sendFile(pagePath, (err) => {
    if (err) {
      // Se não achar a página, passa pro próximo middleware (SPA fallback ou 404)
      next();
    }
  });
});

// SPA fallback
app.use((_req, res) => {
  res.status(404).sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`BLUE HORIZON a servir em http://localhost:${PORT}`);
});
