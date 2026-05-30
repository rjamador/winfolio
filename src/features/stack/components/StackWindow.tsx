import type { ComponentType } from 'react'
import { PixelatedIcon } from './PixelatedIcon'
import TailwindcssOriginal from 'devicons-react/icons/TailwindcssOriginal'
import DotnetcoreOriginal from 'devicons-react/icons/DotNetPlain'
import AngularOriginal from 'devicons-react/icons/AngularOriginal'
import ReactOriginal from 'devicons-react/icons/ReactOriginal'
import RxjsOriginal from 'devicons-react/icons/RxjsOriginal'
import TypescriptOriginal from 'devicons-react/icons/TypescriptOriginal'
import PostgresqlOriginal from 'devicons-react/icons/PostgresqlOriginal'
import AngularMaterialOriginal from 'devicons-react/icons/AngularmaterialOriginal'
import MssqlOriginal from 'devicons-react/icons/MicrosoftsqlserverOriginal'
import GoOriginal from 'devicons-react/icons/GoOriginal'
import DartOriginal from 'devicons-react/icons/DartOriginal'
import FlutterOriginal from 'devicons-react/icons/FlutterOriginal'

type IconComponent = ComponentType<{ size?: number }>

type StackItem = {
  label: string
  Icon: IconComponent
}

const STACK: StackItem[] = [
  { label: 'React', Icon: ReactOriginal },
  { label: 'Angular', Icon: AngularOriginal },
  { label: 'Angular Material', Icon: AngularMaterialOriginal },
  { label: 'TypeScript', Icon: TypescriptOriginal },
  { label: 'RxJS', Icon: RxjsOriginal },
  { label: 'Tailwind CSS', Icon: TailwindcssOriginal },
  { label: '.NET', Icon: DotnetcoreOriginal },
  { label: 'SQL Server', Icon: MssqlOriginal },
  { label: 'PostgreSQL', Icon: PostgresqlOriginal },
  { label: 'Go', Icon: GoOriginal },
  { label: 'Dart', Icon: DartOriginal },
  { label: 'Flutter', Icon: FlutterOriginal },
]

/** Tech stack: a grid of logo tiles. (User-facing content.) */
export function StackWindow() {
  return (
    <ul className="grid grid-cols-3 gap-2 text-w95 sm:grid-cols-4">
      {STACK.map(({ label, Icon }) => (
        <li
          key={label}
          className="bevel-raised flex flex-col items-center gap-1 bg-w95-bg p-2 text-center"
        >
          <span aria-hidden>
            <PixelatedIcon Icon={Icon} size={36} resolution={18} />
          </span>
          <span className="leading-tight">{label}</span>
        </li>
      ))}
    </ul>
  )
}
