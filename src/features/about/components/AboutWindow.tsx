const TECH = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js']

/**
 * About section content.
 * and tech list. (User-facing content, kept separate from logic.)
 */
export function AboutWindow() {
  return (
    <article className="flex flex-col gap-3 text-[11px] leading-relaxed">
      <h2 className="text-sm font-bold">Hi, I'm [Your Name] 👋</h2>
      <p>
        I'm a frontend developer who loves building delightful, accessible
        interfaces. This portfolio is a faux Windows 95 desktop — drag the
        windows around, open a few, and poke at the Start menu.
      </p>
      <div>
        <h3 className="mb-1 font-bold">Tools I reach for</h3>
        <ul className="flex flex-wrap gap-1">
          {TECH.map((tech) => (
            <li key={tech} className="bevel-raised bg-w95-bg px-2 py-0.5">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
