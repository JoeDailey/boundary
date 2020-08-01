import { BoundarySignature } from "../boundary";

export type IBoundaryListener =
  IBoundarySkipListener |
  IBoundaryStartListener |
  IBoundaryThrowListener |
  IBoundaryEndListener;

export interface IBoundarySkipListener {
  onBoundarySkip(signature: BoundarySignature): void;
}

export interface IBoundaryStartListener {
  onBoundaryStart(signature: BoundarySignature | undefined): void;
}

export interface IBoundaryThrowListener {
  onBoundaryThrow(signature: BoundarySignature | undefined, e: Error, will_bubble: boolean): void;
}

export interface IBoundaryEndListener {
  onBoundaryEnd(signature: BoundarySignature | undefined): void;
}
