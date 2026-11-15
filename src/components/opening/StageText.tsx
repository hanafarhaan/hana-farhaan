import type { CSSProperties, ReactNode } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { dateLong, time12, weekday } from "../../utils/dates";
import { Ornament } from "../ui/SectionHeader";
import { STAGE_FAST_LINE_MS, STAGE_FAST_STAGGER_MS, STAGE_LINE_MS, STAGE_STAGGER_MS } from "./timing";

function Line({ i, className, children, as: Tag = "p", lang }: { i: number; className: string; children: ReactNode; as?: "p" | "h1" | "div"; lang?: string }) {
  return (
    <Tag className={`st__line ${className}`} style={{ "--i": i } as CSSProperties} lang={lang}>
      {children}
    </Tag>
  );
}

export default function StageText({ visible, fast }: { visible: boolean; fast: boolean }) {
  const inv = c.stage.invitation;
  const n = 5 + inv.length; // index after the invitation lines
  const timing = {
    "--st-stagger": `${fast ? STAGE_FAST_STAGGER_MS : STAGE_STAGGER_MS}ms`,
    "--st-dur": `${fast ? STAGE_FAST_LINE_MS : STAGE_LINE_MS}ms`,
  } as CSSProperties;
  return (
    <div className={`st ${visible ? "is-on" : ""}`} style={timing} aria-hidden={!visible}>
      <div className="st__scrim" aria-hidden="true" />
      <Line i={0} className="st__arabic" lang="ar">
        {c.stage.arabic}
      </Line>
      <Line i={1} className="st__translit">
        {c.stage.transliteration}
      </Line>
      <Line i={2} className="st__meaning">
        {c.stage.meaning}
      </Line>
      <Line i={3} className="st__orn" as="div">
        <Ornament />
      </Line>
      <Line i={4} className="st__names" as="h1">
        <span className="st__name">{c.bride}</span>
        <span className="st__amp">&amp;</span>
        <span className="st__name">{c.groom}</span>
      </Line>
      {inv.map((line, k) => (
        <Line key={line} i={5 + k} className="st__inv">
          {line}
        </Line>
      ))}
      <Line i={n} className="st__date">
        {weekday} · {dateLong} · {time12(c.startTime, { upper: true })}
      </Line>
      <Line i={n + 1} className="st__city">
        {c.venue.city}
      </Line>
    </div>
  );
}
