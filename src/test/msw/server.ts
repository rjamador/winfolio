import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { githubReposFixture } from './githubRepos.fixture'

export const githubUserFixture = {
  login: 'rjamador',
  name: 'Roberto Amador',
  avatar_url: 'https://avatars.githubusercontent.com/u/000000?v=4',
}

export const handlers = [
  http.get('https://api.github.com/users/:user/repos', () =>
    HttpResponse.json(githubReposFixture),
  ),
  http.get('https://api.github.com/users/:user', () =>
    HttpResponse.json(githubUserFixture),
  ),
]

/** Shared MSW server for tests (started in src/test/setup.ts). */
export const server = setupServer(...handlers)
