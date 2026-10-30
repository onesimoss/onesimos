import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

// --- FIX 1: Remove duplicate Pip from story reader page ---
const storyPagePath = path.join(rootDir, 'app', 'kid', '[childId]', 'read', '[storyId]', 'page.tsx')

if (fs.existsSync(storyPagePath)) {
  let content = fs.readFileSync(storyPagePath, 'utf8')
  
  // Remove import
  content = content.replace(/import\s+PipCompanion\s+from\s+['"]@\/components\/PipCompanion['"];?\r?\n?/g, '')
  content = content.replace(/import\s+PipCompanion\s+from\s+['"]\.\.\/\.\.\/\.\.\/components\/PipCompanion['"];?\r?\n?/g, '')
  
  // Remove JSX tag usages
  content = content.replace(/<PipCompanion[\s\S]*?\/>/g, '')

  fs.writeFileSync(storyPagePath, content, 'utf8')
  console.log('Successfully removed duplicate PipCompanion from story reader page!')
}

// --- FIX 2: Correct Supabase import in kid dashboard page ---
const dashboardPagePath = path.join(rootDir, 'app', 'kid', '[childId]', 'page.tsx')

if (fs.existsSync(dashboardPagePath)) {
  let content = fs.readFileSync(dashboardPagePath, 'utf8')
  
  content = content.replace(/import\s+\{\s*createClient\s*\}\s+from\s+['"]@\/lib\/supabase['"]/g, "import { supabase } from '@/lib/supabaseClient'")
  content = content.replace(/const\s+supabase\s*=\s*createClient\(\)/g, '')

  fs.writeFileSync(dashboardPagePath, content, 'utf8')
  console.log('Successfully corrected Supabase import in Kid Dashboard!')
}