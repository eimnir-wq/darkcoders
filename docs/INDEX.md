# Documentation Index

Complete documentation set for the Dark Coders engineering handover.

| # | Document | Contents |
| --- | --- | --- |
| 01 | [PROJECT-INVENTORY.md](./PROJECT-INVENTORY.md) | Forensic file-by-file inventory of the project |
| 02 | [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, layering, data flow |
| 03 | [TECHNOLOGY-STACK.md](./TECHNOLOGY-STACK.md) | Exact stack and versions actually used |
| 04 | [REPRODUCIBILITY.md](./REPRODUCIBILITY.md) | How to recreate the exact environment |
| 05 | [DEVELOPMENT.md](./DEVELOPMENT.md) | Local development workflow and scripts |
| — | [INSTALLATION.md](./INSTALLATION.md) | Install and run on a fresh machine |
| — | [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) | Annotated repository layout |
| 06 | [ROUTES.md](./ROUTES.md) | Route / page inventory |
| 07 | [API.md](./API.md) | HTTP API inventory |
| 08 | [DATA-SOURCES.md](./DATA-SOURCES.md) | Where every piece of data comes from |
| 09 | [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | Colors, tokens, typography, components |
| 10 | [COMPONENT-CATALOG.md](./COMPONENT-CATALOG.md) | Reusable component reference |
| 11 | [VISUAL-REPRODUCTION.md](./VISUAL-REPRODUCTION.md) | Why the UI looks the way it does |
| 12 | [RESPONSIVE.md](./RESPONSIVE.md) | Responsive behaviour and breakpoints |
| 13 | [I18N.md](./I18N.md) | Localization, RTL and formatting |
| 14 | [SECURITY.md](./SECURITY.md) | Implemented security controls |
| 15 | [SECURITY-REVIEW.md](./SECURITY-REVIEW.md) | Secret scan and security review results |
| 16 | [DATABASE.md](./DATABASE.md) | Database / storage status |
| 17 | [INTEGRATIONS.md](./INTEGRATIONS.md) | Third-party services inventory |
| 18 | [DEPENDENCIES.md](./DEPENDENCIES.md) | Dependency inventory and rationale |
| 19 | [TESTING.md](./TESTING.md) | Testing status and how to add tests |
| 20 | [CICD.md](./CICD.md) | CI/CD status and recommended pipeline |
| 21 | [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment instructions and assumptions |
| 22 | [GIT-STATE.md](./GIT-STATE.md) | Version-control state at delivery |
| 23 | [QA-REPORT.md](./QA-REPORT.md) | Actual QA results |
| 24 | [TODO.md](./TODO.md) | Remaining tasks and future work |
| — | [FONTS.md](./FONTS.md) | Fonts used and how they are loaded |
| — | [HANDOVER.md](./HANDOVER.md) | Working / partial / not implemented |
| — | [verification/](./verification/README.md) | Captured build / test / environment evidence |
| — | [screenshots/](./screenshots/) | Reference screenshots (desktop · tablet · mobile) |

---

## Suggested reading order by role

- **New frontend developer** → 01 → 02 → 05 → 09 → 10 → 11 → 12
- **Full-stack developer** → 01 → 02 → 06 → 07 → 08 → 16 → 17
- **DevOps engineer** → 03 → 04 → 20 → 21 → `Dockerfile`
- **Security engineer** → 14 → 15 → 17
- **QA engineer** → 12 → 23 → `docs/screenshots/`
- **Technical PM** → [HANDOVER.md](./HANDOVER.md) → 24
