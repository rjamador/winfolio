import { render, screen } from '@testing-library/react'
import { ResumeWindow } from './ResumeWindow'

describe('ResumeWindow', () => {
  it('embeds the PDF preview and links to Google Drive', () => {
    render(<ResumeWindow />)
    expect(
      screen.getByTitle('Résumé (PDF)').getAttribute('src'),
    ).toContain('/preview')
    const link = screen.getByRole('link', { name: /Open in Google Drive/ })
    expect(link.getAttribute('href')).toContain('/view')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
