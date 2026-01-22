import { getCliClient } from 'sanity/cli'

const applications = [
  { title: 'Server Rooms', slug: 'server-rooms', icon: 'Server', priority: 10 },
  { title: 'Commercial Kitchens', slug: 'commercial-kitchens', icon: 'ChefHat', priority: 9 },
  { title: 'Industrial Plants', slug: 'industrial-plants', icon: 'Factory', priority: 8 },
  { title: 'Construction Sites', slug: 'construction-sites', icon: 'HardHat', priority: 7 },
]

async function seed() {
  console.log('🚀 Seeding applications...')
  
  const client = getCliClient({apiVersion: '2024-01-01'})

  if (!client) {
      console.error('❌ Failed to initialize client.')
      process.exit(1)
  }

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
