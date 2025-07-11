# @leancodepl/folder-structure-cruiser

Enforces strict, generic folder structure rules for monorepos using dependency-cruiser.

## Installation

```bash
npm install --save-dev @leancodepl/folder-structure-cruiser dependency-cruiser
```

## Usage Examples

### Validate folder structure

```bash
npx dependency-cruiser --config @leancodepl/folder-structure-cruiser/src/dependency-cruiser.config.js src/
```

### Add to package.json scripts

```json
{
    "scripts": {
        "validate-deps": "npx dependency-cruiser --config @leancodepl/folder-structure-cruiser/src/dependency-cruiser.config.js src/"
    }
}
```

### Allowed imports

```typescript
// src/polls/PollEditor/index.tsx
import { ActivityWizard } from "../../wizards" // ✅ direct sibling index
import { validateName } from "./validators/validateName" // ✅ own child
import { ActivityEditor } from "../ActivityEditor" // ✅ same feature sibling
```

### Forbidden imports

```typescript
// src/surveys/SurveyEditor/index.tsx
import { ActivityWizard } from "../../wizards/ActivityWizard" // ❌ nested sibling child
import { NestedChild } from "../../wizards/ActivityWizard/nestedChild" // ❌ deeply nested sibling child
```

## Rules

This configuration enforces the following rules:

- **Allowed**: Imports from direct sibling index files (e.g., `wizards/index.tsx`)
- **Allowed**: Imports within the same feature at any depth
- **Forbidden**: Imports to nested children of sibling features (depth 2+)
