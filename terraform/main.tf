terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend remoto recomendado para produção (state compartilhado e travado)
  # backend "s3" {
  #   bucket         = "pedidos-veloz-terraform-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "pedidos-veloz-terraform-lock"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.region
}

# ---------------------------------------------------------
# Rede: VPC dedicada, com subnets públicas (ingress) e
# privadas (nós do cluster e banco de dados)
# ---------------------------------------------------------
module "network" {
  source       = "./modules/network"
  project_name = var.project_name
  environment  = var.environment
}

# ---------------------------------------------------------
# Cluster Kubernetes gerenciado (EKS)
# ---------------------------------------------------------
module "k8s_cluster" {
  source              = "./modules/k8s-cluster"
  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.network.vpc_id
  private_subnet_ids  = module.network.private_subnet_ids
  node_count          = var.cluster_node_count
  node_instance_type  = var.cluster_node_instance_type
}
