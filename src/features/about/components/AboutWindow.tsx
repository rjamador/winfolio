import { clsx } from 'clsx'
import { useClock } from '@/hooks/useClock'
import { useT } from '@/i18n'
import type { MessageKey } from '@/i18n/messages'
import { useGithubUser } from '../hooks/useGithubUser'

const SKILL_KEYS: MessageKey[] = [
  'about.skill.uiux',
  'about.skill.git',
  'about.skill.patterns',
  'about.skill.web',
]

const BIRTH_DATE = new Date(2003, 3, 9) // 9 April 2003

/** About section — Roberto Amador's intro. (User-facing content.) */
export function AboutWindow() {
  const { t, locale } = useT()
  const { data: user, isPending, isError } = useGithubUser()
  const managuaTime = useClock({ timeZone: 'America/Managua', withSeconds: true })

  const birthday = BIRTH_DATE.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="flex flex-col gap-3 text-w95 leading-relaxed">
      <header className="flex items-center gap-3">
        <Avatar src={isError ? undefined : user?.avatar_url} pending={isPending} />
        <div>
          <h2 className="text-w95-lg font-bold">Roberto Amador</h2>
          <p className="opacity-80">{t('about.role')}</p>
        </div>
      </header>

      <p className="font-bold">{t('about.tagline')}</p>
      <p>{t('about.p1')}</p>
      <p>{t('about.p2')}</p>

      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
        <dt className="font-bold">{t('about.birthday')}:</dt>
        <dd>{birthday}</dd>
        <dt className="font-bold">{t('about.location')}:</dt>
        <dd>Managua, Nicaragua</dd>
        <dt className="font-bold">{t('about.localTime')}:</dt>
        <dd className="tabular-nums">{managuaTime}</dd>
      </dl>

      <div>
        <h3 className="mb-1 font-bold">{t('about.skillsHeading')}</h3>
        <ul className="flex flex-wrap gap-1">
          {SKILL_KEYS.map((key) => (
            <li key={key} className="bevel-raised bg-w95-bg px-2 py-0.5">
              {t(key)}
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
