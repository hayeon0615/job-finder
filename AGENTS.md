# Agent Instructions

## Package Manager

- Use npm with the committed `package-lock.json`.
- Required Node.js: `>=22.13.0`.

## Commands

| Task | Command |
|------|---------|
| Install | `npm install` |
| Develop | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Generate Drizzle migrations | `npm run db:generate` |

- `npm test` still targets the removed starter skeleton; do not use it as product validation until `tests/rendered-html.test.mjs` is updated.

## Product Scope

- Build a calm, trustworthy, polished job-search screen for a first-year CNU Electrical Engineering student.
- Keep the visual direction blue/purple, card-based, and information-focused.
- Show six balanced job cards; surface job title and company first.
- Include internships and entry-level full-time roles; also include contract and field-practice roles.
- Support Daejeon/Sejong/Chungcheong and Seoul metro listings, with remote/hybrid work visible.
- Use company logos and real company imagery when available; animation may be prominent but must preserve readability.

## Interaction Rules

- Selecting a job card opens job details.
- Saving a job adds it to the saved list; the saved list supports side-by-side comparison, deadline sorting, and notes.
- Keep job-field filtering neutral until the user specifies a target field.
- Do not invent login, profile, application-submit, notification, or account behavior.

## Recommendation Rules

- Rank Chungcheong-area listings above Seoul metro listings; keep both regions visible.
- Prefer internships, entry-level roles, contract roles, and field-practice roles that accept new graduates without a grade restriction.
- Prefer Electrical Engineering-related work, near deadlines, remote/hybrid work, and large or mid-sized companies.
- Prefer listings that disclose salary or request/prefer Electrical Engineering skills.
- Mark certificate or language-score requirements; do not automatically exclude them.
- Do not rank by a specific job field until one is chosen.

## Data Boundaries

- Use mock job data only for now. Do not call or implement `채용정보조회api.txt`.
- Do not add live job ingestion, automatic application decisions, or a recommendation score without explicit product requirements.
- Treat `.next/`, `.vinext/`, `dist/`, `.wrangler/`, and `node_modules/` as generated or local files.

## References

| Need | File |
|------|------|
| Project setup and starter conventions | `README.md` |
| Unused job API reference | `채용정보조회api.txt` |
| Site bindings | `.openai/hosting.json` |
