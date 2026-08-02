# Relatório Teórico — Pedidos Veloz
_(Formato final: PDF, 2 a 3 páginas)_

## 1. Arquitetura de Microsserviços e o papel do DevOps cloud-native
- O que é arquitetura de microsserviços (contraste com monolito)
- Por que a Loja Veloz se beneficia dessa abordagem (escalabilidade independente, times autônomos)
- Papel do DevOps: unir dev e operações, reduzir tempo de entrega, aumentar confiabilidade

## 2. Conteinerização: Docker vs. Kubernetes
- O que resolve cada um (empacotamento/isolamento vs. orquestração/escala/autocura)
- Quando usar Docker Compose (dev local) vs. Kubernetes (produção)

## 3. Fundamentação teórica
### 3.1 Orquestração de containers
- Conceitos: Pod, Deployment, Service, ReplicaSet, self-healing

### 3.2 CI/CD em ambientes distribuídos
- Pipeline como código, gates de qualidade, deploy automatizado

### 3.3 Observabilidade (métricas, logs, traces)
- Os "3 pilares" da observabilidade e por que são essenciais em microsserviços

## 4. Justificativa das decisões arquiteturais do projeto
- Por que Rolling Update + Canary (pagamentos)
- Por que HPA baseado em CPU
- Por que RabbitMQ para o evento "PedidoCriado" (ou por que decidiu não usar)

## 5. Fonte de pesquisa (fonte primária obrigatória)
> ⚠️ PREENCHER: cite aqui a fonte concreta que você pesquisou (documentação oficial, case
> público, repositório de referência ou post técnico oficial) — a que você escolheu na Semana 1
> do roadmap. Resuma com suas próprias palavras o que a fonte descreve e compare com as
> decisões tomadas neste projeto.

## Referências
> ⚠️ PREENCHER: listar todas as fontes consultadas (documentação oficial do Kubernetes,
> Docker, Terraform, 12-Factor App, etc.)
