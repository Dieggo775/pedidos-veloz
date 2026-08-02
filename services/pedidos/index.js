const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const PAGAMENTOS_URL = process.env.PAGAMENTOS_URL || 'http://pagamentos:3002';
const ESTOQUE_URL = process.env.ESTOQUE_URL || 'http://estoque:3003';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'pedidos_user',
  password: process.env.DB_PASSWORD || 'pedidos_pass',
  database: process.env.DB_NAME || 'pedidos_db'
});

let rabbitChannel = null;

async function conectarRabbit() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    rabbitChannel = await conn.createChannel();
    await rabbitChannel.assertQueue('pedido-criado');
    console.log('[pedidos] conectado ao RabbitMQ');
  } catch (err) {
    console.warn('[pedidos] RabbitMQ indisponível, seguindo sem mensageria:', err.message);
  }
}

async function publicarEvento(pedido) {
  if (!rabbitChannel) return;
  try {
    rabbitChannel.sendToQueue(
      'pedido-criado',
      Buffer.from(JSON.stringify(pedido)),
      { persistent: true }
    );
  } catch (err) {
    console.error('[pedidos] falha ao publicar evento PedidoCriado:', err.message);
  }
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      cliente TEXT NOT NULL,
      itens JSONB NOT NULL,
      valor NUMERIC NOT NULL,
      status TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'pedidos' });
});

app.get('/pedidos/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM pedidos WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ erro: 'Pedido não encontrado' });
  res.json(rows[0]);
});

app.post('/pedidos', async (req, res) => {
  const { cliente, itens, valor } = req.body;
  if (!cliente || !itens || !valor) {
    return res.status(400).json({ erro: 'cliente, itens e valor são obrigatórios' });
  }

  try {
    // 1. Reservar estoque
    await axios.post(`${ESTOQUE_URL}/reservas`, { itens });

    // 2. Processar pagamento
    const pagamento = await axios.post(`${PAGAMENTOS_URL}/pagamentos`, {
      pedidoId: null,
      valor,
      metodo: 'cartao'
    });

    const status = pagamento.data.status === 'aprovado' ? 'confirmado' : 'pagamento_recusado';

    // 3. Persistir pedido
    const { rows } = await pool.query(
      `INSERT INTO pedidos (cliente, itens, valor, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [cliente, JSON.stringify(itens), valor, status]
    );

    const pedido = rows[0];

    // 4. Publicar evento "PedidoCriado" (assíncrono, não bloqueia a resposta)
    publicarEvento(pedido);

    res.status(201).json(pedido);
  } catch (err) {
    console.error('[pedidos] erro ao criar pedido:', err.message);
    res.status(502).json({ erro: 'Falha ao processar pedido', detalhe: err.message });
  }
});

app.listen(PORT, async () => {
  await initDb();
  await conectarRabbit();
  console.log(`[pedidos] rodando na porta ${PORT}`);
});
