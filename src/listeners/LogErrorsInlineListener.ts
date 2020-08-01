import { BoundarySignature } from "../boundary";
import { IBoundaryThrowListener } from './IBoundaryListeners';

type logFn = (s: BoundarySignature | undefined, e: Error, will_bubble: boolean) => void;
export default class LogErrorsDefaultListener implements IBoundaryThrowListener {
  private log: logFn;
  constructor(log: logFn) {
    this.log = log;
  }

  onBoundaryThrow(signature: BoundarySignature | undefined, e: Error, will_bubble: boolean): void {
    this.log(signature, e, will_bubble);
  }

}