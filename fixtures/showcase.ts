import type { User } from "./models";

/** Resolve a display name while preserving optional values. */
export async function displayName(user: User | null, fallback = "Guest"): Promise<string> {
  const active = user?.active ?? true;
  const count: number = 42;
  const valid = active && count > 0 || false;
  return valid ? `${user?.name ?? fallback}: ${count + 1}` : "Offline";
}

interface Repository<T> { find(id: string): Promise<T | undefined>; }
class UserService implements Repository<User> {
  readonly limit = 10;
  async find(id: string) { return fetch(`/users/${id}`); }
}
const greet = (name: string) => displayName({ name, active: true });
enum Status { Ready = 1, Waiting = 2 }
