/** Fixed bottom bar linking to the RSVP form. Hidden during the opening, near the form, and after replying. */
export default function StickyRsvpBar({ visible }: { visible: boolean }) {
  return (
    <div className={`dock ${visible ? "is-on" : ""}`} aria-hidden={!visible}>
      <a className="btn btn--fill btn--dock" href="#rsvp" tabIndex={visible ? 0 : -1}>
        Reply to the invitation
      </a>
    </div>
  );
}
