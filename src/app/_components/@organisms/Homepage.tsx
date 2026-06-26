"use client";

import { FaBoxes, FaChartLine, FaFileInvoice, FaTruck } from "react-icons/fa";
import Button from "../@atoms/Button";

const features = [
  {
    icon: FaBoxes,
    title: "Inventar",
    text: "Articole, cantitati, preturi si locatii in acelasi loc.",
  },
  {
    icon: FaChartLine,
    title: "Stoc",
    text: "Vezi din timp ce trebuie reaprovizionat.",
  },
  {
    icon: FaTruck,
    title: "Furnizori",
    text: "Tii datele firmei si adresele furnizorilor pregatite.",
  },
  {
    icon: FaFileInvoice,
    title: "Export PO",
    text: "Selectezi produsele si generezi un PDF pentru achizitie.",
  },
];

const Homepage = () => {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="mb-12 max-w-2xl">
        <h1 className="mb-4 text-4xl font-semibold">
          Inventar clar pentru stoc, furnizori si comenzi.
        </h1>
        <p className="text-text-secondary mb-6">
          Urmareste articole, cantitati, locatii, vanzari si comenzi de
          achizitie fara foi separate.
        </p>
        <Button
          text="Mergi la inventar"
          redirectPath="/dashboard/inventory"
          intent="primary"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="border-border bg-panel rounded-lg border p-5"
          >
            <Icon className="text-accent mb-4 text-2xl" />
            <h2 className="mb-2 text-lg font-semibold">{title}</h2>
            <p className="text-text-secondary text-sm">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Homepage;
