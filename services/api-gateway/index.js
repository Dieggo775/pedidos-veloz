const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const PEDIDOS_URL = process.env.PEDIDOS_URL || 'http://pedidos:3001';
const PAGAMENTOS_URL = process.env.PAGAMENTOS_URL || 'http://pagamentos:3002';
const ESTOQUE_URL = process.env.ESTOQUE_URL || 'http://estoque:3003';

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

// Roteamento para os microsserviços internos
app.use('/api/pedidos', createProxyMiddleware({
  target: PEDIDOS_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/pedidos': '/pedidos' }
}));

app.use('/api/pagamentos', createProxyMiddleware({
  target: PAGAMENTOS_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/pagamentos': '/pagamentos' }
}));

app.use('/api/estoque', createProxyMiddleware({
  target: ESTOQUE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/estoque': '/estoque' }
}));

app.listen(PORT, () => {
  console.log(`[api-gateway] rodando na porta ${PORT}`);
});
