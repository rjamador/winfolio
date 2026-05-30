import { clsx } from 'clsx'
import { useGithubUser } from '../hooks/useGithubUser'

const SKILLS = [
  'UI/UX design',
  'Git & version control',
  'Design patterns',
  'Web development',
]

/** About section — Roberto Amador's intro. (User-facing content.) */
export function AboutWindow() {
  const { data: user, isPending, isError } = useGithubUser()

  return (
    <article className="flex flex-col gap-3 text-w95 leading-relaxed">
      <header className="flex items-center gap-3">
        <Avatar src={isError ? undefined : user?.avatar_url} pending={isPending} />
        <div>
          <h2 className="text-w95-lg font-bold">Roberto Amador</h2>
          <p className="opacity-80">Systems Engineer</p>
        </div>
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

function Avatar({ src, pending }: { src?: string; pending: boolean }) {
  return (
    <div className="bevel-sunken h-16 w-16 shrink-0 bg-w95-light p-0.5">
      {src ? (
        <img
          src={src}
          alt="Roberto Amador"
          width={60}
          height={60}
          className="h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden className={clsx('h-full w-full bg-w95-bg', pending && 'animate-pulse')} />
      )}
    </div>
  )
}
