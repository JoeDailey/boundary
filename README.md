# `boundary` is a lightweight utility for handling error declaratively

```
import boundary from 'boundary';

const result = boundary(doRiskyCall(), default_value);
```

Boundary will invoke your given function and return the result. If an error was thrown, it will return the default value. 

## Configurations
The third argument of `boundary` is for optional configurations.
- `signature` is a name for your boundary. It is required for killswitching and helpful for logging. 
- `isKillswitched(signature)` decides when to disable a boundary. This is useful for fixing bad code without requiring a production push. 
- `listeners[]` is a set of custom listeners to observer boundary behaviors.
- `shouldRethrow(signature, e)` is not often useful, but can conditionally decide to bubble a thrown exception.
- `logExceptions(signature, e, will_bubble)` is a convenient away to do *additional* logging.

## Make it your Own
You could use boundary as-is, but in most cases you'll want to create a boundary with default behaviours. You can do this with `build`. This will also make signatures required.
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


const result = myboundary('FooRiskyCall', doRiskyCall(), default_value);
```

## Future
In the future decorators will be added to streamline usage.
```
@boundary('FooRiskyCall', default_value)
doRiskyCall()
```
