
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'zc2umfrr',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skepybKtLTfgsw7YAXSUTvTCnNRIOEhVF3WrFrMfAH1NSWNL904qlba9J4Xtor7G7gLidMxvdM53nCgXIGiDy54ox3OImrJAjwoi7Re9EF4UVm7obyeTiu62gE2ApwuBczGlkvpEvYcSJ0AlDVDonYlRWAoU65mZhBQxYM6KXfNCl7GpRTTW',
  perspective: 'published'
})

async function run() {
  // Find "Fire Sprinklers" exact match
  const docs = await client.fetch(`*[_type in ["mainCategory", "subCategory", "systemType", "product"] && name == "Fire Sprinklers"] {
    _id, 
    _type, 
    name, 
    slug,
    hasVariants
  }`)

  console.log('--- DOC FOUND ---')
  console.log(JSON.stringify(docs, null, 2))

  if (docs.length > 0) {
    const parentId = docs[0]._id
    const type = docs[0]._type
    const slug = docs[0].slug.current
    
    console.log(`\nChecking variants for Parent ID: ${parentId} (Type: ${type}, Slug: ${slug})`)

    const variants = await client.fetch(`*[_type == "variant" && parent._ref == $id]{_id, name, slug}`, { id: parentId })
    console.log(`Found ${variants.length} variants:`)
    console.log(JSON.stringify(variants, null, 2))
    
    if (type === 'subCategory') {
         console.log('\nChecking System Types (children of SubCategory):')
         const children = await client.fetch(`*[_type == "systemType" && parent._ref == $id]{_id, name, slug}`, { id: parentId })
         console.log(JSON.stringify(children, null, 2))
    }
  } else {
    console.log('No document named "Fire Sprinklers" found.')
    // Search for partial
    const partials = await client.fetch(`*[name match "Fire Sprinklers"] { _id, name, _type }`)
    console.log('Did you mean:', JSON.stringify(partials, null, 2))
  }
}

run().catch(console.error)
