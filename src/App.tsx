import { useState } from 'react'
import {
  Window,
  Fieldset,
  TextInput,
  TextArea,
  Select,
  Checkbox,
  Radio,
  ProgressBar,
  DesktopIcon,
} from '@/components/win95'

const TECH_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
]

function App() {
  // TEMPORARY Phase 2b visual check. Replaced by DesktopShell in Phase 3.
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [tech, setTech] = useState('react')
  const [subscribed, setSubscribed] = useState(false)
  const [size, setSize] = useState<'sm' | 'lg'>('sm')

  return (
    <main className="flex min-h-screen flex-wrap items-start gap-6 p-8">
      <Window title="Contact" className="w-80" onClose={() => {}}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-0.5 block text-[11px]" htmlFor="name">
              Name
            </label>
            <TextInput
              id="name"
              value={name}
              onChange={setName}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-0.5 block text-[11px]" htmlFor="message">
              Message
            </label>
            <TextArea
              id="message"
              value={message}
              onChange={setMessage}
              placeholder="Say hi…"
              rows={3}
            />
          </div>

          <Fieldset legend="Favourite tech">
            <Select
              value={tech}
              onChange={setTech}
              options={TECH_OPTIONS}
              aria-label="Favourite tech"
              className="mb-2"
            />
            <div className="flex flex-col gap-1">
              <Radio
                name="size"
                value="sm"
                checked={size === 'sm'}
                onChange={() => setSize('sm')}
                label="Small team"
              />
              <Radio
                name="size"
                value="lg"
                checked={size === 'lg'}
                onChange={() => setSize('lg')}
                label="Large team"
              />
            </div>
          </Fieldset>

          <Checkbox
            checked={subscribed}
            onChange={setSubscribed}
            label="Subscribe to updates"
          />

          <div>
            <p className="mb-1 text-[11px]">Sending…</p>
            <ProgressBar value={45} label="Sending message" />
          </div>
        </div>
      </Window>

      <div className="flex flex-col gap-2">
        <DesktopIcon label="My Computer" icon="🖥️" />
        <DesktopIcon label="Projects" icon="📁" selected />
        <DesktopIcon label="Recycle Bin" icon="🗑️" />
      </div>
    </main>
  )
}

export default App
