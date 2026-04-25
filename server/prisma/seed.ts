import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@glowlogic.com" },
    update: {},
    create: {
      email: "admin@glowlogic.com",
      password_hash: adminPassword,
      role: "ADMIN",
    },
  });

  const ingredientInputs = [
    { inci_name: "Niacinamide", common_name: "Vitamin B3", functions: ["ACTIVE"] },
    { inci_name: "Retinol", common_name: "Vitamin A", functions: ["ACTIVE"] },
    { inci_name: "Glycolic Acid", common_name: "AHA", functions: ["EXFOLIANT", "ACTIVE"] },
    { inci_name: "Hyaluronic Acid", common_name: "HA", functions: ["HUMECTANT"] },
    { inci_name: "Fragrance", common_name: "Parfum", functions: ["FRAGRANCE"] },
    { inci_name: "Salicylic Acid", common_name: "BHA", functions: ["EXFOLIANT", "ACTIVE"] },
    { inci_name: "Ascorbic Acid", common_name: "Vitamin C", functions: ["ANTIOXIDANT", "ACTIVE"] },
    { inci_name: "Ceramide NP", common_name: "Ceramide", functions: ["EMOLLIENT"] },
    { inci_name: "Panthenol", common_name: "Pro-Vitamin B5", functions: ["HUMECTANT"] },
    { inci_name: "Glycerin", common_name: "Glycerin", functions: ["HUMECTANT"] },
  ] as const;

  const ingredientMap = new Map<string, { id: string; inci_name: string }>();
  for (const ingredient of ingredientInputs) {
    const saved = await prisma.ingredient.upsert({
      where: { inci_name: ingredient.inci_name },
      update: {
        common_name: ingredient.common_name,
        functions: ingredient.functions as any,
      },
      create: {
        inci_name: ingredient.inci_name,
        common_name: ingredient.common_name,
        functions: ingredient.functions as any,
        comedogenic_rating: ingredient.inci_name === "Fragrance" ? 2 : 1,
        irritation_potential: ingredient.inci_name === "Retinol" ? "HIGH" : "LOW",
        skin_type_flags: {
          oily: true,
          dry: true,
          combination: true,
          sensitive: ingredient.inci_name !== "Fragrance",
          acne_prone: true,
          normal: true,
        },
      },
      select: { id: true, inci_name: true },
    });
    ingredientMap.set(saved.inci_name, saved);
  }

  const productInputs = [
    {
      name: "Calm Start Cleanser",
      brand: "GlowLogic",
      category: "CLEANSER",
      ingredientOrder: ["Glycerin", "Panthenol", "Ceramide NP"],
      skin_type_tags: ["DRY", "SENSITIVE", "NORMAL"],
    },
    {
      name: "Night Renewal Serum",
      brand: "GlowLogic",
      category: "SERUM",
      ingredientOrder: ["Retinol", "Niacinamide", "Hyaluronic Acid"],
      skin_type_tags: ["OILY", "COMBINATION", "ACNE_PRONE", "NORMAL"],
    },
    {
      name: "Barrier Lock Moisturizer",
      brand: "GlowLogic",
      category: "MOISTURIZER",
      ingredientOrder: ["Ceramide NP", "Hyaluronic Acid", "Glycerin"],
      skin_type_tags: ["DRY", "SENSITIVE", "NORMAL"],
    },
  ] as const;

  for (const product of productInputs) {
    const savedProduct = await prisma.product.upsert({
      where: { name_brand: { name: product.name, brand: product.brand } } as any,
      update: {
        category: product.category as any,
        is_published: true,
      },
      create: {
        name: product.name,
        brand: product.brand,
        category: product.category as any,
        is_published: true,
        skin_type_tags: product.skin_type_tags as any,
      },
    });

    await prisma.productIngredient.deleteMany({
      where: { product_id: savedProduct.id },
    });

    for (const [idx, inciName] of product.ingredientOrder.entries()) {
      const ingredient = ingredientMap.get(inciName);
      if (!ingredient) continue;
      await prisma.productIngredient.create({
        data: {
          product_id: savedProduct.id,
          ingredient_id: ingredient.id,
          order_index: idx + 1,
        },
      });
    }
  }

  const conflictRules = [
    {
      rule_name: "Avoid AHA + Retinol in same routine slot",
      ingredientA: "Glycolic Acid",
      ingredientB: "Retinol",
      conflict_scope: "SAME_SLOT",
      alert_type: "HIGH_IRRITATION",
      severity: "DANGER",
      explanation: "AHA and retinol together can cause high irritation.",
    },
    {
      rule_name: "Vitamin C + Niacinamide timing caution",
      ingredientA: "Ascorbic Acid",
      ingredientB: "Niacinamide",
      conflict_scope: "SAME_SLOT",
      alert_type: "PH_CONFLICT",
      severity: "WARNING",
      explanation: "Use separately for best stability and tolerance.",
    },
    {
      rule_name: "Fragrance sensitivity warning",
      ingredientA: "Fragrance",
      ingredientB: "Retinol",
      conflict_scope: "ANY_SLOT",
      alert_type: "OVERUSE",
      severity: "WARNING",
      explanation: "Sensitive users may react when fragrance is combined with strong actives.",
    },
  ] as const;

  for (const rule of conflictRules) {
    const ingredientA = ingredientMap.get(rule.ingredientA);
    const ingredientB = ingredientMap.get(rule.ingredientB);
    if (!ingredientA || !ingredientB) continue;

    await prisma.conflictRule.upsert({
      where: {
        ingredient_a_id_ingredient_b_id_conflict_scope: {
          ingredient_a_id: ingredientA.id,
          ingredient_b_id: ingredientB.id,
          conflict_scope: rule.conflict_scope as any,
        },
      } as any,
      update: {
        rule_name: rule.rule_name,
        alert_type: rule.alert_type as any,
        severity: rule.severity as any,
        explanation: rule.explanation,
        is_active: true,
      },
      create: {
        rule_name: rule.rule_name,
        ingredient_a_id: ingredientA.id,
        ingredient_b_id: ingredientB.id,
        conflict_scope: rule.conflict_scope as any,
        alert_type: rule.alert_type as any,
        severity: rule.severity as any,
        explanation: rule.explanation,
        safe_to_override: true,
        is_active: true,
      },
    });
  }

  const milestones = [3, 7, 15, 30, 50, 75, 100];
  for (const milestone of milestones) {
    await prisma.badge.upsert({
      where: {
        name_slot: {
          name: `AM ${milestone} Day Streak`,
          slot: "AM",
        },
      } as any,
      update: {},
      create: {
        name: `AM ${milestone} Day Streak`,
        description: `Complete AM routine for ${milestone} consecutive days.`,
        milestone,
        slot: "AM",
      },
    });

    await prisma.badge.upsert({
      where: {
        name_slot: {
          name: `PM ${milestone} Day Streak`,
          slot: "PM",
        },
      } as any,
      update: {},
      create: {
        name: `PM ${milestone} Day Streak`,
        description: `Complete PM routine for ${milestone} consecutive days.`,
        milestone,
        slot: "PM",
      },
    });
  }

  console.log("Seed completed.");
  console.log(`Admin: ${admin.email} / Admin1234!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
