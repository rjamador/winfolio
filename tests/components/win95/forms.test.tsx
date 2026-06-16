import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextInput } from './TextInput'
import { TextArea } from './TextArea'
import { Select } from './Select'
import { Checkbox } from './Checkbox'
import { Radio } from './Radio'
import { Fieldset } from './Fieldset'

// --- TextInput --------------------------------------------------------------

describe('TextInput', () => {
  it('calls onChange when the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TextInput value="" onChange={onChange} aria-label="Name" />)
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'hi')
    expect(onChange).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<TextInput value="x" onChange={vi.fn()} disabled aria-label="Name" />)
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled()
  })
})

// --- Checkbox ---------------------------------------------------------------

describe('Checkbox', () => {
  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Accept" />)
    await user.click(screen.getByRole('checkbox', { name: 'Accept' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does not fire when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Accept" disabled />)
    await user.click(screen.getByRole('checkbox', { name: 'Accept' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})

// --- Smoke renders ----------------------------------------------------------

describe('form primitives render without throwing', () => {
  it('TextArea renders', () => {
    render(<TextArea value="" onChange={vi.fn()} aria-label="Message" />)
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument()
  })

  it('Select renders options', () => {
    const options = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ]
    render(<Select value="a" onChange={vi.fn()} options={options} aria-label="Pick" />)
    expect(screen.getByRole('combobox', { name: 'Pick' })).toBeInTheDocument()
  })

  it('Radio renders with label', () => {
    render(
      <Radio
        checked={false}
        onChange={vi.fn()}
        label="Option A"
        name="group"
        value="a"
      />,
    )
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
  })

  it('Fieldset renders legend and children', () => {
    render(
      <Fieldset legend="Personal info">
        <span>content</span>
      </Fieldset>,
    )
    expect(screen.getByText('Personal info')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})

// --- Select controlled usage ------------------------------------------------

describe('Select controlled', () => {
  it('calls onChange with the selected value', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [val, setVal] = useState('a')
      return (
        <Select
          value={val}
          onChange={setVal}
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]}
          aria-label="Pick"
        />
      )
    }

    render(<Harness />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Pick' }), 'b')
    expect(screen.getByRole('combobox', { name: 'Pick' })).toHaveValue('b')
  })
})
