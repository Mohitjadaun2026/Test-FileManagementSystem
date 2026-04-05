# Backend Configuration

Complete guide to configuring the Spring Boot backend application.

## Configuration Files

### Primary Configuration
- **Location**: `backend/api/src/main/resources/application.yml`
- **Purpose**: Spring Boot application properties
- **Type**: YAML format

### Environment Variables
- **Location**: `.env` file in `backend/api/` directory
- **Purpose**: Runtime configuration, secrets, credentials
- **Type**: Key=Value format
- **Important**: NEVER commit .env file to version control

## Core Application Settings

### Database Configuration

```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Auto-create/update tables
    show-sql: false     # Disable SQL logging in production
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

**Environment Variables**:
- `DB_URL` - JDBC connection string (creates database if not exists)
- `DB_USERNAME` - MySQL username
- `DB_PASSWORD` - MySQL password

**Example**:
```dotenv
DB_URL=jdbc:mysql://localhost:3306/file_load_mgmt?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
```

### File Upload Configuration

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 20MB
```

- Maximum file size limit: 20MB
- Applies to all multipart uploads
- Can be adjusted in `application.yml`
- Validation also performed in code

### Batch Processing Configuration

```yaml
spring:
  batch:
    jdbc:
      initialize-schema: always  # Auto-create Spring Batch tables
```

- Spring Batch job repositories use dedicated tables
- Tables auto-created in `spring_batch_*` namespace
- Separate from application data tables

## Authentication & Security Configuration

### JWT Configuration

```yaml
app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXPIRATION}  # milliseconds
```

**Environment Variables**:
- `JWT_SECRET` - Secret key for signing tokens (minimum 32 characters)
- `JWT_EXPIRATION` - Token lifetime in milliseconds

**Examples**:
```dotenv
JWT_SECRET=your_very_long_secret_key_minimum_32_characters_required
JWT_EXPIRATION=86400000        # 24 hours
# Or: 604800000 for 7 days
# Or: 3600000 for 1 hour (testing)
```

### Google OAuth2 Configuration

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            redirect-uri: ${GOOGLE_REDIRECT_URI}
            scope: profile,email
```

**Environment Variables**:
- `GOOGLE_CLIENT_ID` - Google OAuth2 Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth2 Client Secret
- `GOOGLE_REDIRECT_URI` - Redirect URI after authentication

**How to Get**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web application)
3. Add authorized redirect URIs
4. Copy credentials to `.env`

**Example**:
```dotenv
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret_key
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
```

### Server SSL Configuration

```yaml
server:
  ssl:
    enabled: ${SERVER_SSL_ENABLED}
    key-store: classpath:keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: spring
```

**Environment Variables**:
- `SERVER_SSL_ENABLED` - Enable/disable HTTPS
- `KEYSTORE_PASSWORD` - Keystore file password

**Development**: Set to `false`  
**Production**: Set to `true` with valid certificate

## Application-Specific Configuration

### Frontend Integration

```yaml
app:
  frontend-base-url: ${FRONTEND_BASE_URL}
```

**Purpose**: 
- OAuth2 redirect validation
- CORS origin configuration
- Email links

**Environment Variable**:
```dotenv
FRONTEND_BASE_URL=https://localhost:4200
# Production: FRONTEND_BASE_URL=https://yourdomain.com
```

### Super-Admin Bootstrap

```yaml
app:
  super-admin:
    email: ${SUPER_ADMIN_EMAIL}
    username: ${SUPER_ADMIN_USERNAME}
    password: ${SUPER_ADMIN_PASSWORD}
```

**Purpose**: Automatically creates super-admin user on first startup

**Environment Variables**:
```dotenv
SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=strong_password
```

**Behavior**:
- Runs only if super-admin doesn't exist
- Creates user with SUPER_ADMIN role
- Grants all permissions automatically
- Can be changed later through UI

## Server Configuration

```yaml
server:
  port: ${SERVER_PORT}
  servlet:
    context-path: /api
```

**Environment Variables**:
```dotenv
SERVER_PORT=8080
```

**Context Path**: All endpoints are under `/api/`

## Security Chain Configuration

### CORS (Cross-Origin Resource Sharing)

```yaml
cors:
  allowed-origins:
    - http://localhost:4200
    - https://localhost:4200
  allowed-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
  allowed-headers: "*"
  allow-credentials: true
