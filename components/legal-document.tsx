import type { LegalDoc } from '@/lib/legal-content'

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <article className="mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-foreground/90">
      <p className="text-pretty">{doc.intro}</p>
      {doc.sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-3">
          <h2 className="font-brand text-xl font-semibold tracking-tight text-foreground">
            {section.title}
          </h2>
          {section.blocks.map((block, i) =>
            block.type === 'p' ? (
              <p key={i} className="text-pretty">
                {block.text}
              </p>
            ) : (
              <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
                {block.items.map((item) => (
                  <li key={item} className="text-pretty">
                    {item}
                  </li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}
    </article>
  )
}
