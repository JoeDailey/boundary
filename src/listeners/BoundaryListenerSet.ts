import { BoundarySignature } from "../boundary";
import {
  IBoundaryListener,
  IBoundarySkipListener,
  IBoundaryStartListener,
  IBoundaryThrowListener,
  IBoundaryEndListener,
} from './IBoundaryListeners';

export default class BoundaryListenerSet
  implements
  IBoundarySkipListener,
  IBoundaryStartListener,
  IBoundaryThrowListener,
  IBoundaryEndListener {

  private listeners: IBoundaryListener[];
  constructor(listeners: IBoundaryListener[]) {
    this.listeners = listeners;
  }

  onBoundarySkip(signature: BoundarySignature): void {
    for (const listener of this.listeners)
      if (this.isSkipListener(listener))
        listener.onBoundarySkip(signature)
  }

  private isSkipListener(listener: IBoundaryListener): listener is IBoundarySkipListener {
    return (listener as IBoundarySkipListener).onBoundarySkip != null;
  }

  onBoundaryStart(signature: BoundarySignature | undefined): void {
    for (const listener of this.listeners)
      if (this.isStartListener(listener))
        listener.onBoundaryStart(signature)
  }

  private isStartListener(listener: IBoundaryListener): listener is IBoundaryStartListener {
    return (listener as IBoundaryStartListener).onBoundaryStart != null;
  }

  onBoundaryThrow(signature: BoundarySignature | undefined, e: Error, will_bubble: boolean): void {
    for (const listener of this.listeners)
      if (this.isThrowListener(listener))
        listener.onBoundaryThrow(signature, e, will_bubble)
  }

  private isThrowListener(listener: IBoundaryListener): listener is IBoundaryThrowListener {
    return (listener as IBoundaryThrowListener).onBoundaryThrow != null;
  }

  onBoundaryEnd(signature: BoundarySignature | undefined): void {
    for (const listener of this.listeners)
      if (this.isEndListener(listener))
        listener.onBoundaryEnd(signature)
  }

  private isEndListener(listener: IBoundaryListener): listener is IBoundaryEndListener {
    return (listener as IBoundaryEndListener).onBoundaryEnd != null;
  }

}