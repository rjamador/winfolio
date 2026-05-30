type Role = {
  title: string
  period: string
  org: string
  bullets: string[]
  tech: string[]
}

const EXPERIENCE: Role[] = [
  {
    title: 'Full-Stack Developer',
    period: 'Jul. 2025 – Present',
    org: 'Grupo Invercasa - Casavisión',
    bullets: [
      'Responsible for the ASP.NET Core and React development of the Casavisión/Telecable client portal, centralizing the management of contracts, devices, and work orders.',
      'Integrated an efficient payment gateway for viewing and settling invoices within the client portal.',
    ],
    tech: ['React', 'ASP.NET', 'Microsoft SQL', 'Flutter', 'Angular'],
  },
  {
    title: 'Front-End Development Leader',
    period: '2023 - 2025',
    org: 'Fundación Movicáncer',
    bullets: [
      'Responsible for developing the web application for the new version of the national cancer tracking and prevention system, improving its functionality, performance, and user interface with modern and intuitive design.',
    ],
    tech: ['Angular', 'Tailwind', 'Oracle SQL', 'Spring Boot'],
  },
  {
    title: 'Front-End Developer',
    period: '2022 - 2023',
    org: 'Universidad Centroamericana',
    bullets: [
      'Member of the development team for EXPEDOC, a web application created for the Department of Education at Universidad Centroamericana, designed to provide comprehensive management of the faculty’s academic and professional records.',
    ],
    tech: ['ASP.NET', 'Microsoft SQL'],
  },
]

/** Work history. (User-facing content.) */
export function ExperienceWindow() {
  return (
    <ol className="flex flex-col gap-4 text-w95 leading-relaxed">
      {EXPERIENCE.map((role) => (
        <li key={`${role.org}-${role.title}`} className="flex flex-col gap-1">
          <h2 className="text-w95-lg font-bold">{role.title}</h2>
          <p className="opacity-80">
            {role.period} · {role.org}
          </p>
          <ul className="list-disc pl-4">
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <ul className="mt-1 flex flex-wrap gap-1">
            {role.tech.map((t) => (
              <li key={t} className="bevel-raised bg-w95-bg px-2 py-0.5">
                {t}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
