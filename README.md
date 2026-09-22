# A Bancada — portfólio de Marcus Vinicius

A bilingual portfolio where every project is a **small machine living on a
bench**, and the state of each machine comes from its real GitHub repository.

![The home page in dark mode](docs/images/home-dark.png)

*(README in English on purpose: this repository is linked from the site, which
is aimed at both Brazilian and international readers.)*

> **Status — under construction.** This is stage 3 of 7: the data pipeline,
> the mood rules and the project index are live. The machines themselves (a
> pixel-art floor in Canvas 2D), the in-place project panel and the hero's
> light effect come next — see [Roadmap](#roadmap).

## The idea

The projects become machines with a screen for a face: a floating lens for
VisionForge, a weather station for AirWatch, a coffee maker for CoffeeBean, a
ball launcher for VoleiArena. None of them is humanoid.

Each machine's **mood is computed from the repository**. A daily job reads the
last commit (across *all* branches — `pushed_at` lies), the commits in the last
90 days, the latest tag and the stars, and crosses that with a hand-written
status:

| Mood | When |
|---|---|
| graduated | the project is finished — university coursework, for instance |
| full steam | active, 30 or more commits in 90 days |
| active | active, fewer commits |
| yawning / napping / asleep | paused, for under 90 / 90–180 / over 180 days |

Finished is not abandoned: a course project from 2024 *graduates*, it doesn't
gather dust. And the data keeps the status honest — a project marked "active"
with no commit in six months is treated as paused, and the build says so.

![The project index, each row saying the mood and the fact behind it](docs/images/index.png)

## A few things I'd point at

**The build never touches the network.** `npm run refresh:github` writes
`src/data/github-snapshot.json`, which is committed. A GitHub Action refreshes
it daily. The mood's "today" is the snapshot's date, never the clock, so any
build is reproducible.

**A missing translation fails the build**, and so does an empty collection —
which is what would happen, silently, if the content id format ever changed.

**Colour contrast is a test, not a hope.** Every accent is a *pair* — dark and
light mode — and `tests/unit/project-accents.test.ts` reads the real content
files to assert WCAG AA on each.

**No display text lives in a component.** It's all in `src/lib/ui-strings.ts`
or in MDX frontmatter.

| Light mode | English |
|---|---|
| ![Home in light mode — the hero stays a dark stage](docs/images/home-light.png) | ![Home in English](docs/images/home-en.png) |

## Commands

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site to `./dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run check` | Type-check, including `.astro` files and tests |
| `npm run refresh:github` | Refresh the GitHub snapshot (needs `GITHUB_TOKEN`) |
| `npm run shots` | Regenerate the screenshots in this README |

## Roadmap

- [x] **Stage 3 — data, mood and index.**
- [ ] **Stage 4 — the floor.** Canvas 2D, Aseprite spritesheets, the first two
  machines.
- [ ] **Stage 5 — the panel.** Projects open in place; the URL still changes.
- [ ] **Stage 6 — the hero.** Half photograph, half squares of light on the
  same pixel grid as the machines.
- [ ] **Stage 7 — the full cast** and the interactions between machines.

See `CLAUDE.md` for the project's invariants, and `docs/superpowers/` for the
spec and the implementation plans.
