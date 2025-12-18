# API Package

Type-safe tRPC client and React integration for the SEED application.

## Overview

This package provides the tRPC client configuration and React Query integration for consuming the backend API. It exports different configurations for client-side, server-side, and static usage.

## Exports

### `@seed/api`

Re-exports tRPC client utilities from `@trpc/client`.

### `@seed/api/client`

Vanilla tRPC client for use in any JavaScript environment.

```typescript
import { api } from '@seed/api/client';

// Use in non-React contexts
const user = await api.auth.getUser.query();
```

### `@seed/api/server`

Server-side utilities for Next.js Server Components and API routes.

```typescript
import { createTRPCCaller } from '@seed/api/server';

// Use in Server Components
export default async function Page() {
  const trpc = await createTRPCCaller();
  const user = await trpc.auth.getUser();

  return <div>{user.name}</div>;
}
```

### `@seed/api/provider`

React Query provider for tRPC hooks.

```typescript
import { TRPCProvider } from '@seed/api/provider';

export default function App({ children }) {
  return (
    <TRPCProvider>
      {children}
    </TRPCProvider>
  );
}
```

### `@seed/api/types`

TypeScript type utilities for the API.

```typescript
import type { AppRouter } from '@seed/api/types';

type UserType = AppRouter['auth']['getUser']['_output'];
```

### `@seed/api/static`

Static exports for build-time usage.

## Usage

### React Component

```tsx
'use client';
import { api } from '@seed/api/client';

export function UserProfile() {
  // Query
  const { data: user, isLoading } = api.auth.getUser.useQuery();

  // Mutation
  const updateUser = api.auth.updateUser.useMutation({
    onSuccess: () => {
      console.log('User updated');
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => updateUser.mutate({ name: 'New Name' })}>
        Update
      </button>
    </div>
  );
}
```

### Server Component

```tsx
import { createTRPCCaller } from '@seed/api/server';

export default async function ServerPage() {
  const trpc = await createTRPCCaller();
  const user = await trpc.auth.getUser();

  return <div>Welcome, {user.name}!</div>;
}
```

### API Route

```typescript
import { createTRPCCaller } from '@seed/api/server';

export async function GET(request: Request) {
  const trpc = await createTRPCCaller({ req: request });
  const data = await trpc.business.list();

  return Response.json(data);
}
```

## React Query Features

### Automatic Caching

```tsx
// Cached for 5 minutes
const { data } = api.auth.getUser.useQuery(undefined, {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});
```

### Query Invalidation

```tsx
const utils = api.useUtils();

const mutation = api.business.create.useMutation({
  onSuccess: () => {
    // Refetch business list
    utils.business.list.invalidate();
  },
});
```

### Optimistic Updates

```tsx
const utils = api.useUtils();

const updateBusiness = api.business.update.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await utils.business.get.cancel();

    // Snapshot previous value
    const previous = utils.business.get.getData();

    // Optimistically update
    utils.business.get.setData(undefined, newData);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.business.get.setData(undefined, context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    utils.business.get.invalidate();
  },
});
```

### Prefetching

```tsx
const utils = api.useUtils();

// Prefetch data before navigation
await utils.business.list.prefetch();
```

## Configuration

### Client Configuration

The tRPC client is configured with:

- **Batch Link**: Batches requests made within 10ms
- **HTTP Link**: Sends requests to backend
- **Credentials**: Includes cookies for authentication
- **SuperJSON**: Handles Date objects and other non-JSON types

```typescript
// api/client.ts
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${SERVER_URL}/api`,
      fetch: customFetch,
      headers: () => ({
        // Custom headers
      }),
    }),
  ],
  transformer: SuperJSON,
});
```

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Type Safety

### Router Types

```typescript
import type { AppRouter } from '@seed/server';

// Infer input types
type EmailLoginInput = AppRouter['auth']['emailLogin']['_def']['input'];

// Infer output types
type UserOutput = AppRouter['auth']['getUser']['_def']['output'];
```

### Utility Types

```typescript
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@seed/server';

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

// Use with specific routes
type CreateBusinessInput = RouterInputs['business']['create'];
type BusinessOutput = RouterOutputs['business']['get'];
```

## Error Handling

```tsx
const mutation = api.auth.login.useMutation({
  onError: (error) => {
    if (error.data?.code === 'UNAUTHORIZED') {
      console.error('Authentication failed');
    }

    // Access error message
    console.error(error.message);
  },
});
```

## Best Practices

### Use Query Keys

```tsx
// React Query automatically generates keys, but you can customize
const { data } = api.business.get.useQuery(
  { businessId: 'id' },
  {
    queryKey: ['business', 'id', 'custom-key'],
  },
);
```

### Handle Loading States

```tsx
const { data, isLoading, isError, error } = api.auth.getUser.useQuery();

if (isLoading) return <Spinner />;
if (isError) return <Error message={error.message} />;

return <UserProfile user={data} />;
```

### Debounce Mutations

```tsx
import { useDebouncedCallback } from 'use-debounce';

const updateBusiness = api.business.update.useMutation();

const debouncedUpdate = useDebouncedCallback(
  (data) => updateBusiness.mutate(data),
  500, // 500ms delay
);
```

## Troubleshooting

### Network Errors

```tsx
// Check server is running
const { data, error } = api.auth.getUser.useQuery();

if (error?.message.includes('fetch failed')) {
  console.error('Server not reachable');
}
```

### CORS Errors

Ensure backend CORS is configured:

```typescript
// server/index.ts
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
```

### Type Errors

```bash
# Rebuild packages
pnpm --filter @seed/server build
pnpm --filter @seed/api build
pnpm --filter web dev
```

## Documentation

- [tRPC Documentation](https://trpc.io)
- [React Query Documentation](https://tanstack.com/query)
- [SuperJSON Documentation](https://github.com/blitz-js/superjson)
