import boundary from '../src/boundary'

test('Non throwing function', () => {
  const result = boundary(() => 5, 100);
  expect(result).toBe(5)
})

test('Throwing function', () => {
  const result = boundary(() => {throw "You fool!"}, 100);
  expect(result).toBe(100)
})

