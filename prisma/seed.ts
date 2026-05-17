import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Inaanza kupanda mbegu...");

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "fashion-mitindo" },
      update: {},
      create: { nameSw: "Fashion / Mitindo", nameEn: "Fashion", slug: "fashion-mitindo", descriptionSw: "Nguo, viatu, mfuko, saa, mkanda", descriptionEn: "Clothes, shoes, handbags, watches, belts", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "simu-accessories" },
      update: {},
      create: { nameSw: "Simu & Accessories", nameEn: "Phone & Accessories", slug: "simu-accessories", descriptionSw: "Covers za simu, charger, earphones, power banks", descriptionEn: "Phone cases, chargers, earphones, power banks", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { nameSw: "Electronics", nameEn: "Electronics", slug: "electronics", descriptionSw: "Speakers, redio, TV, blenda, kettle", descriptionEn: "Speakers, radios, TVs, blenders, kettles", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "urembo-vipodozi" },
      update: {},
      create: { nameSw: "Urembo & Vipodozi", nameEn: "Beauty & Cosmetics", slug: "urembo-vipodozi", descriptionSw: "Makeup, manukato, bidhaa za nywele, ngozi", descriptionEn: "Makeup, perfumes, hair products, skincare", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "nyumba-jikoni" },
      update: {},
      create: { nameSw: "Nyumba & Jikoni", nameEn: "Home & Kitchen", slug: "nyumba-jikoni", descriptionSw: "Vyombo, sufuria, shuka, mapazia, hifadhi", descriptionEn: "Utensils, cookware, bedsheets, curtains, storage", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "watoto-vijana" },
      update: {},
      create: { nameSw: "Watoto & Vijana", nameEn: "Baby & Kids", slug: "watoto-vijana", descriptionSw: "Nguo za watoto, vinyago, mfuko wa shule", descriptionEn: "Baby clothes, toys, school bags, feeding items", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "stationery-shule" },
      update: {},
      create: { nameSw: "Stationery & Mahitaji ya Shule", nameEn: "Stationery & School Supplies", slug: "stationery-shule", descriptionSw: "Vitabu, kalamu, faili, mfuko wa shule", descriptionEn: "Exercise books, pens, files, school bags", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "vifungashio" },
      update: {},
      create: { nameSw: "Vifaa vya Kufungasha", nameEn: "Packaging Materials", slug: "vifungashio", descriptionSw: "Mifuko ya manunuzi, masanduku, chupa, makontena", descriptionEn: "Shopping bags, boxes, bottles, containers", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "hardware-zana" },
      update: {},
      create: { nameSw: "Hardware & Zana", nameEn: "Hardware & Tools", slug: "hardware-zana", descriptionSw: "Zana ndogo, kufuli, balbu, mabomba", descriptionEn: "Small tools, locks, bulbs, plumbing items", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "gari-pikipiki" },
      update: {},
      create: { nameSw: "Gari & Pikipiki Accessories", nameEn: "Car & Motorcycle Accessories", slug: "gari-pikipiki", descriptionSw: "Covers za kiti, taa, mafuta, kofia za usalama", descriptionEn: "Seat covers, lights, oils, helmets", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "chakula-nyumbani" },
      update: {},
      create: { nameSw: "Chakula & Mahitaji ya Nyumba", nameEn: "Food & Household Essentials", slug: "chakula-nyumbani", descriptionSw: "Chakula kavu, sabuni, vifaa vya kusafisha", descriptionEn: "Dry foods, detergents, cleaning products", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "pakiti-biashara" },
      update: {},
      create: { nameSw: "Pakiti za Kuanza Biashara", nameEn: "Business Starter Packages", slug: "pakiti-biashara", descriptionSw: "Mchanganyiko wa bidhaa kwa wenye kutaka kuanza biashara ndogo", descriptionEn: "Selected product bundles for starting a small business", isActive: true },
    }),
  ]);

  console.log(`✅ Kategoria ${categories.length} zimepandwa`);

  // ─── Suppliers ─────────────────────────────────────────────────────────────
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: "supplier-1" },
      update: {},
      create: { id: "supplier-1", name: "Juma Traders Kariakoo", phone: "+255712000001", whatsapp: "+255712000001", shopLocation: "Kariakoo Block C, Dar es Salaam", trustStatus: "TRUSTED", notes: "Msambazaji wa nguo na viatu" },
    }),
    prisma.supplier.upsert({
      where: { id: "supplier-2" },
      update: {},
      create: { id: "supplier-2", name: "Tech Hub Kariakoo", phone: "+255712000002", whatsapp: "+255712000002", shopLocation: "Kariakoo Block A, Dar es Salaam", trustStatus: "TRUSTED", notes: "Simu na accessories" },
    }),
    prisma.supplier.upsert({
      where: { id: "supplier-3" },
      update: {},
      create: { id: "supplier-3", name: "Beauty Palace Kariakoo", phone: "+255712000003", whatsapp: "+255712000003", shopLocation: "Kariakoo, Dar es Salaam", trustStatus: "TRUSTED", notes: "Vipodozi na bidhaa za urembo" },
    }),
    prisma.supplier.upsert({
      where: { id: "supplier-4" },
      update: {},
      create: { id: "supplier-4", name: "Home Store Kariakoo", phone: "+255712000004", whatsapp: "+255712000004", shopLocation: "Kariakoo Block D, Dar es Salaam", trustStatus: "PENDING_REVIEW", notes: "Bidhaa za nyumba" },
    }),
    prisma.supplier.upsert({
      where: { id: "supplier-5" },
      update: {},
      create: { id: "supplier-5", name: "Electronics World Kariakoo", phone: "+255712000005", whatsapp: "+255712000005", shopLocation: "Kariakoo Block B, Dar es Salaam", trustStatus: "TRUSTED", notes: "Electronics na vifaa vya umeme" },
    }),
  ]);

  console.log(`✅ Wasambazaji ${suppliers.length} wamepandwa`);

  const fashionCat = categories[0];
  const simuCat = categories[1];
  const electronicsCat = categories[2];
  const uremboCAT = categories[3];
  const nyumbaCat = categories[4];

  // ─── Products ──────────────────────────────────────────────────────────────
  const productData = [
    // Fashion
    { nameSw: "Kanga ya Kitenge — Rangi Mchanganyiko", nameEn: "Kitenge Kanga — Mixed Colors", slug: "kanga-kitenge-rangi-mchanganyiko", descriptionSw: "Kanga nzuri ya Kitenge Tanzania, rangi nzuri na imara", descriptionEn: "Beautiful Tanzanian Kitenge Kanga, vibrant and durable", categoryId: fashionCat.id, supplierId: suppliers[0].id, sellingPrice: 25000, supplierCostPrice: 15000, isFeatured: true, isNewArrival: false },
    { nameSw: "Viatu vya Ngozi — Wanaume", nameEn: "Leather Shoes — Men", slug: "viatu-ngozi-wanaume", descriptionSw: "Viatu vya ngozi halisi vya Kariakoo, vizuri na imara", descriptionEn: "Genuine leather shoes from Kariakoo, stylish and durable", categoryId: fashionCat.id, supplierId: suppliers[0].id, sellingPrice: 65000, supplierCostPrice: 40000, discountPrice: 58000, isFeatured: true, isBestDeal: true },
    { nameSw: "Begi la Mkono — Wanawake", nameEn: "Handbag — Women", slug: "begi-mkono-wanawake", descriptionSw: "Begi la kifahari kwa wanawake, linafaa kwa kazi na starehe", descriptionEn: "Elegant women's handbag, suitable for work and leisure", categoryId: fashionCat.id, supplierId: suppliers[0].id, sellingPrice: 45000, supplierCostPrice: 28000, isNewArrival: true },
    { nameSw: "Shati la Kiume — Rasmi", nameEn: "Men's Formal Shirt", slug: "shati-kiume-rasmi", descriptionSw: "Shati la rasmi kwa wanaume, pamba nzuri", descriptionEn: "Men's formal shirt, quality cotton", categoryId: fashionCat.id, supplierId: suppliers[0].id, sellingPrice: 30000, supplierCostPrice: 18000, isFeatured: false },

    // Simu & Accessories
    { nameSw: "Cover ya Simu — Universal", nameEn: "Phone Case — Universal", slug: "cover-simu-universal", descriptionSw: "Cover ya simu imara na nzuri, inafaa aina nyingi za simu", descriptionEn: "Durable and stylish phone case, fits many phone models", categoryId: simuCat.id, supplierId: suppliers[1].id, sellingPrice: 8000, supplierCostPrice: 3000, isBestDeal: true, isNewArrival: true },
    { nameSw: "Charger ya Haraka — Type C", nameEn: "Fast Charger — Type C", slug: "charger-haraka-type-c", descriptionSw: "Charger ya haraka Type C, inachaji kwa dakika 30", descriptionEn: "Fast Type C charger, charges in 30 minutes", categoryId: simuCat.id, supplierId: suppliers[1].id, sellingPrice: 18000, supplierCostPrice: 10000, isFeatured: true },
    { nameSw: "Earphones za Wireless", nameEn: "Wireless Earphones", slug: "earphones-wireless", descriptionSw: "Earphones za wireless bila wire, sauti nzuri na bass", descriptionEn: "Wireless earphones with great sound quality and bass", categoryId: simuCat.id, supplierId: suppliers[1].id, sellingPrice: 35000, supplierCostPrice: 20000, discountPrice: 30000, isFeatured: true, isBestDeal: true },
    { nameSw: "Power Bank 20000mAh", nameEn: "Power Bank 20000mAh", slug: "power-bank-20000mah", descriptionSw: "Power Bank yenye nguvu ya 20000mAh, inachaji simu 4 mara", descriptionEn: "20000mAh power bank, charges 4 phones", categoryId: simuCat.id, supplierId: suppliers[1].id, sellingPrice: 45000, supplierCostPrice: 28000, isNewArrival: true },

    // Electronics
    { nameSw: "Speaker ya Bluetooth — Portable", nameEn: "Bluetooth Speaker — Portable", slug: "speaker-bluetooth-portable", descriptionSw: "Speaker ya Bluetooth inayobeba, sauti kubwa na nzuri", descriptionEn: "Portable Bluetooth speaker with loud and clear sound", categoryId: electronicsCat.id, supplierId: suppliers[4].id, sellingPrice: 55000, supplierCostPrice: 32000, isFeatured: true, isBestDeal: true },
    { nameSw: "Blenda ya Nyumbani", nameEn: "Home Blender", slug: "blenda-nyumbani", descriptionSw: "Blenda ya nyumbani yenye nguvu, inafaa matunda na mboga", descriptionEn: "Powerful home blender, suitable for fruits and vegetables", categoryId: electronicsCat.id, supplierId: suppliers[4].id, sellingPrice: 75000, supplierCostPrice: 45000, discountPrice: 68000 },
    { nameSw: "Kettle ya Umeme", nameEn: "Electric Kettle", slug: "kettle-umeme", descriptionSw: "Kettle ya umeme inayochemsha maji haraka, lita 1.8", descriptionEn: "Electric kettle that boils water fast, 1.8 liters", categoryId: electronicsCat.id, supplierId: suppliers[4].id, sellingPrice: 42000, supplierCostPrice: 25000, isNewArrival: true },

    // Beauty & Cosmetics
    { nameSw: "Manukato ya Mwanamke — 100ml", nameEn: "Women's Perfume — 100ml", slug: "manukato-mwanamke-100ml", descriptionSw: "Manukato ya ladha nzuri kwa wanawake, ya kudumu muda mrefu", descriptionEn: "Long-lasting women's perfume with beautiful fragrance", categoryId: uremboCAT.id, supplierId: suppliers[2].id, sellingPrice: 35000, supplierCostPrice: 18000, isFeatured: true },
    { nameSw: "Mafuta ya Nywele — Natural", nameEn: "Natural Hair Oil", slug: "mafuta-nywele-natural", descriptionSw: "Mafuta ya nywele ya asili, yanakua nywele na kuzioanisha", descriptionEn: "Natural hair oil that promotes growth and moisturizes", categoryId: uremboCAT.id, supplierId: suppliers[2].id, sellingPrice: 15000, supplierCostPrice: 7000, isBestDeal: true, isNewArrival: true },
    { nameSw: "Lipstick Set — 6 Rangi", nameEn: "Lipstick Set — 6 Colors", slug: "lipstick-set-6-rangi", descriptionSw: "Seti ya lipstick rangi 6 za kupendeza", descriptionEn: "Set of 6 attractive lipstick colors", categoryId: uremboCAT.id, supplierId: suppliers[2].id, sellingPrice: 22000, supplierCostPrice: 12000, discountPrice: 18000 },

    // Home & Kitchen
    { nameSw: "Sufuria Set — Pande 5", nameEn: "Cookware Set — 5 Pieces", slug: "sufuria-set-pande-5", descriptionSw: "Seti ya sufuria 5, zisizo na kutu, endelevu", descriptionEn: "5-piece cookware set, rust-free and durable", categoryId: nyumbaCat.id, supplierId: suppliers[3].id, sellingPrice: 95000, supplierCostPrice: 60000, isFeatured: true },
    { nameSw: "Shuka ya Kitanda — King Size", nameEn: "Bedsheet — King Size", slug: "shuka-kitanda-king-size", descriptionSw: "Shuka laini ya King Size, 100% pamba", descriptionEn: "Soft King Size bedsheet, 100% cotton", categoryId: nyumbaCat.id, supplierId: suppliers[3].id, sellingPrice: 48000, supplierCostPrice: 28000, isNewArrival: true },
    { nameSw: "Vyombo vya Chakula — Set", nameEn: "Tableware Set", slug: "vyombo-chakula-set", descriptionSw: "Seti ya vyombo vya chakula, supu na sahani", descriptionEn: "Tableware set including cups and plates", categoryId: nyumbaCat.id, supplierId: suppliers[3].id, sellingPrice: 35000, supplierCostPrice: 20000, isBestDeal: true },

    // More products for variety
    { nameSw: "Nguo za Watoto — Set (3-5 years)", nameEn: "Kids Clothes Set (3-5 years)", slug: "nguo-watoto-set-3-5-years", descriptionSw: "Seti ya nguo za watoto wadogo, laini na salama", descriptionEn: "Clothes set for small kids, soft and safe", categoryId: categories[5].id, supplierId: suppliers[0].id, sellingPrice: 28000, supplierCostPrice: 15000, isNewArrival: true, isFeatured: true },
    { nameSw: "Sabuni ya Kufulia — 5kg", nameEn: "Washing Powder — 5kg", slug: "sabuni-kufulia-5kg", descriptionSw: "Sabuni nzuri ya kufulia nguo, inasafisha vizuri", descriptionEn: "Good washing powder, cleans effectively", categoryId: categories[10].id, supplierId: suppliers[3].id, sellingPrice: 20000, supplierCostPrice: 12000, isBestDeal: true },
    { nameSw: "Vitabu vya Shule — Set (Standard 1-7)", nameEn: "School Books Set (Standard 1-7)", slug: "vitabu-shule-set", descriptionSw: "Seti ya vitabu vya shule vya darasa la kwanza hadi la saba", descriptionEn: "School book set for Standard 1 to 7", categoryId: categories[6].id, supplierId: suppliers[3].id, sellingPrice: 45000, supplierCostPrice: 30000 },
    { nameSw: "Mifuko ya Manunuzi — 100 pieces", nameEn: "Shopping Bags — 100 pieces", slug: "mifuko-manunuzi-100-pieces", descriptionSw: "Mifuko ya manunuzi imara 100, inafaa biashara", descriptionEn: "100 durable shopping bags, suitable for business", categoryId: categories[7].id, supplierId: suppliers[3].id, sellingPrice: 22000, supplierCostPrice: 12000, isBestDeal: true },
    { nameSw: "Kofia ya Pikipiki — Standard", nameEn: "Motorcycle Helmet — Standard", slug: "kofia-pikipiki-standard", descriptionSw: "Kofia ya usalama kwa pikipiki, imeidhinishwa", descriptionEn: "Safety helmet for motorcycle, certified", categoryId: categories[9].id, supplierId: suppliers[4].id, sellingPrice: 85000, supplierCostPrice: 55000, isNewArrival: true },
    { nameSw: "Pakiti ya Biashara — Fashion Starter", nameEn: "Business Starter Package — Fashion", slug: "pakiti-biashara-fashion-starter", descriptionSw: "Mchanganyiko wa bidhaa za mitindo kwa kuanza biashara ndogo. Nguo, viatu na accessories.", descriptionEn: "Mixed fashion items to start a small business", categoryId: categories[11].id, supplierId: suppliers[0].id, sellingPrice: 350000, supplierCostPrice: 200000, isFeatured: true, isBestDeal: true },
  ];

  let productCount = 0;
  for (const p of productData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        nameSw: p.nameSw,
        nameEn: p.nameEn,
        slug: p.slug,
        descriptionSw: p.descriptionSw,
        descriptionEn: p.descriptionEn,
        categoryId: p.categoryId,
        supplierId: p.supplierId,
        sellingPrice: p.sellingPrice,
        supplierCostPrice: p.supplierCostPrice,
        discountPrice: p.discountPrice ?? null,
        stockQuantity: Math.floor(Math.random() * 50) + 10,
        isActive: true,
        isFeatured: p.isFeatured ?? false,
        isNewArrival: p.isNewArrival ?? false,
        isBestDeal: p.isBestDeal ?? false,
        images: {
          create: [
            { url: "/products/placeholder-1.png", altText: p.nameSw, isMain: true },
          ],
        },
      },
    });
    productCount++;
  }

  console.log(`✅ Bidhaa ${productCount} zimepandwa`);

  // ─── Default Settings ───────────────────────────────────────────────────────
  const defaultSettings = [
    { key: "businessName", value: "Kariakoo Kiganjani" },
    { key: "slogan", value: "Pata Bidhaa Zote kwa Bei za Kariakoo" },
    { key: "whatsappNumber", value: "+255762474101" },
    { key: "businessEmail", value: "info@kariakookiganjani.co.tz" },
    { key: "location", value: "Kariakoo, Dar es Salaam, Tanzania" },
    { key: "deliveryNote", value: "Tunawasilisha Tanzania nzima. Ada ya uwasilishaji inategemea eneo lako." },
    { key: "paymentInstructions", value: "Lipa kwa M-Pesa, Tigo Pesa, Airtel Money, au Halopesa kwenye namba: +255762474101. Tuma namba ya muamala ukimaliza." },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Mipangilio ya msingi imepandwa");

  // ─── Sample Notifications ──────────────────────────────────────────────────
  const notifications = [
    { title: "Karibuni!", message: "Kariakoo Kiganjani iko tayari! Anza kuongeza bidhaa na wasambazaji.", type: "NEW_ORDER" as const },
    { title: "Stoki Ndogo", message: "Angalia bidhaa zenye stoki ndogo katika sehemu ya Inventory.", type: "LOW_STOCK" as const },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
  }

  console.log("✅ Arifa za mfano zimepandwa");

  // ─── Sample Budget Request ─────────────────────────────────────────────────
  await prisma.budgetRequest.create({
    data: {
      fullName: "Amina Juma",
      whatsappPhone: "+255712345678",
      productNeeded: "Nguo za mitandio kwa mwaka mpya",
      budget: 150000,
      quantity: 5,
      location: "Mwanza",
      deliveryNeeded: true,
      extraDetails: "Nataka rangi nyekundu na nyeusi",
      status: "NEW",
    },
  });

  console.log("✅ Ombi la budget la mfano limepandwa");
  console.log("\n🎉 Mbegu zote zimepandwa vizuri!");
  console.log("\n📋 HATUA ZINAZOFUATA:");
  console.log("1. Ongeza logo yako: /public/logo.png");
  console.log("2. Fungua Clerk Dashboard na ongeza admin: metadata { \"role\": \"ADMIN\" }");
  console.log("3. Unda buckets za Supabase: product-images, category-images, budget-request-images, logos");
  console.log("4. Nenda /admin kwa dashibodi ya usimamizi");
}

main()
  .catch((e) => {
    console.error("❌ Hitilafu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
