# @leancodepl/rx-pipe-client

RxJS-based topic functions for real-time data subscriptions using @leancodepl/pipe.

## Installation

```bash
npm install @leancodepl/rx-pipe-client
# or
yarn add @leancodepl/rx-pipe-client
```

## API

### `mkPipeClient(pipe)`

Creates topic functions for data subscriptions using @leancodepl/pipe.

**Parameters:**

- `pipe: Pipe` - Pipe instance from @leancodepl/pipe

**Returns:** Object containing `createTopic` method for creating typed observables

## Usage Examples

### Basic Setup

```typescript
import { mkPipeClient } from "@leancodepl/rx-pipe-client"
import { createPipe } from "@leancodepl/pipe"

const pipe = createPipe({
    url: "wss://api.example.com/pipe",
    getAccessToken: () => localStorage.getItem("token"),
})

const pipeClient = mkPipeClient({ pipe })
```

### Chat Messages

```typescript
import { mkPipeClient } from "@leancodepl/rx-pipe-client"
import { createPipe } from "@leancodepl/pipe"

interface ChatTopic {
    roomId: string
}

interface ChatNotifications {
    MessageReceived: {
        id: string
        content: string
        authorId: string
    }
}

const pipe = createPipe({
    url: "wss://api.example.com/pipe",
    getAccessToken: () => localStorage.getItem("token"),
})
const pipeClient = mkPipeClient({ pipe })
const chatTopic = pipeClient.createTopic<ChatTopic, ChatNotifications>("chat")

chatTopic({ roomId: "room1" }).subscribe(notification => {
    if (notification.type === "MessageReceived") {
        console.log(`New message: ${notification.data.content}`)
    }
})
```

### Live Metrics with RxJS Operators

```typescript
import { filter, map } from "rxjs/operators"
import { mkPipeClient } from "@leancodepl/rx-pipe-client"
import { createPipe } from "@leancodepl/pipe"

interface MetricsTopic {
    dashboardId: string
}

interface MetricsNotifications {
    CpuUpdate: { value: number }
    MemoryUpdate: { value: number }
}

const pipe = createPipe({
    url: "wss://api.example.com/pipe",
    getAccessToken: () => localStorage.getItem("token"),
})
const pipeClient = mkPipeClient({ pipe })
const metricsTopic = pipeClient.createTopic<MetricsTopic, MetricsNotifications>("metrics")

const cpuUpdates$ = metricsTopic({ dashboardId: "main" }).pipe(
    filter(notification => notification.type === "CpuUpdate"),
    map(notification => notification.data.value),
)

cpuUpdates$.subscribe(value => {
    console.log(`CPU: ${value}%`)
})
```
