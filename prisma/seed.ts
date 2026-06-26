import { PrismaClient, type Item } from "@prisma/client";

const prisma = new PrismaClient();

const items = [
  ["ART001", "Pix albastru", "bucata", 25, 12, "Pix cu cerneala albastra"],
  ["ART002", "Caiet dictando", "bucata", 60, 35, "Caiet A5 pentru scoala"],
  ["ART003", "Radiera", "bucata", 15, 8, "Radiera pentru creion"],
  ["ART004", "Creion HB", "bucata", 10, 5, "Creion standard HB"],
  ["ART005", "Marker permanent", "bucata", 42, 20, "Marker negru permanent"],
] as const;

const suppliers = [
  {
    name: "Papetaria Central",
    address: "Strada Memorandumului 12, Cluj-Napoca",
  },
  { name: "Birou Plus", address: "Calea Dorobantilor 48, Cluj-Napoca" },
  { name: "Depozit Office", address: "Strada Fabricii 21, Floresti" },
];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  const user =
    (await prisma.user.findFirst({
      where: { email: "lunatic_charm_yume@yahoo.com" },
    })) ??
    (await prisma.user.findFirst({
      orderBy: { sessions: { _count: "desc" } },
    }));

  if (!user) throw new Error("Create or sign in with a user before seeding.");

  await prisma.stockChange.deleteMany({
    where: {
      OR: [
        { item: { userId: user.id } },
        {
          item: { itemNumber: { in: items.map(([itemNumber]) => itemNumber) } },
        },
      ],
    },
  });
  await prisma.item.deleteMany({
    where: {
      OR: [
        { userId: user.id },
        { itemNumber: { in: items.map(([itemNumber]) => itemNumber) } },
      ],
    },
  });
  await prisma.company.deleteMany({ where: { userId: user.id } });

  const company = await prisma.company.create({
    data: {
      userId: user.id,
      name: "Track It SRL",
      address: "Strada Observatorului 9, Cluj-Napoca",
      phone: "0740 123 456",
      shippingAddresses: {
        create: suppliers,
      },
    },
  });

  const createdItems: Item[] = [];
  for (const [itemNumber, itemName, UOM, price, cost, description] of items) {
    createdItems.push(
      await prisma.item.create({
        data: {
          itemNumber,
          itemName,
          UOM,
          price,
          cost,
          description,
          quantity: 500,
          leadTime: rand(7, 21),
          userId: user.id,
        },
      }),
    );
  }

  const stockChanges = [];
  for (let day = 0; day < 30; day++) {
    const changedAt = new Date("2024-12-01");
    changedAt.setDate(changedAt.getDate() + day);

    for (let sale = 0; sale < rand(1, 5); sale++) {
      const item = createdItems[rand(0, createdItems.length - 1)]!;
      const quantity = rand(5, 25);
      stockChanges.push({
        itemId: item.id,
        oldQuantity: item.quantity,
        newQuantity: item.quantity - quantity,
        changedAt,
      });
      await prisma.item.update({
        where: { id: item.id },
        data: { quantity: { decrement: quantity } },
      });
    }

    // restock every ~5 days
    if (day % 5 === 0) {
      const item = createdItems[rand(0, createdItems.length - 1)]!;
      const quantity = rand(50, 150);
      stockChanges.push({
        itemId: item.id,
        oldQuantity: item.quantity,
        newQuantity: item.quantity + quantity,
        changedAt,
      });
      await prisma.item.update({
        where: { id: item.id },
        data: { quantity: { increment: quantity } },
      });
    }
  }

  await prisma.stockChange.createMany({ data: stockChanges });

  console.log(
    `Seeded ${createdItems.length} items and ${suppliers.length} furnizori for ${user.email ?? user.name}. Company: ${company.name}`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
