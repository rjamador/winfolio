import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { githubReposFixture } from './githubRepos.fixture'

export const handlers = [
  http.get('https://api.github.com/users/:user/repos', () =>
    HttpResponse.json(githubReposFixture),
  ),
]

/** Shared MSW server for tests (started in src/test/setup.ts). */
export const server = setupServer(...handlers)
