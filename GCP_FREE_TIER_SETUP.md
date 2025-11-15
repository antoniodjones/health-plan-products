# GCP Free Tier Configuration

## Overview

This platform uses **GCP Free Tier for Development and Staging**, converting to paid tiers for Production with real clients.

---

## 🆓 GCP Free Tier Resources (Always Free)

### Compute & Hosting

**Cloud Run**
- ✅ 2 million requests per month
- ✅ 360,000 GB-seconds memory
- ✅ 180,000 vCPU-seconds
- **Perfect for**: API backend, Next.js SSR

**Cloud Functions**
- ✅ 2 million invocations per month
- ✅ 400,000 GB-seconds memory
- ✅ 200,000 GHz-seconds compute
- **Use for**: Background jobs, webhooks

### Database

**Cloud SQL (PostgreSQL)**
- ✅ 1 shared-core instance (db-f1-micro)
- ✅ 10 GB storage (HDD)
- ✅ 10 GB backups
- **Limitations**: Single core, 0.6 GB RAM
- **Upgrade path**: db-custom-2-7680 for production ($70/month)

**Firestore**
- ✅ 1 GB storage
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- **Use for**: Session storage, caching if not using Redis

### Storage

**Cloud Storage**
- ✅ 5 GB regional storage (us-central1, us-west1, us-east1)
- ✅ 1 GB network egress per month
- **Use for**: PDF documents, SBC files, images

### AI & ML

**Vertex AI / Generative AI**
- ⚠️ **Not included in free tier**
- **Cost**: Gemini Pro ~$0.00025/1K characters
- **Budget**: Set $10/month limit for dev/staging
- **Production**: Upgrade as needed

### Networking

**Load Balancing**
- ✅ 1 GB egress to Americas per month
- **Use**: Cloud Run handles load balancing automatically

---

## 📋 Development Environment Setup (Free Tier)

### 1. Cloud SQL (PostgreSQL) - Free Tier
```yaml
Instance Type: db-f1-micro (shared core)
Storage: 10 GB HDD
Region: us-central1
Backups: Automated (included)
High Availability: No
Estimated Cost: $0/month (free tier)
```

**Create Instance**:
```bash
gcloud sql instances create products-benefits-dev \
  --tier=db-f1-micro \
  --region=us-central1 \
  --database-version=POSTGRES_15 \
  --storage-type=HDD \
  --storage-size=10GB \
  --backup \
  --no-assign-ip
```

### 2. Cloud Run (Next.js Backend) - Free Tier
```yaml
CPU: 1 vCPU
Memory: 512 MB
Min Instances: 0 (scale to zero)
Max Instances: 2
Concurrency: 80
Timeout: 300s
Estimated Cost: $0/month (free tier)
```

**Deploy**:
```bash
gcloud run deploy products-benefits-api \
  --source . \
  --region us-central1 \
  --platform managed \
  --cpu 1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 2 \
  --allow-unauthenticated
```

### 3. Cloud Storage (Documents) - Free Tier
```yaml
Bucket: products-benefits-dev-documents
Location: us-central1 (regional)
Storage Class: Standard
Estimated Cost: $0/month (free tier for <5GB)
```

**Create Bucket**:
```bash
gsutil mb -l us-central1 gs://products-benefits-dev-documents
```

### 4. Secret Manager - Free Tier
```yaml
Secrets: Up to 6 active secrets
Access: 10,000 operations/month
Estimated Cost: $0/month (free tier)
```

**Store Secrets**:
```bash
echo -n "your-secret-value" | gcloud secrets create db-password --data-file=-
```

---

## 📊 Staging Environment Setup (Free Tier)

Same as Development, but separate instances:

```bash
# Cloud SQL
gcloud sql instances create products-benefits-staging \
  --tier=db-f1-micro \
  --region=us-central1

# Cloud Run
gcloud run deploy products-benefits-staging \
  --source . \
  --region us-central1 \
  --min-instances 0

# Cloud Storage
gsutil mb -l us-central1 gs://products-benefits-staging-documents
```

**Total Free Tier Cost**: $0/month

---

## 💰 Production Environment (Paid Tier)

### When to Upgrade to Paid

Upgrade when you have **real clients** and need:
- ✅ Better performance (more CPU/RAM)
- ✅ High availability (99.95% SLA)
- ✅ Automated backups with point-in-time recovery
- ✅ More concurrent users
- ✅ Production-grade monitoring

### 1. Cloud SQL (PostgreSQL) - Production
```yaml
Instance Type: db-custom-2-7680 (2 vCPU, 7.5 GB RAM)
Storage: 100 GB SSD
Region: us-central1
High Availability: Yes (multi-zone)
Backups: Automated + point-in-time recovery
Estimated Cost: ~$120/month
```

