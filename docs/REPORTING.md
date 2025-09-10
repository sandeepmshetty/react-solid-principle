# 📊 Code Analysis & Reporting System

## Overview

This project includes comprehensive code analysis tools that generate temporary reports for
monitoring code quality, complexity, and maintainability.

## 🚫 Git Policy: Reports are NOT Committed

**Important**: All report files are **temporary** and **excluded from git** via `.gitignore`:

```gitignore
# Analysis and Reports (generated files)
reports/
*.report.json
*.report.html
complexity-*.json
complexity-*.html
```

## 🛠️ Available Analysis Tools

### 1. **Complexity Analysis** (Recommended)

```bash
# Generate comprehensive complexity report (JSON + HTML)
npm run complexity:custom

# Generate and auto-open HTML dashboard
npm run complexity:html
```

**Output**:

- `reports/complexity/complexity-report.html` - Visual dashboard
- `reports/complexity/detailed-report.json` - Raw data

### 2. **ESLint Complexity Analysis**

```bash
# Real-time complexity warnings in console
npm run lint

# Generate ESLint report file
npm run complexity:eslint
```

**Output**:

- Console warnings with file locations
- `reports/complexity/eslint-report.json` - Machine-readable format

### 3. **Legacy Complexity Tool**

```bash
# Original complexity-report tool (has issues)
npm run complexity
```

## 📋 Report Types

| Report Type        | Format           | Best For                    | Regenerate Frequency |
| ------------------ | ---------------- | --------------------------- | -------------------- |
| **HTML Dashboard** | Visual           | Team reviews, presentations | Weekly               |
| **JSON Data**      | Machine-readable | CI/CD, tooling integration  | Every commit         |
| **ESLint Console** | Real-time        | Development feedback        | Continuous           |

## 🎯 Complexity Thresholds

**Green** (Good):

- File complexity: < 10
- File size: < 200 lines
- Function size: < 50 lines

**Yellow** (Warning):

- File complexity: 10-20
- File size: 200-300 lines
- Function size: 50-100 lines

**Red** (Needs Refactoring):

- File complexity: > 20
- File size: > 300 lines
- Function size: > 100 lines

## 🔄 Recommended Workflow

### For Developers:

1. **Before coding**: Run `npm run lint` to see current warnings
2. **During development**: ESLint provides real-time feedback in IDE
3. **Before committing**: Run `npm run complexity:custom` to check impact

### For Teams:

1. **Code reviews**: Include `npm run complexity:html` in review process
2. **Sprint planning**: Review weekly complexity trends
3. **Architecture decisions**: Use reports to identify refactoring targets

### For CI/CD:

```yaml
# Example GitHub Actions step
- name: Generate Complexity Report
  run: |
    npm run complexity:custom
    npm run complexity:eslint
    # Reports are artifacts, not committed
```

## 🧹 Cleanup

Reports can be safely deleted anytime:

```bash
# Remove all generated reports
rm -rf reports/

# Reports will be regenerated on next run
npm run complexity:custom
```

## 📚 Understanding the Reports

### HTML Dashboard Features:

- **Summary metrics**: Total files, lines, average complexity
- **Top complex files**: Ranked list with color-coding
- **Issue detection**: Automatic flagging of problematic areas
- **Recommendations**: Actionable next steps
- **Visual charts**: File size distribution with progress bars

### JSON Report Structure:

```json
{
  "files": [
    {
      "path": "src/component.ts",
      "lines": 150,
      "functions": 8,
      "complexity": 12
    }
  ],
  "summary": {
    "totalFiles": 45,
    "totalLines": 6256,
    "complexityIssues": ["High complexity: file.ts"]
  }
}
```

## 🚀 Best Practices

1. **Don't commit reports** - They're temporary analysis artifacts
2. **Run before refactoring** - Identify highest-impact improvements
3. **Track trends** - Compare complexity over time
4. **Set team standards** - Agree on complexity thresholds
5. **Automate in CI** - Include in build pipeline for monitoring

---

**Remember**: These reports are tools for continuous improvement, not permanent project artifacts!
