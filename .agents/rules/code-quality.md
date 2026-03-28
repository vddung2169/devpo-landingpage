---
trigger: always_on
---

# Code Quality & Development Standards

## 1. TypeScript & Type Safety

- **Strict Mode**: `strict: true` is mandatory in `tsconfig.json`.
- **No `any`**: The use of `any` is forbidden. Use `unknown` for dynamic data and narrow it using **Zod** or Type Guards.
- **Interfaces vs Types**:
  - Use `interface` for public API contracts and component props.
  - Use `type` for unions, intersections, and utility types.
- **Exhaustive Checks**: Use `never` in switch/case statements to ensure all enum/union members are handled.

## 2. React 19 Best Practices

- **Clean Components**: Keep components under 150 lines. If a component grows larger, extract sub-components into the feature's `components/` folder.
- **Prop Destructuring**: Always destructure props in the function signature: `export function TradeButton({ symbol, price }: TradeButtonProps)`.
- **Memoization**: Rely on the **React Compiler**. Only use `useMemo` or `useCallback` for expensive manual calculations or stabilizing references for dependency arrays in complex hooks.
- **Keys**: Never use array indices as `key` props for dynamic lists; use unique IDs from the NestJS backend.

## 3. Modular CSS (Tailwind 4)

- **Utility First**: Favor Tailwind utility classes over custom CSS.
- **Semantic Variables**: Use Tailwind 4 `@theme` variables (e.g., `text-primary`, `bg-card`) instead of hardcoded hex values to support instant Dark Mode.
- **Clean Classes**: Use the `cn()` utility (tailwind-merge + clsx) for conditional class joining.
- **Class Ordering**: Classes must be sorted according to the Prettier Tailwind plugin (Layout -> Box Model -> Typography -> Visuals).

## 4. Import & Export Patterns

- **Named Exports**: Use named exports for all functions, components, and constants.
  - _Exception_: Next.js route files (`page.tsx`, `layout.tsx`) must use `export default`.
- **Import Ordering**:
  1. React/Next.js core.
  2. Third-party libraries (ECharts, TanStack, etc.).
  3. Shared internal aliases (`@/components`, `@/lib`).
  4. Feature-relative imports (`./hooks`, `./services`).
  5. Styles/Types.

## 5. Async & Error Handling

- **Zod Integration**: Every service call in `src/features/[name]/services/api.ts` must use `.parse()` or `.safeParse()` on the response data.
- **Nullable Checks**: Use Optional Chaining (`?.`) and Nullish Coalescing (`??`) extensively to prevent "Cannot read property of undefined" errors.
- **Loading States**: Use React 19 `useActionState` and `Pending` UI patterns for all form submissions and data mutations.

## 6. Documentation

- **JSDoc**: Document all complex business logic, custom hooks, and utility functions using JSDoc comments.
- **Self-Documenting Code**: Favor descriptive variable names (e.g., `isUserAuthenticated`) over comments explaining what a variable does.
