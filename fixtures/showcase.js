/** @param {string} name The visible name. */
export function greet(name = "World") {
  const user = { name, active: true };
  return user?.name ?? "Guest";
}
const run = (value) => value && greet(value) || false;
console.log(greet("Radix"), 42);
