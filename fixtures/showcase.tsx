import type { MouseEvent } from "react";
interface CardProps { title: string; onSelect?: (id: number) => void; }


export function UserCard({ title, onSelect }: CardProps) {
  const handleClick = (_event: MouseEvent) => onSelect?.(42);
  return <article className="card" data-active={true}>
    <h2>{title ?? "Guest"}</h2>
    <button onClick={handleClick}>Select user</button>
  </article>;
}
