import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

// 1. Scan lib directory for Supabase helpers
function scanLib() {
  const libDir = path.join(rootDir, 'lib')
  if (!fs.existsSync(libDir)) return []
  return fs.readdirSync(libDir, { recursive: true }).map(f => `lib/${f}`)
}

// 2. Find files referencing PipCompanion
function findPipUsage(dirPath) {
  const results = []
  if (!fs.existsSync(dirPath)) return results
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        results.push(...findPipUsage(fullPath))
      }
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      if (content.includes('PipCompanion') && !fullPath.includes('components/PipCompanion.tsx')) {
        results.push(path.relative(rootDir, fullPath))
      }
    }
  }

  return results
}

console.log('=== LIB FILES ===')
console.log(scanLib().join('\n'))

console.log('\n=== FILES IMPORTING PIPCOMPANION ===')
console.log(findPipUsage(path.join(rootDir, 'app')).join('\n'))