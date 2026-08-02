variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "node_count" {
  type    = number
  default = 3
}

variable "node_instance_type" {
  type    = string
  default = "t3.medium"
}
