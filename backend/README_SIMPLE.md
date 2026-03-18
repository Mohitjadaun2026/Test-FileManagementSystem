# Backend - File Management System

## Prerequisites
- Java 21+
- Maven 3.9+
- MySQL 8.0+

## Database Setup
```powershell
net start MySQL80
```

Optional - Create database:
```powershell
mysql -u root -p
CREATE DATABASE file_load_mgmt;
EXIT;
```

## Quick Start

### 1. Go to Backend
```powershell
cd backend
```

### 2. Set Password (Optional)
```powershell
$env:DB_PASSWORD="your_password"
```

### 3. Build (First Time Only)
```powershell
mvn clean install -DskipTests
```

### 4. Start
```powershell
mvn -f api/pom.xml spring-boot:run
```

Or from project root:
```powershell
npm run backend
```

### 5. Verify
Open: `http://localhost:8080/swagger-ui.html`

## Commands
```powershell
mvn clean install -DskipTests       # Build
mvn test                            # Run tests
mvn -f api/pom.xml spring-boot:run  # Start
mvn clean                           # Clean
```

## Config
File: `api/src/main/resources/application.yml`
- Database: `file_load_mgmt`
- Username: `root`
- Password: (set via `DB_PASSWORD` env var)
- URL: `localhost:3306`

## Issues
- **Port 8080 in use?** → `mvn -f api/pom.xml spring-boot:run -Dserver.port=8081`
- **MySQL not running?** → `net start MySQL80`
- **Build fails?** → `mvn clean install -DskipTests`
- **Connection error?** → Start MySQL, check password, ensure database exists

**Frontend calls: http://localhost:8080/api**

