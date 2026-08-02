# Relatório Técnico — Parte Prática — Pedidos Veloz
_(Formato final: PDF, 3 a 6 páginas, acompanhando o repositório)_

## 1. Visão geral da solução
- Diagrama de arquitetura (usar o do README)
- Resumo dos 4 serviços e suas responsabilidades

## 2. Ambiente local com Docker Compose
- Como o `docker-compose.yml` está organizado (redes, volumes, variáveis)
- Print do `docker compose up` funcionando
- Print de um teste via curl/Postman criando um pedido

## 3. Conteinerização e versionamento
- Estrutura dos Dockerfiles (multi-stage)
- Boas práticas de segurança aplicadas (usuário não-root, imagem alpine, .dockerignore)
- Estratégia de tags de imagem usada

## 4. Kubernetes — produção mínima
- Explicar Deployments, Services, ConfigMaps, Secrets
- Probes de readiness/liveness — por que e como configuradas
- NetworkPolicy e securityContext aplicados

## 5. CI/CD
- Print do pipeline rodando no GitHub Actions
- Explicar os 3 estágios (lint-test, build-and-push, deploy)
- Como os secrets são protegidos

## 6. Observabilidade
- Prints do Grafana/Prometheus (ou explicação conceitual, se não instanciado)
- Fluxo de tracing distribuído coberto

## 7. Estratégia de Deploy e Escalabilidade
- Justificar Rolling Update (padrão) + Canary (pagamentos)
- Configuração do HPA e por que os limites escolhidos fazem sentido para o pico de tráfego

## 8. Infraestrutura como Código
- Resumo do esqueleto Terraform e decisões (ver terraform/README.md)

## 9. Link do vídeo pitch
> ⚠️ PREENCHER após gravar e publicar no YouTube
