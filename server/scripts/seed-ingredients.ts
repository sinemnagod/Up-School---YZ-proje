import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const ingredients = [
  // ── Hydrators & Humectants ──
  { inci_name: 'Niacinamide', common_name: 'Vitamin B3', functions: ['ACTIVE','HUMECTANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Hyaluronic Acid', common_name: 'HA', functions: ['HUMECTANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Glycerin', common_name: 'Glycerol', functions: ['HUMECTANT','EMOLLIENT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Panthenol', common_name: 'Vitamin B5', functions: ['HUMECTANT','EMOLLIENT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Sodium Hyaluronate', common_name: 'Low-MW Hyaluronic Acid', functions: ['HUMECTANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Betaine', common_name: null, functions: ['HUMECTANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Urea', common_name: null, functions: ['HUMECTANT','EXFOLIANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:false, acne_prone:false, normal:true } },

  // ── Exfoliants ──
  { inci_name: 'Glycolic Acid', common_name: 'AHA', functions: ['EXFOLIANT','ACTIVE'], comedogenic_rating: 0, irritation_potential: 'HIGH', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:true, normal:true } },
  { inci_name: 'Lactic Acid', common_name: 'AHA', functions: ['EXFOLIANT','HUMECTANT'], comedogenic_rating: 0, irritation_potential: 'MEDIUM', skin_type_flags: { oily:false, dry:true, combination:true, sensitive:false, acne_prone:false, normal:true } },
  { inci_name: 'Mandelic Acid', common_name: 'AHA', functions: ['EXFOLIANT','ACTIVE'], comedogenic_rating: 0, irritation_potential: 'MEDIUM', skin_type_flags: { oily:false, dry:false, combination:false, sensitive:true, acne_prone:true, normal:false } },
  { inci_name: 'Salicylic Acid', common_name: 'BHA', functions: ['EXFOLIANT','ACTIVE'], comedogenic_rating: 0, irritation_potential: 'MEDIUM', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:true, normal:false } },
  { inci_name: 'Polyhydroxy Acid', common_name: 'PHA', functions: ['EXFOLIANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:true, acne_prone:false, normal:false } },

  // ── Actives & Antioxidants ──
  { inci_name: 'Ascorbic Acid', common_name: 'Vitamin C', functions: ['ACTIVE','ANTIOXIDANT'], comedogenic_rating: 0, irritation_potential: 'MEDIUM', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:true, normal:true } },
  { inci_name: 'Sodium Ascorbyl Phosphate', common_name: 'Stable Vitamin C', functions: ['ACTIVE','ANTIOXIDANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Retinol', common_name: 'Vitamin A', functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'HIGH', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:true, normal:true } },
  { inci_name: 'Retinal', common_name: 'Retinaldehyde', functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'HIGH', skin_type_flags: { oily:true, dry:false, combination:false, sensitive:false, acne_prone:true, normal:true } },
  { inci_name: 'Bakuchiol', common_name: null, functions: ['ACTIVE','ANTIOXIDANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Azelaic Acid', common_name: null, functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Tranexamic Acid', common_name: 'TXA', functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Alpha Arbutin', common_name: null, functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Resveratrol', common_name: null, functions: ['ANTIOXIDANT','ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Tocopherol', common_name: 'Vitamin E', functions: ['ANTIOXIDANT','EMOLLIENT'], comedogenic_rating: 2, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:true, acne_prone:false, normal:true } },

  // ── Emollients & Occlusives ──
  { inci_name: 'Squalane', common_name: null, functions: ['EMOLLIENT'], comedogenic_rating: 1, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Ceramide NP', common_name: 'Ceramide 3', functions: ['EMOLLIENT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Ceramide AP', common_name: 'Ceramide 6', functions: ['EMOLLIENT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Cetyl Alcohol', common_name: null, functions: ['EMOLLIENT','EMULSIFIER'], comedogenic_rating: 2, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:false, acne_prone:false, normal:true } },
  { inci_name: 'Dimethicone', common_name: 'Silicone', functions: ['EMOLLIENT'], comedogenic_rating: 1, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Shea Butter', common_name: null, functions: ['EMOLLIENT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:false, acne_prone:false, normal:true } },
  { inci_name: 'Jojoba Oil', common_name: 'Jojoba Esters', functions: ['EMOLLIENT'], comedogenic_rating: 2, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:false, normal:false } },
  { inci_name: 'Rosehip Oil', common_name: 'Rosa Canina Fruit Oil', functions: ['EMOLLIENT','ACTIVE'], comedogenic_rating: 1, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:true, acne_prone:false, normal:true } },
  { inci_name: 'Petrolatum', common_name: 'Petroleum Jelly', functions: ['EMOLLIENT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:true, acne_prone:false, normal:false } },

  // ── Problematic ──
  { inci_name: 'Fragrance', common_name: 'Parfum', functions: ['FRAGRANCE'], comedogenic_rating: 0, irritation_potential: 'HIGH', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:false, acne_prone:true, normal:true } },
  { inci_name: 'Alcohol Denat', common_name: 'Denatured Alcohol', functions: ['OTHER'], comedogenic_rating: 0, irritation_potential: 'HIGH', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:false, normal:true } },
  { inci_name: 'Coconut Oil', common_name: 'Cocos Nucifera Oil', functions: ['EMOLLIENT'], comedogenic_rating: 4, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:false, acne_prone:false, normal:false } },
  { inci_name: 'Isopropyl Myristate', common_name: null, functions: ['EMOLLIENT'], comedogenic_rating: 5, irritation_potential: 'LOW', skin_type_flags: { oily:false, dry:true, combination:false, sensitive:false, acne_prone:false, normal:true } },
  { inci_name: 'Sodium Lauryl Sulfate', common_name: 'SLS', functions: ['SURFACTANT'], comedogenic_rating: 0, irritation_potential: 'HIGH', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:false, normal:true } },
  { inci_name: 'Sodium Laureth Sulfate', common_name: 'SLES', functions: ['SURFACTANT'], comedogenic_rating: 0, irritation_potential: 'MEDIUM', skin_type_flags: { oily:true, dry:false, combination:true, sensitive:false, acne_prone:false, normal:true } },

  // ── Calming & Barrier ──
  { inci_name: 'Centella Asiatica Extract', common_name: 'Cica', functions: ['ACTIVE','ANTIOXIDANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Madecassoside', common_name: null, functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Allantoin', common_name: null, functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Adenosine', common_name: null, functions: ['ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Beta-Glucan', common_name: 'Oat Extract', functions: ['HUMECTANT','ACTIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Mugwort Extract', common_name: 'Artemisia', functions: ['ANTIOXIDANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Green Tea Extract', common_name: 'EGCG', functions: ['ANTIOXIDANT'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },

  // ── Preservatives ──
  { inci_name: 'Phenoxyethanol', common_name: null, functions: ['PRESERVATIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Ethylhexylglycerin', common_name: null, functions: ['PRESERVATIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
  { inci_name: 'Sodium Benzoate', common_name: null, functions: ['PRESERVATIVE'], comedogenic_rating: 0, irritation_potential: 'LOW', skin_type_flags: { oily:true, dry:true, combination:true, sensitive:true, acne_prone:true, normal:true } },
]

async function main() {
  console.log(`Seeding ${ingredients.length} ingredients...`)
  let added = 0
  let skipped = 0

  for (const ing of ingredients) {
    try {
      await prisma.ingredient.upsert({
        where: { inci_name: ing.inci_name },
        create: { ...ing, is_active: true },
        update: {},
      })
      added++
      console.log(`✅ ${ing.inci_name}`)
    } catch (err: any) {
      console.log(`⏭️  Skipped ${ing.inci_name}: ${err.message}`)
      skipped++
    }
  }

  console.log(`\nDone. Added: ${added}, Skipped: ${skipped}`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})