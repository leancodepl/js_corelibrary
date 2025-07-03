# @leancodepl/utils

A TypeScript utility library with helper functions, React hooks, and type utilities.

## Installation

```bash
npm install @leancodepl/utils
# or
yarn add @leancodepl/utils
```

## Overview

This package provides utilities for common development tasks including assertions, object transformations, file operations, and React hooks.

## API

### `assertDefined<T>(value: T | undefined, message?: string): asserts value is T`

Assert that a value is not undefined.

**Parameters:**
- `value`: Value to check (T | undefined)
- `message`: Optional error message (string)

**Returns:** Type assertion - throws if value is undefined

### `assertNotNull<T>(value: T | null, message?: string): asserts value is T`

Assert that a value is not null.

**Parameters:**
- `value`: Value to check (T | null)
- `message`: Optional error message (string)

**Returns:** Type assertion - throws if value is null

### `assertNotEmpty<T>(value: T | null | undefined, message?: string): asserts value is T`

Assert that a value is not null or undefined.

**Parameters:**
- `value`: Value to check (T | null | undefined)
- `message`: Optional error message (string)

**Returns:** Type assertion - throws if value is null or undefined

### `ensureDefined<T>(value: T | undefined): T`

Ensure a value is defined, returning it or throwing.

**Parameters:**
- `value`: Value to check (T | undefined)

**Returns:** The value (T) - throws if undefined

### `ensureNotNull<T>(value: T | null): T`

Ensure a value is not null, returning it or throwing.

**Parameters:**
- `value`: Value to check (T | null)

**Returns:** The value (T) - throws if null

### `ensureNotEmpty<T>(value: T | null | undefined): T`

Ensure a value is not null or undefined, returning it or throwing.

**Parameters:**
- `value`: Value to check (T | null | undefined)

**Returns:** The value (T) - throws if null or undefined

### `addPrefix<T extends object, TPrefix extends string>(object: T, prefix: TPrefix): PrefixWith<T, TPrefix>`

Add a prefix to all object keys.

**Parameters:**
- `object`: Object whose keys to prefix (T extends object)
- `prefix`: String prefix to add (TPrefix extends string)

**Returns:** New object with prefixed keys (PrefixWith<T, TPrefix>)

### `capitalizeDeep<T>(value: T): CapitalizeDeep<T>`

Recursively capitalize all object keys.

**Parameters:**
- `value`: Value to transform (T)

**Returns:** Deeply transformed value with capitalized keys (CapitalizeDeep<T>)

### `uncapitalizeDeep<T>(value: T): UncapitalizeDeep<T>`

Recursively uncapitalize all object keys.

**Parameters:**
- `value`: Value to transform (T)

**Returns:** Deeply transformed value with uncapitalized keys (UncapitalizeDeep<T>)

### `downloadFile(url: string, options?: DownloadFileOptions): void`
### `downloadFile(obj: Blob | MediaSource, options?: DownloadFileOptions): void`

Download a file from URL or Blob object.

**Parameters:**
- `url`: File URL (string) OR `obj`: Blob/MediaSource object
- `options`: Download options ({ name?: string })

**Returns:** void

### `useDialog(onAfterClose?: () => void): { isDialogOpen: boolean; openDialog: () => void; closeDialog: () => void }`

React hook for managing dialog state.

**Parameters:**
- `onAfterClose`: Optional callback after dialog closes (() => void)

**Returns:** Dialog state and controls ({ isDialogOpen: boolean; openDialog: () => void; closeDialog: () => void })

### `useRunInTask(): [boolean, <T>(task: () => Promise<T> | T) => Promise<T>]`

React hook for tracking async task execution.

**Parameters:** None

**Returns:** Tuple of loading state and task runner ([boolean, function])

### `useBoundRunInTask<T extends (...args: any[]) => any>(fn: T): [boolean, T]`

React hook for bound task execution with loading state.

**Parameters:**
- `fn`: Function to bind and track (T extends (...args: any[]) => any)

**Returns:** Tuple of loading state and bound function ([boolean, T])

### `useKeyByRoute(): string`

