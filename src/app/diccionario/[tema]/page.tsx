import { notFound } from "next/navigation";
import { DICTIONARY, topicBySlug } from "@/data/dictionary";
import { TopicView } from "./TopicView";

export function generateStaticParams() {
  return DICTIONARY.map((t) => ({ tema: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/diccionario/[tema]">) {
  const { tema } = await params;
  const topic = topicBySlug(tema);
  return {
    title: topic ? `${topic.title} en inglés · Soltura` : "Diccionario · Soltura",
    description: topic
      ? `${topic.title} en inglés (${topic.titleEn}): ${topic.entries.length} palabras con singular, plural, preguntas y ejercicios.`
      : undefined,
  };
}

export default async function TopicPage({ params }: PageProps<"/diccionario/[tema]">) {
  const { tema } = await params;
  if (!topicBySlug(tema)) notFound();
  // el tema tiene funciones (no serializables), así que el cliente lo busca por slug
  return <TopicView slug={tema} />;
}
