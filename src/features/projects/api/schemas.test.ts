import { projectSchema } from './schemas'

const valid = {
  id: 'winfolio',
  title: 'Winfolio',
  description: 'A retro portfolio.',
  tech: ['React', 'TypeScript'],
  url: 'https://example.com',
  featured: true,
  year: 2026,
}

describe('projectSchema', () => {
  it('parses a valid project', () => {
    expect(() => projectSchema.parse(valid)).not.toThrow()
  })

  it('defaults featured to false when omitted', () => {
    const { featured, ...withoutFeatured } = valid
    void featured
    expect(projectSchema.parse(withoutFeatured).featured).toBe(false)
  })

  it('rejects a missing required field (title)', () => {
    const { title, ...withoutTitle } = valid
    void title
    expect(() => projectSchema.parse(withoutTitle)).toThrow()
  })

  it('rejects a wrong-typed field (year as string)', () => {
    expect(() => projectSchema.parse({ ...valid, year: '2026' })).toThrow()
  })

  it('rejects a malformed url', () => {
    expect(() => projectSchema.parse({ ...valid, url: 'not-a-url' })).toThrow()
  })
})
