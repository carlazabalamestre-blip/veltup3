export function filterMeals(meals, profile) {
  if (!profile) return meals;

  const lowerDiet = profile.preferredMenu || '';
  const allergies = new Set((profile.allergies || []).map((item) => item.toLowerCase()));
  const intolerances = new Set((profile.intolerances || []).map((item) => item.toLowerCase()));
  const avoidFoods = new Set((profile.avoidFoods || []).map((item) => item.toLowerCase()));
  const conditions = new Set((profile.conditions || []).map((item) => item.toLowerCase()));

  const matchesDiet = (meal) => {
    if (lowerDiet.includes('vegà') && !meal.tags.includes('vegà')) return false;
    if (lowerDiet.includes('vegetari') && !meal.tags.includes('vegetari')) return false;
    if (lowerDiet.includes('ric en proteïna') && !meal.tags.includes('esportiu') && !meal.tags.includes('ric en proteïna')) return false;
    if (lowerDiet.includes('baix en sal') && !meal.tags.includes('baix en sal')) return false;
    return true;
  };

  const hasConflict = (meal) => {
    for (const allergen of meal.allergens) {
      const normalized = allergen.split(':')[0].trim().toLowerCase();
      if (allergies.has(normalized)) return true;
    }
    if (intolerances.has('lactosa') && meal.allergens.some((allergen) => allergen.includes('lactosa'))) return true;
    if (intolerances.has('gluten') && meal.allergens.some((allergen) => allergen.includes('gluten'))) return true;
    if (avoidFoods.size > 0) {
      for (const ingredient of meal.ingredients) {
        if (avoidFoods.has(ingredient.toLowerCase())) return true;
      }
    }
    return false;
  };

  const prioritizeDigestive = (meal) => {
    if (conditions.has('sibo') || conditions.has('síndrome de l’intestí irritable') || conditions.has('problemes de digestió') || conditions.has('digestiu')) {
      return meal.tags.includes('digestiu') || meal.tags.includes('fàcil de mastegar');
    }
    return true;
  };

  return meals
    .filter((meal) => !hasConflict(meal))
    .filter((meal) => matchesDiet(meal))
    .filter((meal) => prioritizeDigestive(meal))
    .sort((a, b) => {
      const score = (item) => {
        let value = 0;
        if (item.tags.includes('digestiu')) value += 20;
        if (item.tags.includes('esportiu')) value += 16;
        if (item.tags.includes('vegà')) value += 12;
        if (item.tags.includes('vegetarià')) value += 10;
        if (item.tags.includes('baix en sal')) value += 8;
        if (item.tags.includes('sense gluten')) value += 6;
        if (item.tags.includes('sense lactosa')) value += 6;
        return value;
      };
      return score(b) - score(a);
    });
}
