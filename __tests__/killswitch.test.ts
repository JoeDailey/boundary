import boundary from '../src/boundary'

test('No signature never killed', () => {
  const result = boundary(() => 5, 100, {isKillswitched: () => true});
  expect(result).toBe(5)
})

test('Killed with signature', () => {
  const signature = 'Foo';
  const result = boundary(() => 5, 100, {signature, isKillswitched: (s) => s == signature});
  expect(result).toBe(100)
})
