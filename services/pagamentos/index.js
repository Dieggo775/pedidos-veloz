const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'pagamentos' });
});

// Simula integração com um gateway de pagamento externo
app.post('/pagamentos', (req, res) => {
  const { pedidoId, valor, metodo } = req.body;

  if (!pedidoId || !valor) {
    return res.status(400).json({ erro: 'pedidoId e valor são obrigatórios' });
  }

  // Regra simplificada: valores acima de 10.000 são recusados (simulação de fraude)
  const aprovado = valor <= 10000;

  res.status(aprovado ? 201 : 402).json({
    pedidoId,
    valor,
    metodo: metodo || 'cartao',
    status: aprovado ? 'aprovado' : 'recusado',
    transacaoId: `txn_${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`[pagamentos] rodando na porta ${PORT}`);
});
