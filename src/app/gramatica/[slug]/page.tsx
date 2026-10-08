import { notFound } from "next/navigation";
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

export default async function GrammarTopicPage({ params }: PageProps<"/gramatica/[slug]">) {
  const { slug } = await params;
  const topic = grammarBySlug(slug);
  if (!topic) notFound();
  return <GrammarLesson topic={topic} />;
}
