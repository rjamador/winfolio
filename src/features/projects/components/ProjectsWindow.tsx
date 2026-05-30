import { useNavigate } from 'react-router-dom'
import { Button95, PixelIcon, Win95Loader } from '@/components/win95'
import { useT } from '@/i18n'
import { useProject, useProjects } from '../hooks/useProjects'
import type { Project } from '../api/schemas'

type ProjectsWindowProps = {
  /** When set, show this project's detail instead of the list (from the URL). */
  selectedId?: string | null
}

/** Projects section: a list of projects, or one project's detail (URL-driven). */
export function ProjectsWindow({ selectedId }: ProjectsWindowProps) {
  if (selectedId) return <ProjectDetail id={selectedId} />
  return <ProjectList />
}

function ProjectList() {
  const navigate = useNavigate()
  const { t } = useT()
  const { data, isPending, isError } = useProjects()

  if (isPending) return <Win95Loader label={t('projects.loading')} />
  if (isError) return <ErrorNote>{t('projects.loadError')}</ErrorNote>

  return (
    <ul className="flex flex-col gap-1 text-w95">
      {data.map((project) => (
        <li key={project.id}>
          <button
            type="button"
            onClick={() => navigate(`/projects/${project.id}`)}
            className="focus-ring flex w-full items-center justify-between gap-2 px-2 py-1 text-left hover:bg-w95-titlebar hover:text-w95-titlebar-text"
          >
            <span className="flex min-w-0 items-center gap-1 truncate">
              {project.featured && <PixelIcon name="star" />}
              {project.title}
            </span>
            <span className="flex shrink-0 items-center gap-2 tabular-nums opacity-80">
              {project.language && <span>{project.language}</span>}
              <span className="inline-flex items-center gap-0.5">
                <PixelIcon name="star" /> {project.stars}
              </span>
              <span className="inline-flex items-center gap-0.5">
                <PixelIcon name="fork" /> {project.forks}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function ProjectDetail({ id }: { id: string }) {
  const navigate = useNavigate()
  const { t } = useT()
  const { data: project, isPending, isError } = useProject(id)

  if (isPending) return <Win95Loader label={t('projects.loading')} />
  if (isError) return <ErrorNote>{t('projects.loadOneError')}</ErrorNote>
  if (!project) return <NotFoundNote onBack={() => navigate('/projects')} />

  return (
    <article className="flex flex-col gap-3 text-w95">
      <Button95 onClick={() => navigate('/projects')}>{t('projects.back')}</Button95>
      <h2 className="text-w95-lg font-bold">
        {project.title} <span className="font-normal opacity-80">({project.year})</span>
      </h2>
      <div className="flex flex-wrap items-center gap-3 tabular-nums opacity-80">
        {project.language && <span>{project.language}</span>}
        <span className="inline-flex items-center gap-1">
          <PixelIcon name="star" /> {project.stars} {t('projects.stars')}
        </span>
        <span className="inline-flex items-center gap-1">
          <PixelIcon name="fork" /> {project.forks} {t('projects.forks')}
        </span>
      </div>
      <p className="leading-relaxed">{project.description || t('projects.noDescription')}</p>
      <TechList tech={project.tech} />
      <Links project={project} />
    </article>
  )
}

function TechList({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {tech.map((item) => (
        <li key={item} className="bevel-raised bg-w95-bg px-2 py-0.5">
          {item}
        </li>
      ))}
    </ul>
  )
}

function Links({ project }: { project: Project }) {
  const { t } = useT()
  if (!project.url && !project.repoUrl) return null
  return (
    <div className="flex gap-3">
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring text-w95-titlebar underline"
        >
          {t('projects.liveSite')}
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring text-w95-titlebar underline"
        >
          {t('projects.source')}
        </a>
      )}
    </div>
  )
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1 text-w95 text-w95-text">
      <PixelIcon name="exclamation-triangle" /> {children}
    </p>
  )
}

function NotFoundNote({ onBack }: { onBack: () => void }) {
  const { t } = useT()
  return (
    <div className="flex flex-col gap-2 text-w95">
      <p className="flex items-center gap-1">
        <PixelIcon name="exclamation-triangle" /> {t('projects.notFound')}
      </p>
      <Button95 onClick={onBack}>{t('projects.backToProjects')}</Button95>
    </div>
  )
}
