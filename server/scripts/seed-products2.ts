import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getId(inci_name: string): Promise<string | null> {
  const ing = await prisma.ingredient.findFirst({
    where: { inci_name: { equals: inci_name, mode: 'insensitive' } }
  })
  return ing?.id ?? null
}

async function main() {
  const products = [
    {
      name: 'SEOUL 1988 Serum Retinal Liposome 2% + Black Ginseng',
      brand: 'K-Secret',
      category: 'SERUM' as const,
      description: 'An anti-aging serum with 2% Liposomal Retinal, Black Ginseng, Bakuchiol and Vitamin C. Targets fine lines, wrinkles, dark spots and enlarged pores. Absorbs quickly without stickiness.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/K-SecretSeoul1988SerumKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'COMBINATION', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Retinal', 'Bakuchiol', 'Sodium Ascorbyl Phosphate', 'Niacinamide', 'Adenosine'],
    },
    {
      name: 'TXA Niacinamide Retinal Serum',
      brand: 'Purito',
      category: 'SERUM' as const,
      description: 'A triple-action brightening serum combining Tranexamic Acid, Niacinamide and Retinal. Targets dark spots, uneven skin tone and signs of aging while keeping skin calm and hydrated.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/PuritoTXANiacinamideRetinalSerumKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'COMBINATION', 'NORMAL', 'ACNE_PRONE'] as any[],
      is_published: true,
      ingredients: ['Tranexamic Acid', 'Niacinamide', 'Retinal', 'Panthenol', 'Adenosine'],
    },
    {
      name: 'Azelaic Acid 10 Kojic Tea Tree Serum',
      brand: 'Purito',
      category: 'SERUM' as const,
      description: 'A triple-active serum with 10% Azelaic Acid, Kojic Acid and Tea Tree Oil Capsules. Targets blemishes, post-acne marks and enlarged pores. Controls excess sebum for a clearer, more balanced complexion.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/PuritoAzelaicAcidKojicTeaTreeSerumKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'COMBINATION', 'ACNE_PRONE'] as any[],
      is_published: true,
      ingredients: ['Azelaic Acid', 'Niacinamide', 'Allantoin', 'Panthenol'],
    },
    {
      name: 'No.5 Glutathione Vitamin Concentrated Toner',
      brand: 'Numbuzin',
      category: 'TONER' as const,
      description: 'A brightening essence-toner with Glutathione, Vitamin C, Arbutin and 6 types of Peptides. Delivers powerful antioxidant protection, fades dark spots and improves skin elasticity with a lightweight, fast-absorbing formula.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/No.5GlutathioneVitaminConcentratedTonerKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'DRY', 'COMBINATION', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Niacinamide', 'Alpha Arbutin', 'Ascorbic Acid', 'Centella Asiatica Extract', 'Adenosine'],
    },
    {
      name: 'No.3 Blue Bio-Retinol Pore Refining Serum',
      brand: 'Numbuzin',
      category: 'SERUM' as const,
      description: 'A gentle yet effective serum with Blue Bio-Retinol, 10% Niacinamide and BHA. Minimises pore appearance, controls excess sebum and smooths skin texture without the irritation of traditional retinol.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/No.3BlueBio-RetinolPoreRefiningSerumKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'COMBINATION', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Niacinamide', 'Salicylic Acid', 'Bakuchiol', 'Adenosine', 'Allantoin'],
    },
    {
      name: 'Oat In Calming Gel Cream',
      brand: 'Purito',
      category: 'MOISTURIZER' as const,
      description: 'A lightweight gel-cream moisturiser with Oat Extract, Beta-Glucan and Centella Asiatica. Deeply hydrates, calms irritation and strengthens the skin barrier. Suitable for sensitive and reactive skin.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/PuritoOatInCalmingGelCreamKorendy1_grande.jpg',
      skin_type_tags: ['DRY', 'SENSITIVE', 'COMBINATION', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Beta-Glucan', 'Centella Asiatica Extract', 'Allantoin', 'Panthenol', 'Glycerin'],
    },
    {
      name: 'Good Cera Super Ceramide Mist',
      brand: 'Holika Holika',
      category: 'TONER' as const,
      description: 'A barrier-supporting facial mist with three types of Ceramides (AP, NP, EOP). Ultra-fine micro-mist formula with pH 5.5 delivers instant hydration and comfort. Can be used over makeup throughout the day.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/HolikaHolikaGoodCeraSuperCeramideMistKorendy1_grande.jpg',
      skin_type_tags: ['DRY', 'SENSITIVE', 'COMBINATION', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Ceramide NP', 'Ceramide AP', 'Glycerin', 'Panthenol', 'Allantoin'],
    },
    {
      name: 'StretchFit Calming Pad',
      brand: 'Dr. Althea',
      category: 'MASK' as const,
      description: 'An innovative stretch-fit calming sheet mask with Cica Complex (Madecassoside + Centella Asiatica) and Zinc PCA. The honeycomb-patterned fabric stretches up to 15cm to perfectly fit facial contours, delivering deep hydration and sebum control in 10-15 minutes.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/DrAltheaStretchFitCalmingPadKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'DRY', 'SENSITIVE', 'COMBINATION', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Centella Asiatica Extract', 'Madecassoside', 'Panthenol', 'Allantoin', 'Glycerin'],
    },
    {
      name: 'Rice Makgeolli Probio Yeast Cream In Essence',
      brand: 'Barulab',
      category: 'MOISTURIZER' as const,
      description: 'A 2-in-1 cream-essence with Icheon Rice Extract and Galactomyces ferment. Provides deep hydration, lifting effect and improved elasticity with a lightweight texture. TSL Fermentation technology enhances absorption and efficacy.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/BarulabRiceMakgeolliProbioYeastCreamInEssenceKorendy1_grande.jpg',
      skin_type_tags: ['DRY', 'COMBINATION', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Niacinamide', 'Glycerin', 'Adenosine', 'Panthenol', 'Beta-Glucan'],
    },
    {
      name: 'OAT PDRN Gentle Refining Toner',
      brand: 'Purito',
      category: 'TONER' as const,
      description: 'A hydrating toner with 80% Oat Seed Water and 99% pure Oat PDRN technology. Gently refines skin texture, delivers intense moisture and revives radiance. Beta-Glucan provides instant comfort and barrier support.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/PuritoOatPDRNGentleRefiningTonerKorendy1_grande.jpg',
      skin_type_tags: ['DRY', 'SENSITIVE', 'COMBINATION', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Beta-Glucan', 'Glycerin', 'Allantoin', 'Panthenol', 'Ethylhexylglycerin'],
    },
    {
      name: 'Real Deep Mask Refreshing Sea Kelp',
      brand: 'Biodance',
      category: 'MASK' as const,
      description: 'A translucent hydrogel mask with Sea Kelp and Deep Sea Water. Controls excess sebum, prevents dark spots and calms irritated skin. The mask becomes transparent as it absorbs, delivering the equivalent of 35ml of ampoule per sheet.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/BiodanceRealDeepMaskRefreshingSeaKelpKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'COMBINATION', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Glycerin', 'Niacinamide', 'Allantoin', 'Centella Asiatica Extract'],
    },
    {
      name: 'Red Bean Refreshing Pore Mask',
      brand: 'Beauty of Joseon',
      category: 'MASK' as const,
      description: 'A clay pore mask with 30% Haenam Red Bean Extract and Kaolin Clay. Gently exfoliates dead skin cells, absorbs excess sebum and purifies pores without drying out the skin. Leaves skin clear, smooth and refreshed.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/BeautyofJoseonRedBeanRefreshingPoreMaskKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'COMBINATION', 'ACNE_PRONE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Glycerin', 'Allantoin', 'Ethylhexylglycerin', 'Centella Asiatica Extract'],
    },
    {
      name: 'Madagascar Centella Tone Brightening Capsule Ampoule',
      brand: 'SKIN1004',
      category: 'SERUM' as const,
      description: 'A brightening capsule ampoule with MadeWhite micro-capsules, 4% Niacinamide and 2% Tranexamic Acid. Targets dark spots and uneven skin tone while Madagascar Centella Asiatica keeps skin calm. Oil-in-water gel texture absorbs deeply without heaviness.',
      image_url: 'https://www.korendy.com.tr/cdn/shop/files/SKIN1004MadagascarCentellaToneBrighteningCapsuleAmpouleKorendy1_grande.jpg',
      skin_type_tags: ['OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'NORMAL'] as any[],
      is_published: true,
      ingredients: ['Niacinamide', 'Tranexamic Acid', 'Centella Asiatica Extract', 'Sodium Hyaluronate', 'Adenosine', 'Allantoin'],
    },
  ]

  console.log(`Seeding ${products.length} products...`)

  for (const p of products) {
    try {
      const existing = await prisma.product.findFirst({
        where: { name: p.name, brand: p.brand }
      })
      if (existing) {
        console.log(`⏭️  Skipped (exists): ${p.brand} - ${p.name}`)
        continue
      }

      const ingredientConnections = []
      for (let i = 0; i < p.ingredients.length; i++) {
        const id = await getId(p.ingredients[i])
        if (id) ingredientConnections.push({ ingredient_id: id, order_index: i })
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
          ingredients: { create: ingredientConnections }
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