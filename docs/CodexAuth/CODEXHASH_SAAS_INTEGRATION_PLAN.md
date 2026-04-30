# CodexHash SaaS Integration Plan

## Overview
This document outlines the integration plan for the CodexHash Service into the Codex Admin SaaS section, creating a comprehensive management interface for API tenants, usage tracking, and service billing.

## Current State Analysis

### Existing Infrastructure ✅
- **Models**: `SaasTenant.php` and `CodexHashUsageLog.php` already exist
- **Database**: Tables `saas_tenants` and `codexhash_usage_logs` are set up
- **Admin Area**: Laravel-based admin interface is operational
- **API Key System**: Basic API key generation and validation in place

### Missing Components ❌
- **Controllers**: No SaaS management controllers
- **Views**: No frontend interfaces for SaaS management
- **Routes**: No dedicated SaaS section routes
- **Dashboard**: No SaaS analytics/monitoring dashboard
- **API Integration**: No CodexHash service API endpoints

## Implementation Phases

### Phase 1: Core SaaS Management Interface
**Priority**: High | **Timeline**: 1-2 days

#### 1.1 Controllers
- [ ] `SaasTenantController.php` - Tenant CRUD operations
- [ ] `CodexHashServiceController.php` - Service management
- [ ] `SaaSAnalyticsController.php` - Usage analytics and reporting

#### 1.2 Routes Structure
```php
// SaaS Management Routes
Route::prefix('saas')->name('saas.')->group(function () {
    // Tenant Management
    Route::resource('tenants', SaasTenantController::class);
    Route::get('/tenants/{tenant}/usage', [SaasTenantController::class, 'usage'])->name('tenants.usage');
    Route::post('/tenants/{tenant}/reset-quota', [SaasTenantController::class, 'resetQuota'])->name('tenants.reset-quota');
    Route::post('/tenants/{tenant}/regenerate-key', [SaasTenantController::class, 'regenerateKey'])->name('tenants.regenerate-key');
    
    // CodexHash Service Management
    Route::get('/services', [CodexHashServiceController::class, 'index'])->name('services.index');
    Route::get('/services/status', [CodexHashServiceController::class, 'status'])->name('services.status');
    Route::post('/services/restart', [CodexHashServiceController::class, 'restart'])->name('services.restart');
    
    // Analytics & Reporting
    Route::get('/analytics', [SaaSAnalyticsController::class, 'dashboard'])->name('analytics');
    Route::get('/analytics/usage', [SaaSAnalyticsController::class, 'usage'])->name('analytics.usage');
    Route::get('/analytics/revenue', [SaaSAnalyticsController::class, 'revenue'])->name('analytics.revenue');
});
```

#### 1.3 Views Structure
```
resources/views/admin/saas/
├── layouts/
│   └── saas.blade.php           # SaaS section layout
├── tenants/
│   ├── index.blade.php          # Tenant list with DataTable
│   ├── create.blade.php         # Add new tenant
│   ├── edit.blade.php           # Edit tenant
│   ├── show.blade.php           # Tenant details
│   └── usage.blade.php          # Tenant usage analytics
├── services/
│   ├── index.blade.php          # CodexHash service overview
│   └── status.blade.php         # Service health monitoring
├── analytics/
│   ├── dashboard.blade.php      # Main SaaS analytics
│   ├── usage.blade.php          # Usage analytics
│   └── revenue.blade.php        # Revenue tracking
└── dashboard.blade.php          # SaaS section main dashboard
```

### Phase 2: CodexHash Service Integration
**Priority**: High | **Timeline**: 2-3 days

#### 2.1 Service API Integration
- [ ] Create `CodexHashApiClient.php` service class
- [ ] Implement service health checking
- [ ] Add usage tracking middleware
- [ ] Create webhook handlers for usage events

#### 2.2 Enhanced Models
- [ ] Add service plan management to `SaasTenant`
- [ ] Implement billing calculation methods
- [ ] Add usage aggregation queries
- [ ] Create service status tracking

#### 2.3 Real-time Monitoring
- [ ] WebSocket integration for live usage monitoring
- [ ] Service health dashboard
- [ ] Alert system for quota violations
- [ ] Performance metrics tracking

### Phase 3: Advanced Features
**Priority**: Medium | **Timeline**: 3-5 days

#### 3.1 Billing & Revenue Management
- [ ] Subscription plan management
- [ ] Automated billing calculations
- [ ] Invoice generation
- [ ] Payment tracking integration

#### 3.2 Advanced Analytics
- [ ] Usage trend analysis
- [ ] Performance bottleneck identification
- [ ] Revenue forecasting
- [ ] Custom reporting tools

#### 3.3 API Management
- [ ] Rate limiting configuration
- [ ] API versioning support
- [ ] Documentation generation
- [ ] SDK generation tools

## Technical Specifications

