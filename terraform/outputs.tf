output "vpc_id" {
  description = "ID da VPC criada"
  value       = module.network.vpc_id
}

output "cluster_endpoint" {
  description = "Endpoint do cluster Kubernetes"
  value       = module.k8s_cluster.cluster_endpoint
}

output "cluster_name" {
  description = "Nome do cluster Kubernetes"
  value       = module.k8s_cluster.cluster_name
}
