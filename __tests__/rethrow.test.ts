import boundary from '../src/boundary'

test('Rethrow disabled', () => {
  const result = boundary(() => 5, 100, {shouldRethrow: () => false});
  expect(result).toBe(5)
})

test('Rethrow enabled', () => {
  const signature = 'Foo';
  expect(() => boundary(
    () => {throw 'You Fool!'},
    null,
    {signature, shouldRethrow: (s, e) => s === signature}
  )).toThrow();
})
