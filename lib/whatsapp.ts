const WHATSAPP_NUMBER = "255762474101";

export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getProductInquiryLink(productName: string, price: number): string {
  const message = `Habari! Ninataka kujua zaidi kuhusu bidhaa hii:\n\n📦 *${productName}*\n💰 Bei: TZS ${price.toLocaleString()}\n\nTafadhali nipeleke maelezo zaidi.`;
  return getWhatsAppLink(message);
}

export function getBudgetRequestLink(
  productNeeded: string,
  budget: number
): string {
  const message = `Habari! Ninahitaji msaada kupata bidhaa:\n\n🛍️ *Bidhaa Ninayotaka:* ${productNeeded}\n💰 *Budget Yangu:* TZS ${budget.toLocaleString()}\n\nTafadhali nisaidie kupata bidhaa hii kwa bei ya Kariakoo.`;
  return getWhatsAppLink(message);
}

export function getOrderSupportLink(orderNumber: string): string {
  const message = `Habari! Ninahitaji msaada kuhusu order yangu:\n\n📋 *Namba ya Order:* ${orderNumber}\n\nTafadhali nisaidie.`;
  return getWhatsAppLink(message);
}

export function getCheckoutSupportLink(): string {
  const message = `Habari! Ninahitaji msaada na malipo / checkout. Tafadhali nisaidie.`;
  return getWhatsAppLink(message);
}
