import { useState } from "react";
import { Baby, CalendarCheck, HeartPulse, Home, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Syringe, X } from "lucide-react";
import clinicHero from "@/assets/pediatric-clinic-chinacota.jpg";

const whatsappPrimary = "https://api.whatsapp.com/send/?phone=%2B573118930428&text&type=phone_number&app_absent=0";
const whatsappSecondary = "https://api.whatsapp.com/send/?phone=%2B573117358026&text&type=phone_number&app_absent=0";
const mapsUrl = "https://www.google.com/maps/place/Chin%C3%A1cota,+Norte+de+Santander/@7.600193,-72.623113,14z/data=!3m1!4b1!4m6!3m5!1s0x8e6631e5083d55c3:0xd608396c39fbc9a4!8m2!3d7.6071073!4d-72.6016311!16s%2Fm%2F0280sth?entry=ttu";
const contacts = [
  { label: "Número principal", number: "+57 311 893 0428", tel: "+573118930428", whatsapp: whatsappPrimary, tone: "text-accent" },
  { label: "Segundo contacto", number: "+57 311 735 8026", tel: "+573117358026", whatsapp: whatsappSecondary, tone: "text-fresh" },
];

const services = [
  { icon: Baby, title: "Niño sano y enfermo", text: "Control pediátrico cercano para crecimiento, síntomas y seguimiento familiar." },
  { icon: Sparkles, title: "Crecimiento y desarrollo", text: "Asesoría nutricional y acompañamiento en cada etapa de la infancia." },
  { icon: Syringe, title: "Vacunas", text: "Orientación clara para esquemas, refuerzos y dudas frecuentes de vacunación." },
  { icon: HeartPulse, title: "Adolescentes", text: "Consulta respetuosa para cambios físicos, hábitos, salud emocional y prevención." },
];

const prices = [
  { name: "Consulta online", price: "$60.000 COP", note: "Previo pago" },
  { name: "Consulta pediátrica", price: "$80.000 COP", note: "En consultorio" },
  { name: "Consulta a domicilio", price: "$120.000 COP", note: "Según disponibilidad" },
];

