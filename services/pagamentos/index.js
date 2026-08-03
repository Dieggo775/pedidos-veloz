const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'pagamentos' });
});

// Simula integração com um gateway de pagamento externo.
// Observação: "pedidoId" pode chegar nulo quando o pagamento é processado
// ANTES da persistência do pedido no banco (o ID só existe após o INSERT).
// Por isso validamos apenas "valor", que é o dado essencial para processar.
app.post('/pagamentos', (req, res) => {
  const { pedidoId, valor, metodo } = req.body;

  if (!valor) {
    return res.status(400).json({ erro: 'valor é obrigatório' });
  }

  const aprovado = valor <= 10000;

  res.status(aprovado ? 201 : 402).json({
    pedidoId: pedidoId || null,
    valor,
    metodo: metodo || 'cartao',
    status: aprovado ? 'aprovado' : 'recusado',
    transacaoId: `txn_${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`[pagamentos] rodando na porta ${PORT}`);
});
