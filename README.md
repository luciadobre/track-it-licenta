# Track It

A full-stack inventory management web app built for small businesses — local shops, workshops, warehouses, and distribution companies. Users can log in, manage products and stock levels, run sales and restock transactions, generate reports, and scan QR codes to quickly check or update inventory from anywhere. The app is fully responsive so it works from both desktop and mobile without needing to install anything.

---

### 📦 Stack

- **Next.js 15** (App Router, Turbopack)
- **TypeScript**
- **tRPC** + **TanStack Query**
- **Prisma** + **NextAuth v5**
- **Tailwind CSS v4**
- **Recharts** for data visualizations
- **QR code generation** for quick stock access
- **PDF + Excel export** for reports
- **Google Maps** for location-based inventory
- **Jest** + **Testing Library**

---

### ✨ Quick start

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

---

### 🗄️ Database

```bash
npm run db:generate   # create a new migration
npm run db:migrate    # apply migrations
npm run db:push       # push schema without migration
npm run db:studio     # open Prisma Studio
```

---

### 🧪 Tests

```bash
npm test
```

Unit tests are written with Jest and Testing Library.

---

### 📁 Project structure

```
src/
  app/           # Next.js app router pages and layouts
  server/        # tRPC routers and Prisma client
  trpc/          # tRPC client setup
  app/_components/  # Shared UI components
prisma/
  schema.prisma  # Database schema
  seed.ts        # Seed script
```

---

### 👤 Author

**Lucia Dobre** — [github.com/luciadobre](https://github.com/luciadobre)
