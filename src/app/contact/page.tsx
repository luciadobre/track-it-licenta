import { FaEnvelope, FaGithub, FaMapMarkerAlt } from "react-icons/fa";

const contactItems = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "contact@trackit.ro",
    href: "mailto:contact@trackit.ro",
  },
  {
    icon: FaGithub,
    label: "Proiect",
    value: "github.com/luciadobre/track-it",
    href: "https://github.com/luciadobre/track-it",
  },
  { icon: FaMapMarkerAlt, label: "Locatie", value: "Romania", href: null },
];

const ContactPage = () => {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-text-secondary mb-2 text-sm">Contact</p>
      <h1 className="mb-4 text-3xl font-semibold">Hai sa vorbim</h1>

      <div className="space-y-3">
        {contactItems.map(({ icon: Icon, label, value, href }) => (
          <section
            key={label}
            className="border-border bg-panel flex items-center gap-4 rounded-lg border p-4"
          >
            <Icon className="text-accent text-xl" />
            <div>
              <h2 className="font-semibold">{label}</h2>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-accent hover:underline text-sm"
                >
                  {value}
                </a>
              ) : (
                <p className="text-text-secondary text-sm">{value}</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default ContactPage;
