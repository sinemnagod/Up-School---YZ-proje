import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getIngredientId(inci_name: string): Promise<string | null> {
  const ing = await prisma.ingredient.findFirst({
    where: { inci_name: { equals: inci_name, mode: 'insensitive' } }
  })
  return ing?.id ?? null
}

async function main() {
  const products = [
    {
      name: 'Low pH Good Morning Gel Cleanser',
      brand: 'COSRX',
      category: 'CLEANSER' as const,
      description: 'A gentle low pH gel cleanser with Tea Tree Oil and natural BHA that removes excess sebum, balances skin pH, and keeps the moisture barrier healthy without stripping the skin.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/Cosrx_-_Low_Ph_Good_Morning_Gel_Cleanser_Korendy_8_grande.jpg?v=1763301204',
      skin_type_tags: ['OILY', 'COMBINATION', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: [
        'Cocamidopropyl Betaine', 'Betaine', 'Allantoin',
        'Ethylhexylglycerin', 'Sodium Benzoate', 'Centella Asiatica Extract',
      ]
    },
    {
      name: 'Birch Juice Sunscreen SPF50+ PA++++',
      brand: 'Round Lab',
      category: 'SPF' as const,
      description: 'A hydrating, brightening sunscreen enriched with Silver Birch Extract, Niacinamide, and Vita Hyaluronic Acid. Provides strong UVA/UVB protection without white cast. Suitable as a makeup base.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/RoundLabBirchJuiceSunscreenKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: [
        'Niacinamide', 'Glycerin', 'Hyaluronic Acid',
        'Ethylhexylglycerin',
      ]
    },
    {
      name: 'Glow Serum: Propolis + Niacinamide',
      brand: 'Beauty of Joseon',
      category: 'SERUM' as const,
      description: 'A honey-like brightening serum with 60% Propolis Extract and Niacinamide. Deeply nourishes, strengthens the skin barrier, and delivers a radiant, clear complexion. Lightweight yet intensely moisturising.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/products/BeautyofJoseonGlowSerumKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: [
        'Glycerin', 'Niacinamide', 'Sodium Hyaluronate',
        'Centella Asiatica Extract', 'Tocopherol', 'Ethylhexylglycerin',
        'Betaine',
      ]
    },
    {
      name: 'Ground Rice and Honey Glow Mask',
      brand: 'Beauty of Joseon',
      category: 'MASK' as const,
      description: 'An all-in-one wash-off mask with Rice Hull Powder, 5% Honey, and Kaolin Clay. Gently exfoliates dead skin cells, controls excess sebum, and leaves skin bright, hydrated, and smooth. Suitable for all skin types.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/products/BeautyofJoseonGroundRiceHoneyGlowMaskKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: [
        'Glycerin', 'Cetyl Alcohol', 'Ethylhexylglycerin',
        'Allantoin',
      ]
    },
    {
      name: 'Rice Toner',
      brand: "I'm From",
      category: 'TONER' as const,
      description: 'A brightening toner made with 77.78% pure Yeoju Rice Extract. Deeply hydrates, removes dead skin cells, and delivers a luminous, even-toned complexion. Vegan-certified with no harmful additives.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/products/I_mFromRiceTonerKorendy1-736819_grande.jpg?v=1654330275',
      skin_type_tags: ['DRY', 'COMBINATION', 'SENSITIVE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: [
        'Niacinamide', 'Adenosine', 'Ethylhexylglycerin',
        'Betaine', 'Panthenol',
      ]
    },
    {
      name: 'No.1 Pure Full Calming Herb Toner',
      brand: 'Numbuzin',
      category: 'TONER' as const,
      description: 'A stress-relieving botanical toner with Centella Asiatica, Houttuynia Cordata, and Licorice Root Extract. Provides deep hydration, strengthens the skin barrier, and brightens with a lightweight water-based formula.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/No.1Pure-FullCalmingHerbToner100ml_300mlKorendy1_3107b6bb-92ab-4227-aa98-a1eb64e373c4_grande.png?v=1761490101',
      skin_type_tags: ['DRY', 'COMBINATION', 'SENSITIVE', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: [
        'Glycerin', 'Centella Asiatica Extract', 'Allantoin',
        'Panthenol', 'Betaine',
      ]
    },
  ]

  console.log(`Seeding ${products.length} products...`)

  for (const p of products) {
    try {
      // Check if already exists
      const existing = await prisma.product.findFirst({
        where: { name: p.name, brand: p.brand }
      })
      if (existing) {
        console.log(`⏭️  Skipped (exists): ${p.brand} - ${p.name}`)
        continue
      }

      // Resolve ingredient IDs
      const ingredientConnections = []
      for (let i = 0; i < p.ingredients.length; i++) {
        const id = await getIngredientId(p.ingredients[i])
        if (id) {
          ingredientConnections.push({ ingredient_id: id, order_index: i })
        }
      }

      await prisma.product.create({
        data: {
          name: p.name,
          brand: p.brand,
          category: p.category,
          description: p.description,
          image_url: p.image_url,
          skin_type_tags: p.skin_type_tags,
          is_published: p.is_published,
          ingredients: {
            create: ingredientConnections
          }
        }
      })

      console.log(`✅ ${p.brand} - ${p.name} (${ingredientConnections.length} ingredients linked)`)
    } catch (err: any) {
      console.log(`❌ Failed: ${p.name} — ${err.message}`)
    }
  }

  console.log('\nDone!')
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})