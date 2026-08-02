# Pedidos Veloz — Plataforma de Pedidos em Microsserviços

> Projeto acadêmico de Cloud DevOps: do ambiente local com Docker Compose à operação em
> Kubernetes, com pipeline de CI/CD, observabilidade e infraestrutura como código.

🎥 **Vídeo pitch:** _[adicionar link do YouTube aqui após gravar]_

## Arquitetura

```
Cliente -> API Gateway -> Serviço de Pedidos -> Serviço de Pagamentos
                                              -> Serviço de Estoque
                        Serviço de Pedidos -> PostgreSQL
                        Serviço de Pedidos -> RabbitMQ (evento "PedidoCriado")
```

| Serviço | Porta | Descrição |
|---|---|---|
| api-gateway | 3000 | Ponto único de entrada, roteia para os demais serviços |
| pedidos | 3001 | Cria/consulta pedidos, integra com Pagamentos, Estoque, Postgres e RabbitMQ |
| pagamentos | 3002 | Simula integração com gateway de pagamento externo |
| estoque | 3003 | Reserva/baixa itens do estoque |

## 1. Rodando localmente (Docker Compose)

Pré-requisitos: Docker e Docker Compose instalados.

```bash
git clone <url-do-seu-repositorio>
cd pedidos-veloz
cp .env.example .env
docker compose up -d --build
```

Testar:

```bash
# Health checks
curl http://localhost:3000/health

# Criar um pedido (fluxo completo: estoque -> pagamento -> persistência -> evento)
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
        "cliente": "Maria Silva",
        "itens": [{ "sku": "sku-001", "quantidade": 2 }],
        "valor": 89.90
      }'
```

Para subir também a stack de observabilidade (Prometheus, Grafana, Jaeger):

```bash
docker compose -f docker-compose.yml -f observability/docker-compose.observability.yml up -d
```
- Grafana: http://localhost:3300 (usuário `admin`, senha `admin`)
- Prometheus: http://localhost:9090
- Jaeger UI: http://localhost:16686
- RabbitMQ management: http://localhost:15672

Derrubar o ambiente:
```bash
docker compose down -v
```

## 2. Build e publicação das imagens

```bash
docker build -t SEU_REGISTRY/pedidos-veloz-api-gateway:latest ./services/api-gateway
docker build -t SEU_REGISTRY/pedidos-veloz-pedidos:latest ./services/pedidos
docker build -t SEU_REGISTRY/pedidos-veloz-pagamentos:latest ./services/pagamentos
docker build -t SEU_REGISTRY/pedidos-veloz-estoque:latest ./services/estoque

docker push SEU_REGISTRY/pedidos-veloz-api-gateway:latest
docker push SEU_REGISTRY/pedidos-veloz-pedidos:latest
docker push SEU_REGISTRY/pedidos-veloz-pagamentos:latest
docker push SEU_REGISTRY/pedidos-veloz-estoque:latest
```
No pipeline de CI/CD (`.github/workflows/ci-cd.yml`) isso é feito automaticamente a cada push
na branch `main`, publicando em `ghcr.io` (GitHub Container Registry).

> **Antes de rodar o pipeline**: edite as imagens em `k8s/*/deployment.yaml`, substituindo
> `SEU_REGISTRY` pelo registry real (ex.: `ghcr.io/seu-usuario`).

## 3. Deploy em Kubernetes

Pré-requisitos: acesso a um cluster (local com kind/minikube ou gerenciado) e `kubectl` configurado.

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/estoque/
kubectl apply -f k8s/pagamentos/
kubectl apply -f k8s/pedidos/
kubectl apply -f k8s/api-gateway/
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/network-policy.yaml

kubectl get pods -n pedidos-veloz
```

### Estratégia de deploy
- **Rolling Update** (padrão, `maxUnavailable: 0`) para api-gateway, pedidos e estoque — zero
  downtime, baixo custo operacional.
- **Canary** para o serviço de Pagamentos (o mais crítico) — ver `k8s/pagamentos/deployment-canary.yaml`.
  Uma versão nova recebe uma fração do tráfego (~20%) antes do rollout completo. Para controle
  fino por peso, ver exemplo com Istio em `observability/otel/istio-canary-example.yaml`.

### Escalabilidade
`HorizontalPodAutoscaler` configurado para `pedidos` e `api-gateway` (2 a 8 réplicas, alvo de
70% de CPU) — ver `k8s/hpa.yaml`. Essencial para o pico de tráfego da campanha promocional.

## 4. CI/CD

Pipeline em `.github/workflows/ci-cd.yml` com 3 estágios:
1. **lint-test** — roda em toda PR e push (lint + testes por serviço)
2. **build-and-push** — build multi-serviço, scan de vulnerabilidades (Trivy) e push para o registry
3. **deploy** — aplica os manifests no cluster e aguarda rollout saudável

Secrets necessários no GitHub (`Settings > Secrets and variables > Actions`):
- `KUBE_CONFIG`: conteúdo do kubeconfig em base64 (`cat ~/.kube/config | base64`)
- `GITHUB_TOKEN`: gerado automaticamente pelo GitHub Actions

## 5. Observabilidade

- **Métricas**: Prometheus faz scrape de `/metrics` em cada serviço; Grafana provisionado com
  datasource já configurado (`observability/grafana/provisioning/`).
- **Logs**: serviços logam em stdout/stderr em formato estruturado (princípio 12-Factor:
  "logs como stream"), prontos para coleta por Loki/ELK/CloudWatch conforme o ambiente.
- **Tracing distribuído**: OpenTelemetry Collector (`observability/otel/otel-collector-config.yaml`)
  recebe spans via OTLP e exporta para Jaeger, cobrindo o fluxo pedido → estoque → pagamento.

## 6. Infraestrutura como Código

Esqueleto Terraform em `terraform/` (módulos `network` e `k8s-cluster`), com justificativa
das decisões em `terraform/README.md`.

## 7. Estrutura do repositório

```
pedidos-veloz/
├── services/            # código-fonte dos 4 microsserviços
├── k8s/                 # manifests Kubernetes
├── terraform/            # infraestrutura como código (esqueleto)
├── observability/        # Prometheus, Grafana, OpenTelemetry
├── .github/workflows/    # pipeline CI/CD
├── docs/                 # relatórios entregáveis (PDF)
└── docker-compose.yml
```

## 8. Documentos do trabalho

- [Relatório Teórico](docs/relatorio-teorico.pdf)
- [Relatório Técnico da Parte Prática](docs/relatorio-tecnico-pratico.pdf)