React hook for generating keys based on current route.

**Parameters:** None

**Returns:** Route-based key (string)

### `useSetUnset<T>(setter: (value: T) => void): [() => void, () => void]`

React hook for boolean state management helpers.

**Parameters:**
- `setter`: State setter function ((value: T) => void)

**Returns:** Tuple of set and unset functions ([() => void, () => void])

## Usage Examples

### Assertions

```typescript
import { assertDefined, assertNotNull, assertNotEmpty } from '@leancodepl/utils';

const user = await getUser();
assertDefined(user, 'User must be defined');
assertNotNull(user.email, 'Email is required');
assertNotEmpty(user.name, 'Name cannot be empty');

// TypeScript now knows user, user.email, and user.name are defined
console.log(user.name.toUpperCase());
```

### Object Transformations

```typescript
import { addPrefix, capitalizeDeep, uncapitalizeDeep } from '@leancodepl/utils';

// Add prefix to keys
const apiData = { userId: 1, userName: 'John' };
const prefixed = addPrefix(apiData, 'api_');
// Result: { api_userId: 1, api_userName: 'John' }

// Transform object keys
const serverData = { UserId: 1, UserName: 'John', Profile: { FirstName: 'John' } };
const clientData = uncapitalizeDeep(serverData);
// Result: { userId: 1, userName: 'John', profile: { firstName: 'John' } }

const backToServer = capitalizeDeep(clientData);
// Result: { UserId: 1, UserName: 'John', Profile: { FirstName: 'John' } }
```

### File Downloads

```typescript
import { downloadFile } from '@leancodepl/utils';

// Download from URL
downloadFile('https://example.com/file.pdf', { name: 'document.pdf' });

// Download from Blob
const blob = new Blob(['Hello World'], { type: 'text/plain' });
downloadFile(blob, { name: 'hello.txt' });
```

### React Hooks

```typescript
import { 
  useDialog, 
  useRunInTask, 
  useBoundRunInTask, 
  useSetUnset 
} from '@leancodepl/utils';

function MyComponent() {
  // Dialog management
  const { isDialogOpen, openDialog, closeDialog } = useDialog(() => {
    console.log('Dialog closed');
  });

  // Task management
  const [isLoading, runInTask] = useRunInTask();

  const handleSave = async () => {
    await runInTask(async () => {
      await saveData();
    });
  };

  // Boolean state helper
  const [isVisible, setIsVisible] = useState(false);
  const [show, hide] = useSetUnset(setIsVisible);

  return (
    <div>
      <button onClick={openDialog}>Open Dialog</button>
      <button onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </button>
      <button onClick={show}>Show</button>
      <button onClick={hide}>Hide</button>
    </div>
  );
}
```

### Bound Task Management

```typescript
import { useBoundRunInTask } from '@leancodepl/utils';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  const [isLoading, loadUser] = useBoundRunInTask(async () => {
    const userData = await fetchUser(userId);
    setUser(userData);
  });

  useEffect(() => {
    loadUser();
  }, [userId, loadUser]);

  if (isLoading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

### Ensures vs Assertions

```typescript
import { ensureDefined, assertDefined } from '@leancodepl/utils';

// ensureDefined returns the value or throws
function processUser(user?: User) {
  const definedUser = ensureDefined(user); // Returns User or throws
  return definedUser.name;
}

// assertDefined is a type assertion
function processUserAssert(user?: User) {
  assertDefined(user); // Throws if undefined, no return value
  return user.name; // TypeScript knows user is defined
}
```

## TypeScript Types

The package exports advanced TypeScript utility types:

- `PrefixWith<T, TPrefix>` - Type for objects with prefixed keys
- `CapitalizeDeep<T>` - Type for deeply capitalized object keys  
- `UncapitalizeDeep<T>` - Type for deeply uncapitalized object keys
- `TransformDeep<T, TMode>` - Generic type for deep key transformations

## Dependencies

- `@leancodepl/api-date`: Date handling utilities
- `tiny-invariant`: Runtime assertions
- `react`: Peer dependency for React hooks
