import { FaBoxOpen, FaFileInvoice, FaTruck } from "react-icons/fa";

const points = [
  {
    icon: FaBoxOpen,
    title: "Inventar",
    text: "Adaugi articole si vezi imediat ce este in stoc.",
  },
  {
    icon: FaTruck,
    title: "Furnizori",
    text: "Pastrezi adresele furnizorilor la indemana.",
  },
  {
    icon: FaFileInvoice,
    title: "Export PO",
    text: "Alegi produsele si scoti rapid o comanda.",
  },
];

const AboutPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-text-secondary mb-2 text-sm">Despre</p>
      <h1 className="mb-4 text-3xl font-semibold">Track It, pe scurt</h1>
      <p className="text-text-secondary mb-8 max-w-2xl">
        Track It tine articolele, locatiile, furnizorii si comenzile intr-un
        singur loc.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {points.map(({ icon: Icon, title, text }) => (
          <section
            key={title}
            className="border-border bg-panel rounded-lg border p-5"
          >
            <Icon className="text-accent mb-3 text-2xl" />
            <h2 className="mb-2 font-semibold">{title}</h2>
            <p className="text-text-secondary text-sm">{text}</p>
          </section>
        ))}
      </div>
    </main>
  );
};

export default AboutPage;
