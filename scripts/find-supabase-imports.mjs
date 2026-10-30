import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

function searchSupabaseUsage(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        searchSupabaseUsage(fullPath)
      }
    } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      if (content.includes('createClient') || content.includes('supabase')) {
        const lines = content.split('\n').filter(l => l.includes('import') && (l.includes('supabase') || l.includes('lib') || l.includes('utils')))
        if (lines.length > 0) {
          console.log(`[${path.relative(rootDir, fullPath)}]`)
          console.log(lines.join('\n'))
          console.log('')
        }
      }
    }
  }
}

console.log('=== SUPABASE IMPORTS IN CODEBASE ===\n')
searchSupabaseUsage(path.join(rootDir, 'app'))