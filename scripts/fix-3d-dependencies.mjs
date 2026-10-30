import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

// 1. Safely add 3D packages to package.json
const pkgPath = path.join(rootDir, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

pkg.dependencies = pkg.dependencies || {}
pkg.dependencies['three'] = '^0.168.0'
pkg.dependencies['@types/three'] = '^0.168.0'
pkg.dependencies['@react-three/fiber'] = '^8.17.14'
pkg.dependencies['@react-three/drei'] = '^9.120.4'

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8')
console.log('Successfully updated package.json with 3D dependencies!')

// 2. Ensure next.config contains transpilePackages for React Three Fiber
let nextConfigPath = path.join(rootDir, 'next.config.mjs')
if (!fs.existsSync(nextConfigPath)) {
  nextConfigPath = path.join(rootDir, 'next.config.js')
}

const nextConfigCode = `/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  reactStrictMode: true,
}

export default nextConfig
`

fs.writeFileSync(path.join(rootDir, 'next.config.mjs'), nextConfigCode, 'utf8')
console.log('Successfully updated next.config.mjs with transpilePackages!')