import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageSkeleton } from "@/components/PageSkeleton";
import { GRAMMAR, grammarBySlug } from "@/data/grammar";
import { GrammarLesson } from "./GrammarLesson";

export function generateStaticParams() {
  return GRAMMAR.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gramatica/[slug]">) {
  const { slug } = await params;
  const topic = grammarBySlug(slug);
  return { title: topic ? `${topic.title} · Soltura` : "Gramática · Soltura" };
}

export default function GrammarTopicPage({ params }: PageProps<"/gramatica/[slug]">) {
  // leer la URL dentro de <Suspense> deja que la navegación muestre algo al instante
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Lesson params={params} />
    </Suspense>
  );
}

async function Lesson({ params }: { params: PageProps<"/gramatica/[slug]">["params"] }) {
  const { slug } = await params;
  const topic = grammarBySlug(slug);
  if (!topic) notFound();
  return <GrammarLesson topic={topic} />;
}
