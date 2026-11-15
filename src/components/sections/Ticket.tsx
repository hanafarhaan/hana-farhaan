import { eventConfig as c } from "../../config/eventConfig";
import { dateDots, time12 } from "../../utils/dates";
import { ticketSerial } from "../../utils/ticketToPng";
import SealArt from "../art/SealArt";

/** Admit-one ticket shown after a guest says yes. */
export default function Ticket({ name }: { name: string }) {
  return (
    <div className="ticket" role="img" aria-label={`Ticket for ${name}: ${c.bride} and ${c.groom}'s engagement, ${dateDots}, ${time12(c.startTime)}, ${c.venue.name}`}>
      <div className="ticket__main" aria-hidden="true">
        <span className="ticket__admit">Admit one</span>
        <p className="ticket__guest">{name}</p>
        <p className="ticket__event">
          {c.bride} &amp; {c.groom}’s Engagement
        </p>
        <dl className="ticket__grid">
          <div>
            <dt>Date</dt>
            <dd>{dateDots}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{time12(c.startTime, { compact: true })}</dd>
          </div>
          <div className="wide">
            <dt>Place</dt>
            <dd>{c.venue.name}</dd>
          </div>
          <div className="wide">
            <dt>Dress code</dt>
            <dd>{c.dressCode.ticketLabel}</dd>
          </div>
        </dl>
      </div>
      <div className="ticket__perf" aria-hidden="true" />
      <div className="ticket__stub" aria-hidden="true">
        <SealArt className="ticket__seal" />
        <span className="ticket__names">
          {c.bride} <i>&amp;</i> {c.groom}
        </span>
        <span className="ticket__no">No. {ticketSerial(name)}</span>
      </div>
    </div>
  );
}
