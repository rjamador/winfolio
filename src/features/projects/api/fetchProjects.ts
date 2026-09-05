import { ApiError } from "@/lib/api/client";
import { GITHUB_USERNAME } from "@/lib/config";
import {
  githubRepoListSchema,
  mapRepoToProject,
  type Project,
} from "./schemas";

const FEATURED_COUNT = 3;

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
 * Fetches the user's public GitHub repos, validates them, and maps them to the
 * internal Project shape: forks/archived are dropped, the list is sorted by stars
 * (then most-recently-updated), and the top-starred few are flagged `featured`.
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

  // The API already returns repos sorted by `updated` desc; a stable sort by
  // stars desc therefore keeps the most-recent order within equal star counts.
  const projects = repos
    .filter(
      (repo) =>
        !repo.fork && !repo.archived && PROJECT_ALLOWLIST.has(repo.name),
    )
    .map(mapRepoToProject)
    .map(applyExtras)
    .sort((a, b) => b.stars - a.stars);

  // Flag the top-starred projects (with at least one star) as featured.
  projects.forEach((project, index) => {
    project.featured = index < FEATURED_COUNT && project.stars > 0;
  });

  return projects;
}