const Index = () => {
  const [selectedContact, setSelectedContact] = useState<(typeof contacts)[number] | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty("--y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[92vh] bg-[image:var(--hero-gradient)]" onPointerMove={handlePointerMove}>
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#inicio" className="flex items-center gap-3 font-display text-xl font-extrabold text-primary" aria-label="Olga Tu Pediatra">
            <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--lift-shadow)]"><Baby className="size-6" /></span>
            Olga Tu Pediatra
          </a>
          <a href={whatsappPrimary} className="hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-extrabold text-accent-foreground shadow-[var(--lift-shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--card-shadow)] focus:outline-none focus:ring-4 focus:ring-ring/30 sm:flex">
            <MessageCircle className="size-4" /> Agendar
          </a>
        </nav>

        <div id="inicio" className="mx-auto grid max-w-6xl gap-10 px-5 pb-12 pt-6 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-20 lg:pt-10">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-sm font-extrabold text-primary shadow-[var(--lift-shadow)] backdrop-blur">
              <MapPin className="size-4" /> Consulta privada en Chinácota
            </p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
              Pediatría cercana para cuidar lo más valioso.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-muted-foreground sm:text-xl">
              Atención pediátrica privada para niños, niñas y adolescentes: crecimiento, nutrición, vacunas, enfermedad y orientación familiar con trato humano.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappPrimary} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-extrabold text-primary-foreground shadow-[var(--card-shadow)] transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-ring/30">
                <MessageCircle className="size-5" /> Escribir por WhatsApp
              </a>
              <a href="#precios" className="inline-flex items-center justify-center gap-2 rounded-full bg-card/85 px-7 py-4 font-extrabold text-primary shadow-[var(--lift-shadow)] transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-ring/30">
                <CalendarCheck className="size-5" /> Ver consultas
              </a>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute -left-5 top-12 z-10 rounded-2xl bg-card/92 p-4 shadow-[var(--card-shadow)] backdrop-blur sm:left-0">
              <p className="text-sm font-extrabold text-primary">Desde</p>
              <p className="font-display text-3xl font-extrabold text-accent">$60.000</p>
            </div>
            <img src={clinicHero} alt="Pediatra atendiendo a un niño en consulta privada" width={1280} height={960} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[var(--card-shadow)] lg:aspect-[5/6]" />
            <div className="absolute -bottom-5 right-4 rounded-2xl bg-fresh p-4 text-fresh-foreground shadow-[var(--card-shadow)] sm:right-8">
              <ShieldCheck className="mb-2 size-6" />
              <p className="max-w-40 text-sm font-extrabold leading-5">Niño sano, enfermo y adolescentes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="servicios-title">
        <div className="mb-9 max-w-2xl">
          <p className="font-extrabold text-accent">Servicios</p>
          <h2 id="servicios-title" className="mt-2 text-4xl font-extrabold sm:text-5xl">Acompañamiento pediátrico integral</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="group rounded-3xl bg-card p-6 shadow-[var(--lift-shadow)] transition hover:-translate-y-1 hover:shadow-[var(--card-shadow)]">
              <service.icon className="mb-5 size-9 text-primary transition group-hover:scale-110" />
              <h3 className="text-xl font-extrabold">{service.title}</h3>
              <p className="mt-3 font-semibold leading-7 text-muted-foreground">{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="precios" className="bg-[image:var(--soft-gradient)] py-16" aria-labelledby="precios-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-extrabold text-primary">Consultas privadas</p>
              <h2 id="precios-title" className="mt-2 text-4xl font-extrabold sm:text-5xl">Opciones claras para cada familia</h2>
            </div>
            <a href={mapsUrl} className="inline-flex items-center gap-2 font-extrabold text-primary underline-offset-8 hover:underline" target="_blank" rel="noreferrer">
              <MapPin className="size-5" /> Cómo llegar a Chinácota
            </a>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {prices.map((item) => (
              <article key={item.name} className="rounded-3xl bg-card/90 p-7 shadow-[var(--card-shadow)] backdrop-blur transition hover:-translate-y-1">
                <p className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">{item.note}</p>
                <h3 className="mt-3 text-2xl font-extrabold">{item.name}</h3>
                <p className="mt-5 font-display text-4xl font-extrabold text-primary">{item.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center" aria-labelledby="contacto-title">
        <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-[var(--card-shadow)]">
          <Home className="mb-6 size-10" />
          <h2 id="contacto-title" className="text-4xl font-extrabold">Agenda tu consulta</h2>
          <p className="mt-4 text-lg font-semibold leading-8 text-primary-foreground/85">
            Para un caso particular, escribe o llama. La atención se coordina directamente por WhatsApp o teléfono.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((contact) => (
            <button key={contact.tel} type="button" onClick={() => setSelectedContact(contact)} className="rounded-3xl bg-card p-6 text-left shadow-[var(--lift-shadow)] transition hover:-translate-y-1 hover:shadow-[var(--card-shadow)] focus:outline-none focus:ring-4 focus:ring-ring/30">
              <Phone className={`mb-4 size-8 ${contact.tone}`} />
              <p className="font-extrabold text-muted-foreground">{contact.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-primary">{contact.number}</p>
            </button>
          ))}
        </div>
      </section>

      {selectedContact && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/35 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title" onClick={() => setSelectedContact(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-[var(--card-shadow)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-extrabold text-muted-foreground">{selectedContact.label}</p>
                <h2 id="contact-dialog-title" className="mt-1 text-3xl font-extrabold text-primary">{selectedContact.number}</h2>
              </div>
              <button type="button" onClick={() => setSelectedContact(null)} className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-ring/30" aria-label="Cerrar">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-5 font-semibold leading-7 text-muted-foreground">¿Cómo deseas comunicarte?</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${selectedContact.tel}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-extrabold text-primary-foreground shadow-[var(--lift-shadow)] transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-ring/30">
                <Phone className="size-5" /> Llamar normal
              </a>
              <a href={selectedContact.whatsapp} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 font-extrabold text-accent-foreground shadow-[var(--lift-shadow)] transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-ring/30">
                <MessageCircle className="size-5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;