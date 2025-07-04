# @leancodepl/utils

A TypeScript utility library for common development tasks including assertions, object transformations, file operations, and hooks.

## Installation

```bash
npm install @leancodepl/utils
# or
yarn add @leancodepl/utils
```

## API

### `assertDefined(value, message)`

Asserts that a value is not undefined. Throws an error if the value is undefined.

**Parameters:**
- `value: T | undefined` - The value to check for undefined
- `message?: string` - Optional error message to use if assertion fails

### `assertNotNull(value, message)`

Asserts that a value is not null. Throws an error if the value is null.

**Parameters:**
- `value: T | null` - The value to check for null
- `message?: string` - Optional error message to use if assertion fails

### `assertNotEmpty(value, message)`

Asserts that a value is not null or undefined. Throws an error if the value is null or undefined.

**Parameters:**
- `value: T | null | undefined` - The value to check for null or undefined
- `message?: string` - Optional error message to use if assertion fails

### `ensureDefined(value, message)`

Ensures that a value is defined, returning it if defined or throwing an error if undefined.

**Parameters:**
- `value: T | undefined` - The value to ensure is defined
- `message?: string` - Optional error message to use if the value is undefined

**Returns:** The value if it is defined

### `ensureNotNull(value, message)`

Ensures that a value is not null, returning it if not null or throwing an error if null.

**Parameters:**
- `value: T | null` - The value to ensure is not null
- `message?: string` - Optional error message to use if the value is null

**Returns:** The value if it is not null

### `ensureNotEmpty(value, message)`

Ensures that a value is not null or undefined, returning it if valid or throwing an error if empty.

**Parameters:**
- `value: T | null | undefined` - The value to ensure is not null or undefined
- `message?: string` - Optional error message to use if the value is null or undefined

**Returns:** The value if it is not null or undefined

### `addPrefix(object, prefix)`

Adds a prefix to all keys in an object, creating a new object with prefixed keys.

**Parameters:**
- `object: T extends object` - The object whose keys will be prefixed
- `prefix: TPrefix extends string` - The prefix string to add to each key

**Returns:** A new object with all keys prefixed

### `capitalizeDeep(value)`

Recursively transforms all object keys to use capitalized (PascalCase) format.

**Parameters:**
- `value: T` - The value to transform (can be object, array, or primitive)

**Returns:** A new object with all keys converted to PascalCase

### `uncapitalizeDeep(value)`

Recursively transforms all object keys to use uncapitalized (camelCase) format.

**Parameters:**
- `value: T` - The value to transform (can be object, array, or primitive)

**Returns:** A new object with all keys converted to camelCase

### `toLowerFirst(value)`

Converts the first character of a string to lowercase.

**Parameters:**
- `value: string` - The string to transform

**Returns:** The string with the first character in lowercase

### `toUpperFirst(value)`

Converts the first character of a string to uppercase.

**Parameters:**
- `value: string` - The string to transform

**Returns:** The string with the first character in uppercase

### `downloadFile(dataOrUrl, options)`

Download a file from URL or Blob object.

**Parameters:**
- `url: string` OR `obj: Blob | MediaSource` - The URL to download from or the Blob/MediaSource object
- `options?: DownloadFileOptions` - Optional download options

### `useDialog(onAfterClose)`

React hook for managing dialog state with optional callback after closing. Provides convenient open/close functions and tracks the dialog's open state.

**Parameters:**
- `onAfterClose?: () => void` - Optional callback function to execute after the dialog closes

**Returns:** Object containing `{ isDialogOpen: boolean, openDialog: () => void, closeDialog: () => void }`

### `useRunInTask()`

React hook for tracking async task execution with loading state. Automatically manages a loading counter and provides a wrapper function for tasks.

**Returns:** A tuple containing `[isLoading: boolean, runInTask: function]`

### `useBoundRunInTask(block)`

React hook for bound task execution with loading state. Creates a wrapped version of a function that automatically tracks loading state.

**Parameters:**
- `block: T | undefined` - The function to wrap with task tracking

**Returns:** A tuple containing `[isLoading: boolean, wrappedFunction: T]`

### `useKeyByRoute(routeMatches)`

React hook for generating keys based on current route matches.

**Parameters:**
- `routeMatches: Record<TKey, (object | null)[] | never | object | null>` - Record of route keys to match objects or arrays

**Returns:** Array of active route keys

### `useSetUnset(set)`

React hook for boolean state management helpers.

**Parameters:**
- `set: Dispatch<SetStateAction<boolean>>` - The state setter function from useState

**Returns:** A tuple containing `[setTrue: function, setFalse: function]`


## Usage Examples

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
import React, { useState } from 'react';
import { 
  useDialog, 
  useRunInTask, 
  useBoundRunInTask, 
  useSetUnset 
} from '@leancodepl/utils';

async function saveData() {
  console.log('Saving data...');
}

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
import React, { useState, useEffect } from 'react';
import { useBoundRunInTask } from '@leancodepl/utils';

interface User {
  name: string;
  email: string;
}

async function fetchUser(userId: string): Promise<User> {
  return { name: 'John Doe', email: 'john@example.com' };
}

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
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

interface User {
  name: string;
  email: string;
}

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