import {IBoundaryListener} from './listeners/IBoundaryListeners';
import BoundaryListenerSet from './listeners/BoundaryListenerSet';
import LogErrorsInlineListener from './listeners/LogErrorsInlineListener';

export type BoundarySignature = string;
export type BoundaryConfig<T> = {
  signature?: BoundarySignature,
  isKillswitched?: (signature: BoundarySignature) => boolean,
  listeners?: IBoundaryListener[],
  shouldRethrow?: (signature: BoundarySignature | undefined, e: Error) => boolean,
  logExceptions?: (signature: BoundarySignature | undefined, e: Error, will_bubble: boolean) => void,
}

export default function boundary<T>(
  fn: () => T,
  fallback: T,
  config: BoundaryConfig<T> = {}
): T {
  const listeners = getListeners(config);
  if (config.signature != null && isKillswitched(config)) {
    listeners?.onBoundarySkip(config.signature);
    return fallback;
  }

  try {
    listeners?.onBoundaryStart(config.signature);
    return fn();
  } catch (e) {
    const will_bubble = (config.shouldRethrow != null && config.shouldRethrow(config.signature, e));
    listeners?.onBoundaryThrow(config.signature, e, will_bubble);
    if (will_bubble)
      throw e;
    return fallback;
  } finally {
    listeners?.onBoundaryEnd(config.signature);
  }
}

function getListeners(config: BoundaryConfig<any>): BoundaryListenerSet | null {
  if (config.listeners == null && config.logExceptions == null)
    return null;

  let listeners: IBoundaryListener[] = []; 
  if (config.listeners != null)
    listeners = [...config.listeners];

  if (config.logExceptions != null)
    listeners = [new LogErrorsInlineListener(config.logExceptions), ...listeners];

  return new BoundaryListenerSet(listeners);
}

function isKillswitched(config: BoundaryConfig<any>): boolean {
  if (config.signature == null)
    return false;

  if (config.isKillswitched == null)
    return false;

  return config.isKillswitched(config.signature);
}

export function build(shared_config: {
  isKillswitched: (signature: BoundarySignature) => boolean,
  listeners: IBoundaryListener[],
  shouldRethrow: (signature: BoundarySignature, e: Error) => boolean,
  logExceptions: (signature: BoundarySignature, e: Error, will_bubble: boolean) => void,
}) {
  const config = {
    ...shared_config,
    shouldRethrow: (signature: BoundarySignature | undefined, e: Error) => shared_config.shouldRethrow(signature!, e),
    logExceptions: (signature: BoundarySignature | undefined, e: Error, will_bubble: boolean) => shared_config.logExceptions(signature!, e, will_bubble)
  };
  return function <T>(
    signature: BoundarySignature,
    fn: () => T,
    fallback: T,
  ): T {
    return boundary(fn, fallback, { signature, ...config });
  }
}