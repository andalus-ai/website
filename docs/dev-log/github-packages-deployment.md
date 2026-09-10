---
layout: default
title: GitHub Packages Deployment
---

# GitHub Packages Deployment Guide

Deploy Gollek packages to GitHub Packages for Maven-based projects and developer distribution.

---

## Overview

Gollek packages are published to **GitHub Packages**, allowing developers to consume them directly in Maven projects without building from source.

### Published Packages

| Package | Repository | Visibility |
|---------|-----------|-----------|
| `tech.kayys.gollek:gollek-parent` | bhangun/gollek | Public |

**Repository URL**: `https://maven.pkg.github.com/bhangun/gollek`

---

## Using Gollek Packages

### Maven Configuration

Add the GitHub Packages repository to your `pom.xml`:

```xml
<repositories>
  <repository>
    <id>github-gollek</id>
    <name>GitHub Packages - Gollek</name>
    <url>https://maven.pkg.github.com/bhangun/gollek</url>
    <releases>
      <enabled>true</enabled>
    </releases>
    <snapshots>
      <enabled>false</enabled>
    </snapshots>
  </repository>
</repositories>
```

### Add Dependency

```xml
<dependency>
  <groupId>tech.kayys.gollek</groupId>
  <artifactId>gollek-parent</artifactId>
  <version>0.1.0</version>
</dependency>
```

### Authentication

GitHub Packages requires authentication. Configure credentials in `~/.m2/settings.xml`:

```xml
<servers>
  <server>
    <id>github-gollek</id>
    <username>YOUR_GITHUB_USERNAME</username>
    <password>YOUR_GITHUB_PAT_TOKEN</password>
  </server>
</servers>
```

#### Generate a Personal Access Token (PAT)

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Set token name (e.g., `Maven GitHub Packages`)
4. Select scopes:
   - ✅ `read:packages` - Read package contents
   - ✅ `write:packages` - Publish packages (if deploying)
5. Click **"Generate token"**
6. Copy the token and add to `settings.xml`

---

## Publishing Packages

### Prerequisites

- Maven 3.6+
- Java 11+
- GitHub account with write access to `bhangun/gollek`
- PAT token with `write:packages` scope

### Configuration

Gollek's `pom.xml` is pre-configured for GitHub Packages:

**Distribution Management**:
```xml
<distributionManagement>
    <repository>
        <id>github</id>
        <name>GitHub Packages</name>
        <url>https://maven.pkg.github.com/bhangun/gollek</url>
    </repository>
    <snapshotRepository>
        <id>github</id>
        <name>GitHub Packages</name>
        <url>https://maven.pkg.github.com/bhangun/gollek</url>
    </snapshotRepository>
</distributionManagement>
```

**Maven Settings** (`~/.m2/settings.xml`):
```xml
<server>
  <id>github</id>
  <username>bhangun</username>
  <password>YOUR_GITHUB_PAT</password>
</server>
```

### Deploy via Maven

```bash
cd gollek
mvn clean deploy -DskipTests
```

**Output**:
```
[INFO] Uploading to github: https://maven.pkg.github.com/bhangun/gollek/...
[INFO] Uploaded: ... (time)
[INFO] BUILD SUCCESS
```

### Deploy via GitHub Actions (Recommended)

The Gollek repository includes an automated GitHub Actions workflow for deployments.

**Workflow File**: `.github/workflows/deploy-github-packages.yml`

**Trigger**: Push a tag matching `gollek-v*`

```bash
# Create and push a release tag
git tag gollek-v0.2.0
git push origin gollek-v0.2.0
```

**Workflow Features**:
- Automatic build and test
- Maven deployment to GitHub Packages
- Build log artifacts
- Deployment summary reporting

---

## Version Management

### Semantic Versioning

Gollek follows semantic versioning:
- **0.1.0**: First release
- **0.2.0**: Minor features/improvements
- **0.2.1**: Bug fixes
- **1.0.0**: Major release

### Update Version

