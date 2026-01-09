# @leancodepl/hook-pipe-client

React hooks for real-time data subscriptions using @leancodepl/pipe.

## Installation

```bash
npm install @leancodepl/hook-pipe-client
# or
yarn add @leancodepl/hook-pipe-client
```

## API

### `mkPipeClient(pipe)`

Creates React hooks for real-time data subscriptions using @leancodepl/pipe.

**Parameters:**

- `pipe: Pipe` - Pipe instance from @leancodepl/pipe

**Returns:** Object containing `createTopic` method for creating typed hooks

### `UseSubscriptionOptions<TNotifications>`

Options for topic subscription hooks.

**Properties:**

- `[NotificationType]?: (data: NotificationData) => void` - Type-specific handlers for each notification type
- `onData?: (data: NotificationsUnion<TNotifications>) => void` - Callback for all notifications

## Usage Examples

### Basic Setup

```typescript
import { mkPipeClient } from "@leancodepl/hook-pipe-client"
import { createPipe } from "@leancodepl/pipe"

const pipe = createPipe({
  url: "wss://api.example.com/pipe",
  getAccessToken: () => localStorage.getItem("token"),
})

const pipeClient = mkPipeClient({ pipe })
```

### Chat Messages

```typescript
import React, { useState } from 'react';

interface ChatTopic {
  roomId: string;
}

interface ChatNotifications {
  MessageReceived: {
    id: string;
    content: string;
    authorId: string;
  };
}

const useChatTopic = pipeClient.createTopic<ChatTopic, ChatNotifications>('chat');

function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<string[]>([]);

  const { data } = useChatTopic(
    { roomId },
    {
      MessageReceived: (data) => {
        setMessages(prev => [...prev, data.content]);
      },
      // or
      onData: (notification) => {
        if (notification.type === 'MessageReceived') {
          setMessages(prev => [...prev, notification.data.content]);
        }
      },
    }
  );

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}
```

### Live Metrics

```typescript
import React, { useState } from 'react';

interface MetricsTopic {
  dashboardId: string;
}

interface MetricsNotifications {
  CpuUpdate: { value: number };
  MemoryUpdate: { value: number };
}

const useMetricsTopic = pipeClient.createTopic<MetricsTopic, MetricsNotifications>('metrics');

function Dashboard() {
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);

  useMetricsTopic(
    { dashboardId: 'main' },
    {
      CpuUpdate: (data) => {
        setCpu(data.value);
      },
      MemoryUpdate: (data) => {
        setMemory(data.value);
      }
      // or
      onData: (notification) => {
        if (notification.type === 'CpuUpdate') {
          setCpu(notification.data.value);
        } else if (notification.type === 'MemoryUpdate') {
          setMemory(notification.data.value);
        }
      },
    }
  );

  return (
    <div>
      <div>CPU: {cpu}%</div>
      <div>Memory: {memory}%</div>
    </div>
  );
}
```
