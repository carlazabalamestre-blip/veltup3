export function calculatePlanPrice({ days, mealsPerDay, people, serviceType }) {
  const basePrice = 8.5;
  const mealCount = days * mealsPerDay * people;
  const serviceFee = serviceType === 'amb nutricionista' ? 15 : 0;
  const subtotal = basePrice * mealCount + serviceFee;
  return {
    mealCount,
    serviceFee,
    subtotal,
  };
}

export function formatPrice(value) {
  return `${value.toFixed(2).replace('.', ',')} €`;
}
