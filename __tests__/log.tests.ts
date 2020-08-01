import boundary from '../src/boundary'

test('Exception logged', () => {
  const counter = {hits: 0};
  const result = boundary(() => {throw 'You fool!'}, 100, {logExceptions: () => counter.hits++});
  expect(counter.hits).toBe(1)
})
