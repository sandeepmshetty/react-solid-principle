#!/usr/bin/env node

/**
 * Alternative complexity analysis script
 * Generates a comprehensive complexity report
 */

const fs = require('fs');
const path = require('path');

function analyzeComplexity(dir) {
  const results = {
    files: [],
    summary: {
      totalFiles: 0,
      totalLines: 0,
      averageFileSize: 0,
      largestFile: { name: '', lines: 0 },
      complexityIssues: [],
    },
  };

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (
        stat.isDirectory() &&
        !file.startsWith('.') &&
        file !== 'node_modules'
      ) {
        walkDir(filePath);
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        const relativePath = path.relative(process.cwd(), filePath);

        const fileAnalysis = {
          path: relativePath,
          lines: lines,
          functions: (
            content.match(/function\s+\w+|=>\s*{|const\s+\w+\s*=/g) || []
          ).length,
          complexity: estimateComplexity(content),
        };

        results.files.push(fileAnalysis);
        results.summary.totalFiles++;
        results.summary.totalLines += lines;

        if (lines > results.summary.largestFile.lines) {
          results.summary.largestFile = { name: relativePath, lines };
        }

        // Flag potential issues
        if (lines > 300) {
          results.summary.complexityIssues.push(
            `Large file: ${relativePath} (${lines} lines)`
          );
        }
        if (fileAnalysis.complexity > 20) {
          results.summary.complexityIssues.push(
            `High complexity: ${relativePath} (score: ${fileAnalysis.complexity})`
          );
        }
      }
    });
  }

  function estimateComplexity(content) {
    let complexity = 1;

    // Count decision points
    complexity += (content.match(/if\s*\(/g) || []).length;
    complexity += (content.match(/else\s+if\s*\(/g) || []).length;
    complexity += (content.match(/while\s*\(/g) || []).length;
    complexity += (content.match(/for\s*\(/g) || []).length;
    complexity += (content.match(/switch\s*\(/g) || []).length;
    complexity += (content.match(/case\s+/g) || []).length;
    complexity += (content.match(/catch\s*\(/g) || []).length;
    complexity += (content.match(/&&|\|\|/g) || []).length;

    return complexity;
  }

  walkDir(dir);

  results.summary.averageFileSize = Math.round(
    results.summary.totalLines / results.summary.totalFiles
  );

  return results;
}

// Run analysis
const analysis = analyzeComplexity('./src');

// Generate report
console.log('\n📊 CODE COMPLEXITY ANALYSIS');
console.log('═'.repeat(50));
console.log(`📁 Total Files: ${analysis.summary.totalFiles}`);
console.log(`📄 Total Lines: ${analysis.summary.totalLines.toLocaleString()}`);
console.log(`📏 Average File Size: ${analysis.summary.averageFileSize} lines`);
console.log(
  `📈 Largest File: ${analysis.summary.largestFile.name} (${analysis.summary.largestFile.lines} lines)`
);

console.log('\n🔍 TOP 10 MOST COMPLEX FILES:');
console.log('─'.repeat(50));
analysis.files
  .sort((a, b) => b.complexity - a.complexity)
  .slice(0, 10)
  .forEach((file, index) => {
    console.log(
      `${index + 1}. ${file.path} (complexity: ${file.complexity}, lines: ${file.lines})`
    );
  });

console.log('\n⚠️  COMPLEXITY ISSUES:');
console.log('─'.repeat(50));
if (analysis.summary.complexityIssues.length === 0) {
  console.log('✅ No major complexity issues detected!');
} else {
  analysis.summary.complexityIssues.forEach(issue => {
    console.log(`⚠️  ${issue}`);
  });
}

console.log('\n📋 RECOMMENDATIONS:');
console.log('─'.repeat(50));
console.log('1. Files >300 lines should be split into smaller modules');
console.log('2. Functions >50 lines should be refactored');
console.log('3. High complexity functions should use more abstraction');
console.log('4. Consider using design patterns for complex logic');

// Save detailed report
const reportPath = './reports/complexity/detailed-report.json';
fs.mkdirSync('./reports/complexity', { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
console.log(`\n💾 Detailed report saved to: ${reportPath}`);

// Generate HTML Report
function generateHTMLReport(analysis) {
  const now = new Date().toLocaleString();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Complexity Analysis Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white; 
            padding: 30px; 
            text-align: center;
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 1.1rem; }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            padding: 30px; 
            background: #f8fafc;
        }
        .metric { 
            background: white; 
            padding: 20px; 
            border-radius: 12px; 
            text-align: center;
            border-left: 4px solid #3b82f6;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .metric-value { 
            font-size: 2rem; 
            font-weight: bold; 
            color: #1e40af; 
            display: block;
        }
        .metric-label { 
            color: #64748b; 
            font-size: 0.9rem; 
            margin-top: 5px;
        }
        .section { 
            padding: 30px; 
            border-bottom: 1px solid #e2e8f0;
        }
        .section h2 { 
            color: #1e293b; 
            margin-bottom: 20px; 
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .table th { 
            background: #f1f5f9; 
            padding: 15px; 
            text-align: left; 
            font-weight: 600; 
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
        }
        .table td { 
            padding: 12px 15px; 
            border-bottom: 1px solid #f1f5f9;
        }
        .table tr:hover { background: #f8fafc; }
        .complexity-high { color: #dc2626; font-weight: bold; }
        .complexity-medium { color: #ea580c; font-weight: bold; }
        .complexity-low { color: #16a34a; font-weight: bold; }
        .issues { 
            background: #fef2f2; 
            border: 1px solid #fecaca; 
            border-radius: 8px; 
            padding: 20px;
        }
        .issue { 
            display: flex; 
            align-items: center; 
            gap: 10px; 
            margin-bottom: 10px;
            padding: 10px;
            background: white;
            border-radius: 6px;
        }
        .issue:last-child { margin-bottom: 0; }
        .recommendations { 
            background: #f0f9ff; 
            border: 1px solid #bae6fd; 
            border-radius: 8px; 
            padding: 20px;
        }
        .recommendation { 
            margin-bottom: 10px; 
            padding: 10px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #0ea5e9;
        }
        .chart-container { 
            background: white; 
            border-radius: 8px; 
            padding: 20px; 
            margin-top: 20px;
        }
        .progress-bar { 
            background: #f1f5f9; 
            height: 8px; 
            border-radius: 4px; 
            overflow: hidden; 
            margin-top: 5px;
        }
        .progress-fill { 
            height: 100%; 
            border-radius: 4px; 
            transition: width 0.3s ease;
        }
        .footer { 
            padding: 30px; 
            text-align: center; 
            color: #64748b; 
            background: #f8fafc;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Code Complexity Analysis</h1>
            <p>Generated on ${now} | Enterprise React TypeScript Project</p>
        </div>

        <div class="summary">
            <div class="metric">
                <span class="metric-value">${analysis.summary.totalFiles}</span>
                <div class="metric-label">Total Files</div>
            </div>
            <div class="metric">
                <span class="metric-value">${analysis.summary.totalLines.toLocaleString()}</span>
                <div class="metric-label">Total Lines</div>
            </div>
            <div class="metric">
                <span class="metric-value">${analysis.summary.averageFileSize}</span>
                <div class="metric-label">Avg File Size</div>
            </div>
            <div class="metric">
                <span class="metric-value">${analysis.summary.largestFile.lines}</span>
                <div class="metric-label">Largest File</div>
            </div>
        </div>

        <div class="section">
            <h2>🔍 Most Complex Files</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>File Path</th>
                        <th>Complexity Score</th>
                        <th>Lines</th>
                        <th>Functions</th>
                        <th>Complexity Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${analysis.files
                      .sort((a, b) => b.complexity - a.complexity)
                      .slice(0, 15)
                      .map((file, index) => {
                        const complexityClass =
                          file.complexity > 20
                            ? 'complexity-high'
                            : file.complexity > 10
                              ? 'complexity-medium'
                              : 'complexity-low';
                        const complexityLevel =
                          file.complexity > 20
                            ? 'High'
                            : file.complexity > 10
                              ? 'Medium'
                              : 'Low';

                        return `
                        <tr>
                            <td><strong>${index + 1}</strong></td>
                            <td><code>${file.path}</code></td>
                            <td class="${complexityClass}">${file.complexity}</td>
                            <td>${file.lines}</td>
                            <td>${file.functions}</td>
                            <td class="${complexityClass}">${complexityLevel}</td>
                        </tr>`;
                      })
                      .join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>⚠️ Complexity Issues</h2>
            ${
              analysis.summary.complexityIssues.length === 0
                ? '<div class="recommendations"><div class="recommendation">✅ No major complexity issues detected! Your codebase is well-structured.</div></div>'
                : `<div class="issues">
                ${analysis.summary.complexityIssues
                  .map(issue => `<div class="issue">⚠️ ${issue}</div>`)
                  .join('')}
              </div>`
            }
        </div>

        <div class="section">
            <h2>📋 Recommendations</h2>
            <div class="recommendations">
                <div class="recommendation">
                    <strong>🔧 Large Files:</strong> Files >300 lines should be split into smaller, focused modules
                </div>
                <div class="recommendation">
                    <strong>⚡ Long Functions:</strong> Functions >50 lines should be refactored into smaller, single-purpose functions
                </div>
                <div class="recommendation">
                    <strong>🎯 High Complexity:</strong> Functions with high complexity should use more abstraction and design patterns
                </div>
                <div class="recommendation">
                    <strong>🏗️ Architecture:</strong> Consider applying SOLID principles and clean architecture patterns
                </div>
                <div class="recommendation">
                    <strong>🧪 Testing:</strong> High complexity areas should have comprehensive unit tests
                </div>
            </div>
        </div>

        <div class="section">
            <h2>📈 File Size Distribution</h2>
            <div class="chart-container">
                ${analysis.files
                  .sort((a, b) => b.lines - a.lines)
                  .slice(0, 10)
                  .map(file => {
                    const percentage =
                      (file.lines / analysis.summary.largestFile.lines) * 100;
                    const color =
                      file.lines > 300
                        ? '#dc2626'
                        : file.lines > 200
                          ? '#ea580c'
                          : file.lines > 100
                            ? '#ca8a04'
                            : '#16a34a';

                    return `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-size: 0.9rem;"><code>${file.path}</code></span>
                            <span style="font-weight: bold; color: ${color};">${file.lines} lines</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%; background-color: ${color};"></div>
                        </div>
                    </div>`;
                  })
                  .join('')}
            </div>
        </div>

        <div class="footer">
            <p>📊 Complexity Analysis Report | Generated by React SOLID Enterprise Workspace</p>
            <p>For best results, aim for: Complexity &lt; 10, Files &lt; 300 lines, Functions &lt; 50 lines</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

const htmlReport = generateHTMLReport(analysis);
const htmlPath = './reports/complexity/complexity-report.html';
fs.writeFileSync(htmlPath, htmlReport);
console.log(`🌐 HTML report saved to: ${htmlPath}`);
console.log(`\n🚀 Open the HTML report in your browser:`);
console.log(`   file://${path.resolve(htmlPath)}`);
