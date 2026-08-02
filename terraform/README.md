# Terraform — Infraestrutura Pedidos Veloz (esqueleto)

Este diretório contém o **esqueleto de IaC** para provisionar a infraestrutura de produção
da plataforma Pedidos Veloz. É parametrizável por ambiente (dev/staging/prod).

## Justificativa das decisões

- **VPC dedicada com subnets públicas e privadas**: os nós do cluster e o banco de dados
  ficam em subnets privadas (sem exposição direta à internet); apenas o load balancer do
  Ingress fica em subnet pública.
- **Cluster gerenciado (EKS)**: reduz a carga operacional de manter o control plane do
  Kubernetes, permitindo focar em CI/CD, observabilidade e confiabilidade da aplicação.
- **Backend remoto (S3 + DynamoDB) comentado**: em um cenário real de equipe, o state do
  Terraform deve ficar em um backend remoto com lock, evitando conflitos de execução
  simultânea. Foi deixado comentado neste esqueleto para não exigir criação prévia de bucket.
- **Node count e instance type parametrizados**: permite escalar a infraestrutura conforme
  o ambiente (menor em dev, maior em prod) sem duplicar código.

## Como usar (requer credenciais de nuvem configuradas)

```bash
cd terraform
terraform init
terraform plan -var="environment=dev"
terraform apply -var="environment=dev"
```

> Para os fins deste trabalho acadêmico, o esqueleto foi validado com `terraform validate`
> mas não foi aplicado (apply) contra uma conta de nuvem real, para evitar custos.