### 2. Cloud Run - Production
```yaml
CPU: 2 vCPU
Memory: 2 GB
Min Instances: 1 (always warm)
Max Instances: 10
Concurrency: 100
Estimated Cost: ~$50/month
```

### 3. Cloud Storage - Production
```yaml
Storage: 50 GB
Estimated Cost: ~$1.15/month
```

### 4. AI/ML (Gemini Pro) - Production
```yaml
Usage: 10M characters/month
Estimated Cost: ~$2.50/month
```

### 5. Monitoring & Logging
```yaml
Cloud Logging: $0.50/GB
Cloud Monitoring: $2.50/month
Estimated Cost: ~$10/month
```

**Total Production Cost**: ~$185/month

---

## 🔄 Migration Path: Free → Paid

### Step 1: Database Upgrade
```bash
# Create production instance
gcloud sql instances create products-benefits-prod \
  --tier=db-custom-2-7680 \
  --region=us-central1 \
  --availability-type=REGIONAL \
  --storage-type=SSD \
  --storage-size=100GB

# Export from free tier
gcloud sql export sql products-benefits-dev \
  gs://backup-bucket/dev-export.sql \
  --database=products_benefits

# Import to production
gcloud sql import sql products-benefits-prod \
  gs://backup-bucket/dev-export.sql \
  --database=products_benefits
```

### Step 2: Cloud Run Upgrade
```bash
gcloud run services update products-benefits-api \
  --cpu 2 \
  --memory 2Gi \
  --min-instances 1 \
  --max-instances 10
```

### Step 3: Enable Monitoring
```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Create alerting policies
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High CPU Usage"
```

---

## 💡 Cost Optimization Tips

### 1. Scale to Zero in Dev/Staging
```yaml
min-instances: 0  # Scale to zero when not in use
```

### 2. Use Cloud Scheduler for Cleanup
```bash
# Delete old staging data weekly
gcloud scheduler jobs create http cleanup-staging-data \
  --schedule="0 2 * * 0" \
  --uri="https://your-api.run.app/admin/cleanup"
```

### 3. Set Budget Alerts
```bash
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Dev/Staging Budget" \
  --budget-amount=20 \
  --threshold-rule=percent=90
```

### 4. Use Preemptible Instances for Batch Jobs
```yaml
# For background processing
--preemptible  # 80% cheaper than regular instances
```

---

## 📊 Expected Monthly Costs

| Environment | Monthly Cost | Notes |
|-------------|-------------|-------|
| **Development** | $0 | Free tier |
| **Staging** | $0 | Free tier |
| **Production** (1-5 clients) | $185 | Paid tier |
| **Production** (5-10 clients) | $300 | Scale up |
| **Production** (10+ clients) | $500+ | Full scale |

---

## 🚨 Important Notes

1. **Free Tier Expiration**: GCP "Always Free" has no expiration (vs 90-day trial)
2. **Monitoring**: Check usage dashboard weekly to avoid surprises
3. **Budget Alerts**: Set up before enabling paid services
4. **Resource Labels**: Tag all resources with `env=dev|staging|prod`

---

## 🔐 Security Best Practices (Free Tier Compatible)

```bash
# Enable VPC Service Controls (free)
gcloud services vpc-peerings connect \
  --service=servicenetworking.googleapis.com \
  --ranges=google-managed-services-default

# Enable Workload Identity (free)
gcloud iam service-accounts create products-benefits-sa

# Use Secret Manager (free up to 6 secrets)
gcloud secrets create DATABASE_URL --data-file=-
```

---

## ✅ Setup Checklist

**Development (Free Tier)**
- [ ] Create GCP project
- [ ] Enable billing (free tier requires billing account)
- [ ] Create Cloud SQL (db-f1-micro)
- [ ] Deploy to Cloud Run (512MB)
- [ ] Create Cloud Storage bucket
- [ ] Store secrets in Secret Manager
- [ ] Set budget alert at $5

**Staging (Free Tier)**
- [ ] Duplicate dev setup with `-staging` suffix
- [ ] Set budget alert at $5

**Production (Paid - When Ready)**
- [ ] Upgrade Cloud SQL to db-custom-2-7680
- [ ] Scale Cloud Run (2GB, min-instances=1)
- [ ] Enable high availability
- [ ] Set budget alert at $200
- [ ] Enable monitoring & logging

---

**Next Steps**: See `SETUP_INSTRUCTIONS.md` for local development setup with Docker