### Database Enhancements
```sql
-- Additional columns for SaaS tenants
ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS 
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    next_billing_date DATE,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    subscription_plan_id BIGINT UNSIGNED,
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(100);

-- Service plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_price DECIMAL(8,2) NOT NULL,
    daily_quota INT NOT NULL,
    monthly_quota INT NOT NULL,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Service Integration Points

#### CodexHash Service Connection
- **Host**: `codex_hash:7001` (Docker network)
- **Health Check**: `GET /health`
- **Usage Endpoint**: `POST /api/v1/track-usage`
- **Status Endpoint**: `GET /api/v1/status`

#### Monitoring Integration
- **Metrics Collection**: Prometheus/Grafana
- **Log Aggregation**: ELK Stack integration
- **Alerting**: Slack/Email notifications

## User Interface Design

### SaaS Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ Codex Admin > SaaS Management                          │
├─────────────────────────────────────────────────────────┤
│ Quick Stats:                                            │
│ [Total Tenants: 45] [Active: 42] [Revenue: $12,340]   │
│ [Today's Requests: 125,432] [Service Status: 🟢]       │
├─────────────────────────────────────────────────────────┤
│ Navigation:                                             │
│ [Dashboard] [Tenants] [Services] [Analytics] [Billing] │
├─────────────────────────────────────────────────────────┤
│ Main Content Area                                       │
│ (Dynamic based on selected section)                    │
└─────────────────────────────────────────────────────────┘
```

### Tenant Management Interface
- **DataTable** with search, filter, and pagination
- **Quick Actions**: Suspend, Reset Quota, View Usage
- **Bulk Operations**: Export, Bulk Email, Plan Migration
- **Real-time Usage Indicators**

### Analytics Dashboard
- **Usage Charts**: Daily/Weekly/Monthly trends
- **Revenue Metrics**: MRR, ARR, Churn rate
- **Performance Metrics**: Response times, error rates
- **Geographic Distribution**: Usage by region

## Security Considerations

### API Security
- [ ] Rate limiting per tenant
- [ ] API key rotation capabilities
- [ ] IP whitelisting support
- [ ] Request signature validation

### Data Protection
- [ ] PII encryption in database
- [ ] Audit logging for all actions
- [ ] GDPR compliance features
- [ ] Data retention policies

### Access Control
- [ ] Role-based permissions
- [ ] Admin activity logging
- [ ] Multi-factor authentication
- [ ] Session management

## Performance Optimization

### Caching Strategy
- [ ] Redis for usage counters
- [ ] Cached analytics queries
- [ ] Service status caching
- [ ] API response caching

### Database Optimization
- [ ] Usage data partitioning
- [ ] Index optimization
- [ ] Query optimization
- [ ] Archive old data

## Testing Strategy

### Unit Tests
- [ ] Model methods testing
- [ ] Service class testing
- [ ] API integration testing
- [ ] Calculation accuracy testing

### Integration Tests
- [ ] End-to-end user flows
- [ ] API endpoint testing
- [ ] Database transaction testing
- [ ] Error handling testing

### Performance Tests
- [ ] Load testing for high traffic
- [ ] Stress testing for quota limits
- [ ] Memory usage optimization
- [ ] Database performance testing

## Deployment Plan

### Development Environment
1. Create feature branch: `feature/codexhash-saas-integration`
2. Implement Phase 1 components
3. Test in local Docker environment
4. Code review and testing

### Staging Environment
1. Deploy to staging server
2. Run integration tests
3. Performance testing
4. User acceptance testing

### Production Deployment
1. Database migrations
2. Zero-downtime deployment
3. Monitor service health
4. Gradual rollout to users

## Success Metrics

### Technical Metrics
- [ ] Page load times < 2 seconds
- [ ] API response times < 500ms
- [ ] 99.9% uptime for SaaS dashboard
- [ ] Zero data loss during operations

### Business Metrics
- [ ] Reduce admin time by 60%
- [ ] Increase tenant satisfaction score
- [ ] Enable 24/7 self-service operations
- [ ] Support 10x current tenant volume

## Next Steps

### Immediate Actions (Week 1)
1. **Create Controllers**: Implement SaaS management controllers
2. **Design Views**: Create responsive admin interfaces
3. **Setup Routes**: Configure SaaS section routing
4. **Database Updates**: Apply schema enhancements

### Short-term Goals (Month 1)
1. **Complete Phase 1**: Core SaaS management interface
2. **Begin Phase 2**: CodexHash service integration
3. **Testing**: Comprehensive testing suite
4. **Documentation**: User and developer guides

### Long-term Vision (Quarter 1)
1. **Advanced Analytics**: Predictive analytics and insights
2. **API Marketplace**: Multi-service API management
3. **White-label Solutions**: Customizable tenant portals
4. **Enterprise Features**: Advanced billing and compliance

---

**Document Version**: 1.0  
**Last Updated**: August 2, 2025  
**Author**: Codex Development Team  
**Status**: Planning Phase
