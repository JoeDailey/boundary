# `boundary` is Lightweight Declarative Error Handling

```
import boundary from 'boundary';

const result = boundary(() => doRiskyCall(), default_value);
```

`boundary` will invoke your given function and return the result. If an error was thrown, it will return the default value. 

## Configurations
The third argument of `boundary` is for optional configurations.
- `signature` is a name for your boundary. It is required for killswitching and helpful for logging. 
- `isKillswitched(signature)` decides when to disable a boundary. This is useful for fixing bad code without requiring a production push. 
- `listeners[]` is a set of custom listeners to observe boundary behaviors.
- `shouldRethrow(signature, e)` is not often useful, but can conditionally decide to bubble a thrown exception.
- `logExceptions(signature, e, will_bubble)` is a convenient away to do *additional* logging.

## Make it your Own
You could use boundary as-is, but in most cases you'll want to create and reuse a boundary with custom behaviours.
```
import { build } from 'boundary';

const myboundary = build({
  isKillswitched: (s, e) => ...,
  shouldRethrow: (s, e) => s === ...,
  logExceptions: (s, e, will_bubble) => ...,
  listeners: [
    // new FooBoundaryListener...
  ],
});

// Boundary signatures are required in custom boundaries
const result = myboundary('FooRiskyCall', () => doRiskyCall(), default_value);
```

## Listeners
If you want to capture more than just exception events, then create a listener. 
https://github.com/JoeDailey/boundary/blob/master/__tests__/listeners.test.ts

## Future
Future release intend to come with preprocessing to improve the syntax.
```
@boundary('FooRiskyCall', default_value)
doRiskyCall()
```