```

**Development**: Localhost only  
**Production**: Update to your domain

### CSRF Protection

- **Status**: Disabled for API
- **Reason**: Using JWT tokens (stateless)
- **Security**: JWT tokens are cryptographically signed

### Filter Chain Order

1. **Blocked IP Filter** - Check against blocked IPs
2. **JWT Filter** - Validate JWT tokens
3. **Username/Password Filter** - Local authentication
4. **Authorization Filter** - Check permissions

### Public Paths (No Authentication Required)

```
/api/auth/**                              # Registration, login, forgot password
/oauth2/**                                # OAuth2 endpoints
/login/oauth2/**                          # OAuth2 callback
/uploads/**                               # File downloads
/api/super-admin/admin-invites/*/validate # Invite validation
/api/super-admin/admin-invites/accept     # Accept invitation
/swagger-ui.html                          # API documentation
/v3/api-docs/**                           # OpenAPI documentation
/actuator/**                              # Spring Boot actuator (health, metrics)
```

### Protected Paths (Authentication Required)

All other `/api/**` paths require:
- Valid JWT token in `Authorization: Bearer <token>` header, OR
- OAuth2 login session, OR
- Basic authentication

## Method-Level Security

```java
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@PreAuthorize("hasAnyAuthority('USER_ACCESS_CONTROL')")
@PreAuthorize("hasRole('SUPER_ADMIN')")
```

- Annotations on controller methods
- Evaluated at runtime before method execution
- Denials result in 403 Forbidden response

## Logging Configuration

```yaml
logging:
  level:
    root: INFO
    com.fileload: DEBUG      # Development setting
    org.springframework.security: DEBUG
  file:
    name: api-run.log
    max-size: 10MB
    max-history: 5
```

**Production Settings**:
```yaml
logging:
  level:
    root: WARN
    com.fileload: INFO
    org.springframework.security: WARN
```

## Feature Flags Configuration

**Purpose**: Enable/disable features at runtime

Managed via:
- Admin API (`/api/admin/feature-flags`)
- Database storage
- Checked in code before execution

## Monitoring & Actuator Configuration

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

**Available Endpoints**:
- `/actuator/health` - Application health
- `/actuator/metrics` - System metrics
- `/actuator/prometheus` - Prometheus format

## Environment-Specific Profiles

### Development Profile
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

### Production Profile
```bash
mvn spring-boot:run -Dspring.profiles.active=prod
```

## Configuration Priority (Highest to Lowest)

1. Environment Variables (.env file)
2. System Properties (java -D)
3. application.yml file
4. application-{profile}.yml files
5. Default values in code

## Best Practices

### Secrets Management
✅ **DO**:
- Store secrets in .env file
- Use strong passwords (16+ characters)
- Rotate secrets regularly
- Use different values for dev/prod

❌ **DON'T**:
- Commit .env to version control
- Use default passwords
- Store secrets in code
- Use same secrets for dev and prod

### Configuration Files
✅ **DO**:
- Use application.yml for settings
- Use .env for secrets
- Document all variables
- Provide .env.example template

❌ **DON'T**:
- Mix secrets and settings
- Use properties instead of YAML
- Leave variables undocumented
- Hardcode any configuration

### Security Configuration
✅ **DO**:
- Enable SSL in production
- Use strong JWT_SECRET
- Restrict CORS origins in production
- Keep authentication strategy consistent
- Review security checklist before deployment

❌ **DON'T**:
- Disable security features
- Use weak secrets
- Allow all CORS origins in production
- Mix authentication mechanisms
- Skip security hardening

## Troubleshooting Configuration Issues

### Application Won't Start

**Error**: `No qualifying bean of type 'com.fileload...' found`

**Solution**: Check all environment variables are set in .env

**Error**: `Communications link failure`

**Solution**: Verify MySQL is running and DB credentials are correct

### JWT Token Issues

**Error**: `Token is invalid`

**Solution**: Ensure JWT_SECRET is at least 32 characters

### OAuth2 Redirect Error

**Error**: `redirect_uri_mismatch`

**Solution**: GOOGLE_REDIRECT_URI must match exactly what's configured in Google Cloud Console

### Port Already in Use

**Error**: `Address already in use: bind`

**Solution**: Change SERVER_PORT in .env or kill process using port

## Verification Checklist

After configuration:

- [ ] Database connection works (`mysql -h localhost -u root -p file_load_mgmt`)
- [ ] JWT_SECRET is 32+ characters
- [ ] Google OAuth credentials obtained and configured
- [ ] Super-admin credentials set
- [ ] Backend starts without errors
- [ ] Swagger docs accessible at `http://localhost:8080/swagger-ui.html`
- [ ] Frontend can connect to backend
- [ ] Login works
- [ ] File upload works
- [ ] OAuth2 login works

---

**Related Documentation**:
- [Setup & Operations](../setup-and-operations.md)
- [Security Overview](../security/README.md)
- [Backend Architecture](./architecture.md)

---

**Last Updated**: April 2026  
**Version**: 1.0.0
