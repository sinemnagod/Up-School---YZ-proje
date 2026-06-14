import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getId(inci_name: string): Promise<string> {
  const ing = await prisma.ingredient.findFirst({
    where: { inci_name: { equals: inci_name, mode: 'insensitive' } }
  })
  if (!ing) throw new Error(`Ingredient not found: ${inci_name}`)
  return ing.id
}

async function main() {
  const rules = [
    {
      rule_name: 'AHA + Retinol Conflict',
      ingredient_a: 'Glycolic Acid',
      ingredient_b: 'Retinol',
      conflict_scope: 'SAME_SLOT',
      alert_type: 'HIGH_IRRITATION',
      severity: 'DANGER',
      explanation: 'Using AHA (Glycolic Acid) and Retinol in the same routine slot can cause significant skin irritation and barrier damage. Use on alternating nights instead.',
      safe_to_override: false,
    },
    {
      rule_name: 'BHA + Retinol Conflict',
      ingredient_a: 'Salicylic Acid',
      ingredient_b: 'Retinol',
      conflict_scope: 'SAME_SLOT',
      alert_type: 'HIGH_IRRITATION',
      severity: 'DANGER',
      explanation: 'Salicylic Acid and Retinol together can over-exfoliate and severely irritate the skin. Alternate between nights.',
      safe_to_override: false,
    },
    {
      rule_name: 'Vitamin C + AHA pH Conflict',
      ingredient_a: 'Ascorbic Acid',
      ingredient_b: 'Glycolic Acid',
      conflict_scope: 'SAME_SLOT',
      alert_type: 'PH_CONFLICT',
      severity: 'WARNING',
      explanation: 'Vitamin C (Ascorbic Acid) and AHA work at different pH levels. Using them together can reduce effectiveness and cause irritation. Apply at different times of day.',
      safe_to_override: true,
    },
    {
      rule_name: 'Retinol + Vitamin C Conflict',
      ingredient_a: 'Retinol',
      ingredient_b: 'Ascorbic Acid',
      conflict_scope: 'SAME_SLOT',
      alert_type: 'HIGH_IRRITATION',
      severity: 'WARNING',
      explanation: 'Retinol and Vitamin C used together can cause irritation and reduce the effectiveness of both. Use Vitamin C in your AM routine and Retinol in your PM routine.',
      safe_to_override: true,
    },
    {
      rule_name: 'AHA + BHA Overuse',
      ingredient_a: 'Glycolic Acid',
      ingredient_b: 'Salicylic Acid',
      conflict_scope: 'SAME_SLOT',
      alert_type: 'HIGH_IRRITATION',
      severity: 'WARNING',
      explanation: 'Combining AHA and BHA in the same slot can over-exfoliate the skin and damage the moisture barrier. Use on different days or different slots.',
      safe_to_override: true,
    },
  ]

  console.log(`Seeding ${rules.length} conflict rules...`)

  for (const rule of rules) {
    try {
      const aId = await getId(rule.ingredient_a)
      const bId = await getId(rule.ingredient_b)

      await prisma.conflictRule.upsert({
        where: { id: 'non-existent' },
        create: {
          rule_name: rule.rule_name,
          ingredient_a_id: aId,
          ingredient_b_id: bId,
          conflict_scope: rule.conflict_scope as any,
          alert_type: rule.alert_type as any,
          severity: rule.severity as any,
          explanation: rule.explanation,
          safe_to_override: rule.safe_to_override,
          is_active: true,
        },
        update: {},
      })

      console.log(`✅ ${rule.rule_name}`)
    } catch (err: any) {
      console.log(`❌ Failed: ${rule.rule_name} — ${err.message}`)
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