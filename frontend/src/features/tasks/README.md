# Task Feature Structure

- `constants.ts`: controlled task status labels and upload accept-list.
- `task-card.tsx`: reusable task presentation/action component for future dashboard/detail reuse.
- `task-metrics.tsx`: reusable dashboard metric cards.

Route files under `src/app/tasks/` compose these feature modules with route parameters and navigation. API communication remains only in `src/services/`, while server state stays in TanStack Query.
