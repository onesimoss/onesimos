import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

const filesToInspect = [
  'tailwind.config.js',
  'app/globals.css',
  'components/PipCompanion.tsx',
  'app/kid/[childId]/layout.tsx',
  'app/kid/[childId]/page.tsx',
  'app/kid/[childId]/read/[storyId]/page.tsx',
  'app/kid/[childId]/phonics/page.tsx'
]

console.log('====================================================')
console.log('        ONESIMOS SURGICAL FILE INSPECTION           ')
console.log('====================================================\n')

const inspectionResults = []

for (const relPath of filesToInspect) {
  const fullPath = path.join(rootDir, relPath)
  const exists = fs.existsSync(fullPath)

  if (!exists) {
    inspectionResults.push({
      path: relPath,
      exists: false,
      sizeBytes: 0,
      lines: 0,
      summary: 'FILE MISSING'
    })
    console.log(`[MISSING] ${relPath}`)
    continue
  }

  const content = fs.readFileSync(fullPath, 'utf8')
  const stats = fs.statSync(fullPath)
  const lines = content.split('\n').length

  const hasClayColors = content.includes('clay.cream') || content.includes('#FDF6F0')
  const hasClayPuffyClass = content.includes('clay-puffy-canvas') || content.includes('clay-puffy-frame')
  const hasPipImport = content.includes('PipCompanion')

  inspectionResults.push({
    path: relPath,
    exists: true,
    sizeBytes: stats.size,
    lines,
    hasClayColors,
    hasClayPuffyClass,
    hasPipImport
  })

  console.log(`[EXISTS]  ${relPath}`)
  console.log(`          Size: ${stats.size} bytes | Lines: ${lines}`)
  if (hasClayColors) console.log('          - Pastel clay palette detected')
  if (hasClayPuffyClass) console.log('          - Claymorphism utility classes detected')
  if (hasPipImport) console.log('          - PipCompanion referenced')
  console.log('')
}

const reportPath = path.join(rootDir, 'INSPECTION_REPORT.json')
fs.writeFileSync(reportPath, JSON.stringify(inspectionResults, null, 2), 'utf8')

console.log('====================================================')
console.log(`Inspection complete! Saved to: ${reportPath}`)
console.log('====================================================')