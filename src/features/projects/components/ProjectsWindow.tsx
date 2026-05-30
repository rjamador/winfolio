import { useNavigate } from 'react-router-dom'
import { Button95, Win95Loader } from '@/components/win95'
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
  const { data, isPending, isError } = useProjects()

  if (isPending) return <Win95Loader label="Loading projects…" />
  if (isError) return <ErrorNote>Could not load projects.</ErrorNote>

  return (
    <ul className="flex flex-col gap-1 text-[11px]">
      {data.map((project) => (
        <li key={project.id}>
          <button
            type="button"
            onClick={() => navigate(`/projects/${project.id}`)}
            className="focus-ring flex w-full items-center justify-between gap-2 px-2 py-1 text-left hover:bg-w95-titlebar hover:text-w95-titlebar-text"
          >
            <span className="truncate">
              {project.featured && <span aria-hidden>⭐ </span>}
              {project.title}
            </span>
            <span className="shrink-0 tabular-nums opacity-80">{project.year}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function ProjectDetail({ id }: { id: string }) {
  const navigate = useNavigate()
  const { data: project, isPending, isError } = useProject(id)

  if (isPending) return <Win95Loader label="Loading project…" />
  if (isError) return <ErrorNote>Could not load this project.</ErrorNote>
  if (!project) return <NotFoundNote onBack={() => navigate('/projects')} />

  return (
    <article className="flex flex-col gap-3 text-[11px]">
      <Button95 onClick={() => navigate('/projects')}>← Back</Button95>
      <h2 className="text-sm font-bold">
        {project.title} <span className="font-normal opacity-80">({project.year})</span>
      </h2>
      <p className="leading-relaxed">{project.description}</p>
      <TechList tech={project.tech} />
      <Links project={project} />
    </article>
  )
}

function TechList({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {tech.map((t) => (
        <li key={t} className="bevel-raised bg-w95-bg px-2 py-0.5">
          {t}
        </li>
      ))}
    </ul>
  )
}

function Links({ project }: { project: Project }) {
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
          Live site
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring text-w95-titlebar underline"
        >
          Source
        </a>
      )}
    </div>
  )
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-w95-text">⚠ {children}</p>
}

function NotFoundNote({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <p>⚠ That project does not exist.</p>
      <Button95 onClick={onBack}>← Back to projects</Button95>
    </div>
  )
}
