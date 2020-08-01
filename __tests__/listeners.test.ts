import boundary, { BoundarySignature } from '../src/boundary'
import {
  IBoundaryEndListener,
  IBoundarySkipListener,
  IBoundaryStartListener,
  IBoundaryThrowListener
} from '../src/listeners/IBoundaryListeners';

class ExampleBoundarySkipListener implements IBoundarySkipListener {
  hits: number = 0;
  onBoundarySkip(signature: BoundarySignature): void {
    this.hits += 1;
  }
}

class ExampleBoundaryStartListener implements IBoundaryStartListener {
  hits: number = 0;
  onBoundaryStart(signature: BoundarySignature | undefined): void {
    this.hits += 1;
  }
}

class ExampleBoundaryThrowListener implements IBoundaryThrowListener {
  hits: number = 0;
  rethrows: number = 0;
  onBoundaryThrow(signature: BoundarySignature | undefined, e: Error, will_bubble: boolean): void {
    this.hits += 1;
    this.rethrows += will_bubble ? 1 : 0;
  }
}

class ExampleBoundaryEndListener implements IBoundaryEndListener {
  hits: number = 0;
  onBoundaryEnd(signature: BoundarySignature | undefined): void {
    this.hits += 1;
  }
}

test('Test IBoundarySkipListener hits', () => {
  const listener = new ExampleBoundarySkipListener();
  boundary(() => 5, 100, {signature: 'Foo', listeners: [listener], isKillswitched: () => true})
  expect(listener.hits).toBe(1);
});
test('Test IBoundaryStartListener hits', () => {
  const listener = new ExampleBoundaryStartListener();
  boundary(() => 5, 100, {signature: 'Foo', listeners: [listener]})
  expect(listener.hits).toBe(1);
});
test('Test IBoundaryThrowListener hits', () => {
  const listener = new ExampleBoundaryThrowListener();
  boundary(() => {throw 'You fool!'}, 100, {signature: 'Foo', listeners: [listener]})
  expect(listener.hits).toBe(1);
  expect(listener.rethrows).toBe(0);
});
test('Test IBoundaryThrowListener hits (rethrow)', () => {
  const listener = new ExampleBoundaryThrowListener();
  try {
    boundary(() => {throw 'You fool!'}, 100, {signature: 'Foo', listeners: [listener], shouldRethrow: () => true})
  }catch (e) {
    expect(listener.hits).toBe(1);
    expect(listener.rethrows).toBe(1);
    return;
  }
  throw 'Exception not thrown';
});
test('Test IBoundaryEndListener hits', () => {
  const listener = new ExampleBoundaryEndListener();
  boundary(() => 5, 100, {signature: 'Foo', listeners: [listener]})
  expect(listener.hits).toBe(1);
});
