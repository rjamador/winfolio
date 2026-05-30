const SKILLS = [
  'UI/UX design',
  'Git & version control',
  'Design patterns',
  'Web development',
]

/** About section — Roberto Amador's intro. (User-facing content.) */
export function AboutWindow() {
  return (
    <article className="flex flex-col gap-3 text-w95 leading-relaxed">
      <header>
        <h2 className="text-w95-lg font-bold">Roberto Amador</h2>
        <p className="opacity-80">Systems Engineer</p>
      </header>

      <p className="font-bold">Designing modern, functional web experiences.</p>

      <p>
        My approach focuses on creating clean and minimalist designs that enhance
        user experience.
      </p>
      <p>
        My technical skill set includes a solid understanding of UI/UX design
        principles, experience with version control like Git, and knowledge of
        design patterns.
      </p>

      <div>
        <h3 className="mb-1 font-bold">Skills</h3>
        <ul className="flex flex-wrap gap-1">
          {SKILLS.map((skill) => (
            <li key={skill} className="bevel-raised bg-w95-bg px-2 py-0.5">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
