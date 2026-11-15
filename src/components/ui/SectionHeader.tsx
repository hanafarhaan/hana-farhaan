import { reveal } from "../../utils/reveal";

/** Thin gold rule with a diamond, as used above every section title. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={`orn ${className}`} viewBox="0 0 132 12" aria-hidden="true" focusable="false">
      <path d="M0 6h56M76 6h56" stroke="currentColor" strokeWidth="1" />
      <path d="M66 1.6 70.4 6 66 10.4 61.6 6Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="66" cy="6" r="1.1" fill="currentColor" />
    </svg>
  );
}

type Props = { title: string; sub?: string; id?: string };

export default function SectionHeader({ title, sub, id }: Props) {
  return (
    <header className="sh rv" ref={reveal}>
      <Ornament />
      <h2 className="sh__t" id={id}>
        {title}
      </h2>
      {sub && <p className="sh__sub">{sub}</p>}
    </header>
  );
}
