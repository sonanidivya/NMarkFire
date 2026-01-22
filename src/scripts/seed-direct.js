const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Manually read .env.local to avoid dependency issues if dotenv isn't linked for this script
const envPath = path.resolve(process.cwd(), '.env.local')
let env = {}
try {
    const data = fs.readFileSync(envPath, 'utf8')
    data.split('\n').forEach(line => {
        const [k, v] = line.split('=')
        if(k && v) env[k.trim()] = v.trim().replace(/^"|"$/g, '')
    })
} catch(e) {
    console.log('No .env.local found, checking process.env')
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zc2umfrr' // Fallback from structure.ts
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN

console.log(`Config: Project=${projectId}, Dataset=${dataset}, Token=${token ? '***' : 'MISSING'}`)

if (!token) {
    console.error('❌ Error: SANITY_API_TOKEN not found in .env.local. Cannot write data.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false
})

const applications = [
  { title: 'Server Rooms', slug: 'server-rooms', icon: 'Server', priority: 10 },
  { title: 'Commercial Kitchens', slug: 'commercial-kitchens', icon: 'ChefHat', priority: 9 },
  { title: 'Industrial Plants', slug: 'industrial-plants', icon: 'Factory', priority: 8 },
  { title: 'Construction Sites', slug: 'construction-sites', icon: 'HardHat', priority: 7 },
]

async function seed() {
  console.log('🚀 Seeding applications via Direct Node...')
  
  for (const app of applications) {
    const docId = `application-${app.slug}`
    
    try {
        const res = await client.createIfNotExists({
            _id: docId,
            _type: 'application',
            title: app.title,
            slug: { _type: 'slug', current: app.slug },
            icon: app.icon, 
            priority: app.priority,
            isActive: true
        })
        console.log(`✅ Success: ${res.title}`)
    } catch (err) {
        console.error(`❌ Failed ${app.title}:`, err.message)
    }
  }
  console.log('✨ Seed complete.')
}

seed()
