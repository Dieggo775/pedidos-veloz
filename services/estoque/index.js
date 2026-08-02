const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

// "Banco" em memória apenas para fins didáticos do projeto
const estoque = {
  'sku-001': { nome: 'Camiseta Loja Veloz', quantidade: 50 },
  'sku-002': { nome: 'Boné Loja Veloz', quantidade: 30 },
  'sku-003': { nome: 'Caneca Loja Veloz', quantidade: 100 }
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'estoque' });
});

app.get('/estoque', (req, res) => {
  res.json(estoque);
});

// Reserva itens de estoque para um pedido
app.post('/reservas', (req, res) => {
  const { itens } = req.body; // [{ sku: 'sku-001', quantidade: 2 }]
  if (!itens || !Array.isArray(itens)) {
    return res.status(400).json({ erro: 'Informe "itens" como array' });
  }

  for (const item of itens) {
    const produto = estoque[item.sku];
    if (!produto || produto.quantidade < item.quantidade) {
      return res.status(409).json({
        erro: `Estoque insuficiente para ${item.sku}`
      });
    }
  }

  itens.forEach(item => {
    estoque[item.sku].quantidade -= item.quantidade;
  });

  res.status(201).json({ status: 'reservado', itens });
});

app.listen(PORT, () => {
  console.log(`[estoque] rodando na porta ${PORT}`);
});
