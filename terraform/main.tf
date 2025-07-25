terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.0"
    }
  }
}

# ---------------------------
# Google provider
# ---------------------------
provider "google" {
  project = var.project_id
  region  = var.region
}

# ---------------------------
# Reference existing cluster
# ---------------------------
data "google_client_config" "default" {}

data "google_container_cluster" "primary" {
  name     = "yoddhas-gke-cluster"   # existing cluster name
  location = "${var.region}-a"       # zone of existing cluster
}

# ---------------------------
# Kubernetes provider
# ---------------------------
provider "kubernetes" {
  host                   = "https://${data.google_container_cluster.primary.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.primary.master_auth[0].cluster_ca_certificate
  )
}

# ---------------------------
# Kubernetes Deployment
# ---------------------------
resource "kubernetes_deployment" "app" {
  metadata {
    name = "yoddhas-app"
    labels = {
      app = "yoddhas-app"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "yoddhas-app"
      }
    }

    template {
      metadata {
        labels = {
          app = "yoddhas-app"
        }
      }

      spec {
        container {
          name  = "yoddhas"
          image = var.image
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

# ---------------------------
# Kubernetes Service (HTTP)
# ---------------------------
resource "kubernetes_service" "app" {
  metadata {
    name = "yoddhas-service"
  }

  spec {
    selector = {
      app = "yoddhas-app"
    }

    port {
      port        = 80
      target_port = 80
    }

    type = "LoadBalancer"
  }
}