```bash
cd gollek

# Set new version (e.g., 0.2.0)
mvn versions:set -DnewVersion=0.2.0
mvn versions:commit

# Deploy
mvn clean deploy -DskipTests

# Or via git tag
git tag gollek-v0.2.0
git push origin gollek-v0.2.0
```

---

## Package Information

### Current Release

**Package**: `tech.kayys.gollek:gollek-parent:0.1.0`

- **Published**: 2026-04-01
- **Repository**: bhangun/gollek
- **Visibility**: Public
- **License**: MIT (inferred)

### View Packages

- **GitHub Packages Page**: https://github.com/bhangun/gollek/packages
- **Package Details**: https://github.com/bhangun/gollek/packages/2946996

---

## Troubleshooting

### 401 Unauthorized

**Error**:
```
Failed to deploy artifacts: 401 Unauthorized
```

**Solution**:
- Verify PAT token in `~/.m2/settings.xml` is correct
- Check token hasn't expired
- Ensure token has `write:packages` scope
- Regenerate token if necessary

### 403 Forbidden

**Error**:
```
Failed to deploy artifacts: 403 Forbidden
```

**Solution**:
- Verify you have write access to `bhangun/gollek` repository
- Contact repository owner for access

### Artifact Not Found

**Error**:
```
Could not find artifact tech.kayys.gollek:gollek-parent:...
```

**Solution**:
- First deployment may require special handling
- Try with `-DskipTests` flag
- Check version number matches exactly

### Cannot Resolve Dependencies

**Error**:
```
Could not find artifact ... in github
```

**Solution**:
- Verify repository URL: `https://maven.pkg.github.com/bhangun/gollek`
- Add authentication to `~/.m2/settings.xml`
- Check network connectivity

---

## Best Practices

### 1. Use Release Versions

Prefer release versions (e.g., `0.2.0`) over snapshots for production:

```xml
<version>0.2.0</version>  <!-- ✅ Good -->
<!-- vs -->
<version>0.2.0-SNAPSHOT</version>  <!-- Avoid for public packages -->
```

### 2. Semantic Versioning

Follow [semver.org](https://semver.org):
- MAJOR: Breaking changes
- MINOR: New features (backward-compatible)
- PATCH: Bug fixes

### 3. Update pom.xml Before Release

```bash
# Before creating release tag
mvn versions:set -DnewVersion=X.Y.Z
mvn versions:commit
git add pom.xml
git commit -m "Release version X.Y.Z"
git tag gollek-vX.Y.Z
git push origin gollek-vX.Y.Z
```

### 4. Protect Credentials

- ✅ Store PAT in `~/.m2/settings.xml` (local only)
- ✅ Never commit credentials to git
- ✅ Use `.gitignore` if needed
- ✅ Regenerate tokens if exposed

### 5. Test Before Release

```bash
# Test build
mvn clean package

# Verify dependencies resolve
mvn dependency:tree

# Then deploy
mvn clean deploy -DskipTests
```

---

## Integration Examples

### Using Gollek in Your Project

```bash
# Clone your project
git clone https://github.com/your-user/your-project
cd your-project

# Add gollek to pom.xml (as shown above)
# Configure ~/.m2/settings.xml with GitHub credentials

# Run Maven
mvn clean install

# Now use Gollek APIs in your code
```

### Gradle Projects

If using Gradle instead of Maven:

```gradle
repositories {
    maven {
        url "https://maven.pkg.github.com/bhangun/gollek"
        credentials {
            username = project.findProperty("gpr.user") ?: System.getenv("USERNAME")
            password = project.findProperty("gpr.key") ?: System.getenv("TOKEN")
        }
    }
}

dependencies {
    implementation 'tech.kayys.gollek:gollek-parent:0.1.0'
}
```

---

## References

- [Gollek GitHub Repository](https://github.com/bhangun/gollek)
- [Gollek Packages](https://github.com/bhangun/gollek/packages)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Maven Settings Documentation](https://maven.apache.org/settings.html)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

[Back to Developer Guide](/docs/dev-log/developer-guidance) &nbsp; [Architecture](/docs/runtime/architecture) &nbsp; [CLI Installation](/docs/setup/cli-installation)
