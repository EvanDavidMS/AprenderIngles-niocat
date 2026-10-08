/** Esqueleto mientras llega el slug de la URL: misma forma que la portada y las pestañas */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="animate-pulse">
      <div className="mb-4 h-5 w-40 rounded-full bg-line" />
      <div className="h-56 rounded-[2rem] bg-hero/80 sm:h-64" />
      <div className="mt-6 h-12 w-full rounded-2xl bg-card sm:w-96" />
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-20 rounded-3xl bg-card" />
        ))}
      </div>
    </div>
  );
}
