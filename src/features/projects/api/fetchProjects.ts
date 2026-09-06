import { ApiError } from "@/lib/api/client";
import { GITHUB_USERNAME } from "@/lib/config";
import {
  githubRepoListSchema,
  mapRepoToProject,
  type Project,
} from "./schemas";

/** Only these repos (by exact `name`) are surfaced in the Projects window. */
const PROJECT_ALLOWLIST = new Set([
  "Coinflow",
  "Starpay",
  "GymCheck",
  "Perfumeria",
  "GestorCitas",
  "old-portfolio",
  "Programatic",
  "ClinicaAsp",
  "oceanic-ui",
  "winfolio",
]);

/**
 * Hand-picked highlights, shown first and in this exact order. The best work
 * isn't always the most-starred or most-recently-touched repo, and a visitor
 * skimming for a few seconds should see it first regardless.
 */
const FEATURED_PROJECT_IDS = ["winfolio", "oceanic-ui", "Starpay", "old-portfolio"];

/** Featured projects sort first, in `FEATURED_PROJECT_IDS` order; everyone else follows, by stars. */
function featuredRank(id: string): number {
  const index = FEATURED_PROJECT_IDS.indexOf(id);
  return index === -1 ? FEATURED_PROJECT_IDS.length : index;
}

/**
 * Per-repo details GitHub doesn't expose (a curated logo, an npm page, extra
 * tech tags). Merged onto the mapped project by repo `name`.
 */
const PROJECT_EXTRAS: Record<
  string,
  Partial<Pick<Project, "image" | "npmUrl" | "tech">>
> = {
  "oceanic-ui": {
    image:
      "https://raw.githubusercontent.com/rjamador/oceanic-ui/main/.github/assets/logo.png",
    npmUrl: "https://www.npmjs.com/package/oceanic-ui",
    // GitHub only reports the `language` (TypeScript) and this repo has no
    // topics; React is the one genuinely missing tag.
    tech: ["React"],
  },
};

/** Merges any curated extras onto a project, de-duping the tech list. */
function applyExtras(project: Project): Project {
  const extra = PROJECT_EXTRAS[project.id];
  if (!extra) return project;
  return {
    ...project,
    ...extra,
    tech: [...new Set([...project.tech, ...(extra.tech ?? [])])],
  };
}

/**
 * Fetches the user's public GitHub repos, validates them, and maps them to
 * the internal Project shape: forks/archived are dropped, the curated
 * `FEATURED_PROJECT_IDS` are flagged `featured` and sorted first (in that
 * order), and everyone else follows by star count.
 */
export async function fetchProjects(): Promise<Project[]> {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new ApiError(`Network request failed: ${String(cause)}`);
  }
  if (!response.ok) {
    throw new ApiError(
      "Could not load repositories from GitHub.",
      response.status,
    );
  }

  const repos = githubRepoListSchema.parse(await response.json());

  const projects = repos
    .filter(
      (repo) =>
        !repo.fork && !repo.archived && PROJECT_ALLOWLIST.has(repo.name),
    )
    .map(mapRepoToProject)
    .map(applyExtras);

  projects.forEach((project) => {
    project.featured = FEATURED_PROJECT_IDS.includes(project.id);
  });

  projects.sort(
    (a, b) => featuredRank(a.id) - featuredRank(b.id) || b.stars - a.stars,
  );

  return projects;
}
