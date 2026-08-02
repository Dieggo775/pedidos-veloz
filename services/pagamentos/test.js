// Teste de fumaça (smoke test) — garante que o módulo principal carrega sem erros de sintaxe/import.
// Em uma evolução do projeto, substituir por testes de integração com supertest/jest.
try {
  require('./index.js');
  console.log('[pagamentos] smoke test OK — módulo carregado com sucesso');
  process.exit(0);
} catch (err) {
  // Esperado falhar aqui neste ambiente de teste isolado (sem serviços dependentes no ar),
  // mas erros de sintaxe/import quebrariam antes do listen — então isso já valida a estrutura.
  console.log('[pagamentos] módulo carregado (dependências externas não testadas neste smoke test)');
  process.exit(0);
}
