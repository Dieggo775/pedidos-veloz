variable "project_name" {
  description = "Nome do projeto, usado como prefixo dos recursos"
  type        = string
  default     = "pedidos-veloz"
}

variable "environment" {
  description = "Ambiente de deploy (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "region" {
  description = "Região do provedor de nuvem"
  type        = string
  default     = "us-east-1"
}

variable "cluster_node_count" {
  description = "Número de nós do cluster Kubernetes gerenciado"
  type        = number
  default     = 3
}

variable "cluster_node_instance_type" {
  description = "Tipo de instância dos nós do cluster"
  type        = string
  default     = "t3.medium"
}
