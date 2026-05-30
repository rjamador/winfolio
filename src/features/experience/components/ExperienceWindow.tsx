import { useT, type Locale } from '@/i18n'

type Role = {
  title: string
  period: string
  org: string
  location?: string
  bullets: string[]
  tech: string[]
}

const EXPERIENCE: Record<Locale, Role[]> = {
  en: [
    {
      title: 'Full-Stack Developer',
      period: 'Jul. 2025 – Present',
      org: 'Grupo Invercasa - Casavisión',
      bullets: [
        'Responsible for the ASP.NET Core and React development of the Casavisión/Telecable customer portal, centralizing the management of contracts, devices, and work orders.',
        'Integrated an efficient payment gateway for viewing and settling invoices within the customer portal.',
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
  ],
  es: [
    {
      title: 'Desarrollador Full-Stack',
      period: 'Jul. 2025 – Presente',
      org: 'Grupo Invercasa - Casavisión',
      bullets: [
        'Responsable del desarrollo en ASP.NET Core y React del portal para clientes de Casavisión/Telecable, centralizando la gestión de contratos, dispositivos y órdenes de trabajo.',
        'Integración de una pasarela de pagos eficiente para la consulta y cancelación de facturas dentro del portal para clientes.',
      ],
      tech: ['React', 'ASP.NET', 'Microsoft SQL', 'Flutter', 'Angular'],
    },
    {
      title: 'Líder de Desarrollo Front-End',
      period: '2023 - 2025',
      org: 'Fundación Movicáncer',
      bullets: [
        'Responsable del desarrollo de la aplicación web para la nueva versión del sistema nacional de seguimiento y prevención del cáncer, mejorando su funcionalidad, rendimiento e interfaz de usuario con un diseño moderno e intuitivo.',
      ],
      tech: ['Angular', 'Tailwind', 'Oracle SQL', 'Spring Boot'],
    },
    {
      title: 'Desarrollador Front-End',
      period: '2022 - 2023',
      org: 'Universidad Centroamericana',
      bullets: [
        'Miembro del equipo de desarrollo de EXPEDOC, una aplicación web creada para el Departamento de Educación de la Universidad Centroamericana, diseñada para la gestión integral de los registros académicos y profesionales de la facultad.',
      ],
      tech: ['ASP.NET', 'Microsoft SQL'],
    },
  ],
}

/** Work history. (User-facing content.) */
export function ExperienceWindow() {
  const { locale } = useT()
  const roles = EXPERIENCE[locale]

  return (
    <ol className="flex flex-col gap-4 text-w95 leading-relaxed">
      {roles.map((role) => (
        <li key={`${role.org}-${role.title}`} className="flex flex-col gap-1">
          <h2 className="text-w95-lg font-bold">{role.title}</h2>
          <p className="opacity-80">
            {role.period} · {role.org}
            {role.location ? ` · ${role.location}` : ''}
          </p>
          <ul className="list-disc pl-4">
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <ul className="mt-1 flex flex-wrap gap-1">
            {role.tech.map((tech) => (
              <li key={tech} className="bevel-raised bg-w95-bg px-2 py-0.5">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
