import { build } from '../src/boundary';

const counter = {hits: 0};
const boundary = build({
  isKillswitched: (s) => s === 'kill-me',
  shouldRethrow: (s) => s === 'throw-me',
  logExceptions: (s) => {if (s === 'count-me') counter.hits++},
  listeners: [],
});

test('(Build) Non throwing function', () => {
  const result = boundary('Foo', () => 5, 100);
  expect(result).toBe(5)
})

test('(Build) Throwing function', () => {
  const result = boundary('Foo', () => {throw "You fool!"}, 100);
  expect(result).toBe(100)
})

test('(Build) Killed with signature', () => {
  const result = boundary('kill-me', () => 5, 100);
  expect(result).toBe(100)
})

test('(Build) Rethrow enabled', () => {
  expect(() => boundary('throw-me', () => {throw 'You Fool!'}, null)).toThrow();
})

test('(Build) Exception logged', () => {
  boundary('count-me', () => {throw 'You fool!'}, 100);
  expect(counter.hits).toBe(1)
})


