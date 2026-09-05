import { Pill } from '@/components/win95'
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
      location: 'Managua, Nicaragua',
      bullets: [
        'Built the Casavisión/Telecable customer portal with ASP.NET Core, Go (Fiber), and React — following solid development and SEO practices — centralizing the management of contracts, devices, and work orders, and integrated a payment gateway with a server-to-server architecture and 3D Secure 2.0 authentication, classified under PCI-DSS SAQ-D.',
        "Designed the company's design system in line with its brand language (typography, color, and other visual guidelines), with a set of reusable UI components adopted not only in the Casavisión/Telecable customer portal but also across other public and internal applications of the organization.",
      ],
      tech: ['React', 'Go', 'Fiber', 'ASP.NET Core'],
    },
    {
      title: 'Front-End Developer',
      period: 'Sept. 2023 – Jun. 2025',
      org: 'Fundación Movicáncer',
      location: 'Managua, Nicaragua',
      bullets: [
        'Helped build the new version of SIVIPCAN 5, improving accessibility, performance, and interface with Angular Material, and integrated the platform with the Ministry of Health portal, enabling secure access for all authorized medical staff.',
        'Implemented dynamic reports with JasperReport and column filtering to streamline patient-data analysis, and managed the design and content of the institutional website, including its articles and news.',
      ],
      tech: ['Angular', 'Angular Material', 'JasperReport'],
    },
    {
      title: 'Full-Stack Developer',
      period: '2022 – 2023',
      org: 'Universidad Centroamericana',
      location: 'Managua, Nicaragua',
      bullets: [
        "Part of the development team for EXPEDOC, an ASP.NET system that digitized and centralized the management of faculty members' academic and professional records for the Department of Education, implementing dynamic reports with Microsoft ReportViewer to speed up the generation of academic information.",
      ],
      tech: ['ASP.NET', 'ReportViewer'],
    },
  ],
  es: [
    {
      title: 'Desarrollador Full-Stack',
      period: 'Jul. 2025 – Presente',
      org: 'Grupo Invercasa - Casavisión',
      location: 'Managua, Nicaragua',
      bullets: [
        'Desarrollé el portal de clientes de Casavisión/Telecable con ASP.NET Core, Go (Fiber) y React, aplicando buenas prácticas de desarrollo y SEO, centralizando la gestión de contratos, dispositivos y órdenes de trabajo, e integré una pasarela de pagos con arquitectura server-to-server y autenticación 3D Secure 2.0, clasificada bajo PCI-DSS SAQ-D.',
        'Diseñé el design system de la empresa siguiendo su lenguaje de marca (tipografía, colores y demás lineamientos visuales), con un conjunto de componentes de interfaz reutilizables adoptado no solo en el portal de clientes de Casavisión/Telecable, sino también en otras aplicaciones públicas e internas de la organización.',
      ],
      tech: ['React', 'Go', 'Fiber', 'ASP.NET Core'],
    },
    {
      title: 'Desarrollador Front-End',
      period: 'Sept. 2023 – Jun. 2025',
      org: 'Fundación Movicáncer',
      location: 'Managua, Nicaragua',
      bullets: [
        'Participé en el desarrollo de la nueva versión de SIVIPCAN 5, optimizando accesibilidad, rendimiento e interfaz con Angular Material, e integré la plataforma con el portal del Ministerio de Salud, habilitando el acceso seguro para todo el personal médico autorizado.',
        'Implementé reportes dinámicos con JasperReport y filtrado de columnas para optimizar el análisis de datos de los pacientes, además de gestionar el diseño y contenido del sitio web institucional con sus artículos y noticias.',
      ],
      tech: ['Angular', 'Angular Material', 'JasperReport'],
    },
    {
      title: 'Desarrollador Full-Stack',
      period: '2022 – 2023',
      org: 'Universidad Centroamericana',
      location: 'Managua, Nicaragua',
      bullets: [
        'Formé parte del equipo de desarrollo del sistema EXPEDOC en ASP.NET, contribuyendo a digitalizar y centralizar la gestión de la carrera académica y profesional de los docentes del Departamento de Educación, e implementando reportes dinámicos con Microsoft ReportViewer para agilizar la generación de información académica.',
      ],
      tech: ['ASP.NET', 'ReportViewer'],
    },
  ],
}

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
              <Pill key={tech}>{tech}</Pill>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
