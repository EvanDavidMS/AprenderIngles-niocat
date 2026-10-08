import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageSkeleton } from "@/components/PageSkeleton";
import { SPECIALTIES, specialtyBySlug } from "@/data/specialties";
import { SpecialtyView } from "./SpecialtyView";

export function generateStaticParams() {
  return SPECIALTIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/especialidades/[slug]">) {
  const { slug } = await params;
  const s = specialtyBySlug(slug);
  return {
    title: s ? `Inglés para ${s.title.toLowerCase()} · Soltura` : "Especialidades · Soltura",
    description: s
      ? `Inglés técnico para ${s.title.toLowerCase()} (${s.titleEn}): ${s.totalTerms} términos, frases reales y diálogos con audio.`
      : undefined,
  };
}

export default function SpecialtyPage({ params }: PageProps<"/especialidades/[slug]">) {
  // leer la URL dentro de <Suspense> deja que la navegación muestre algo al instante
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Specialty params={params} />
    </Suspense>
  );
}

async function Specialty({ params }: { params: PageProps<"/especialidades/[slug]">["params"] }) {
  const { slug } = await params;
  if (!specialtyBySlug(slug)) notFound();
  return <SpecialtyView slug={slug} />;
}
