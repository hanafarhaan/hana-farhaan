import { forwardRef, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { burst } from "../../utils/confetti";
import { reveal } from "../../utils/reveal";
import {
  loadReply,
  RsvpNotConnectedError,
  saveReply,
  submitRsvp,
  type Attendance,
  type StoredReply,
} from "../../utils/rsvpClient";
import { saveTicket } from "../../utils/ticketToPng";
import { IconAlert } from "../ui/Icons";
import SectionHeader from "../ui/SectionHeader";
import Ticket from "./Ticket";

type Errors = Partial<Record<"name" | "attendance" | "phone" | "form", string>>;

const OPTIONS: { value: Attendance; label: string }[] = [
  { value: "Yes", label: "Yes, I will be there" },
  { value: "No", label: "Sadly, I can’t come" },
  { value: "Later", label: "I’ll reply a bit later" },
];

const PHONE_RE = /^[0-9+()\-\s]{6,20}$/;
const WISH_MAX = 500;

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

function doneCopy(reply: StoredReply) {
  const first = firstName(reply.name);
  if (reply.attendance === "Yes")
    return {
      title: `Thank you, ${first}!`,
      body: "Thank you for being a part of our happiness. We can’t wait to celebrate with you!",
    };
  if (reply.attendance === "No")
    return {
      title: `We’ll miss you, ${first}`,
      body: "Thank you for letting us know. Your duas and good wishes mean the world to us.",
    };
  return {
    title: `Thank you, ${first}`,
    body: "No rush. Come back to this page whenever you know, and tap “Change my reply”.",
  };
}

type Props = { onReplied: (replied: boolean) => void };

const RSVP = forwardRef<HTMLElement, Props>(function RSVP({ onReplied }, ref) {
  const [reply, setReply] = useState<StoredReply | null>(() => loadReply());
  const [editing, setEditing] = useState(() => !loadReply());
  const [name, setName] = useState(() => reply?.name ?? "");
  const [attendance, setAttendance] = useState<Attendance | "">(() => reply?.attendance ?? "");
  const [phone, setPhone] = useState(() => reply?.phone ?? "");
  const [wish, setWish] = useState(() => reply?.wish ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<"" | "working" | "saved" | "error">("");
  const uid = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const firstRadio = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    onReplied(!!reply && !editing);
  }, [reply, editing, onReplied]);

  const validate = (): Errors => {
    const next: Errors = {};
    const n = name.trim();
    if (!n) next.name = "Please write your name so we know who replied";
    else if (n.length > 100) next.name = "Please keep your name under 100 characters";
    if (!attendance) next.attendance = "Please choose one option";
    if (phone.trim() && !PHONE_RE.test(phone.trim())) next.phone = "Please check the number: digits, spaces, + and brackets only";
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const found = validate();
    setErrors(found);
    if (found.name) return nameRef.current?.focus();
    if (found.attendance) return firstRadio.current?.focus();
    if (found.phone) return phoneRef.current?.focus();

    setSending(true);
    const payload = {
      name: name.trim(),
      attendance: attendance as Attendance,
      phone: phone.trim(),
      wish: wish.trim().slice(0, WISH_MAX),
    };
    try {
      await submitRsvp({ ...payload, type: reply ? "update" : "new" });
      const saved: StoredReply = { ...payload, at: new Date().toISOString() };
      saveReply(saved);
      setReply(saved);
      setEditing(false);
      setTicketStatus("");
      if (payload.attendance === "Yes") {
        const r = formRef.current?.getBoundingClientRect();
        burst(window.innerWidth / 2, r ? Math.min(window.innerHeight * 0.7, r.top + 120) : window.innerHeight / 2, { count: 120 });
      }
      window.setTimeout(() => doneRef.current?.focus({ preventScroll: false }), 50);
    } catch (err) {
      if (err instanceof RsvpNotConnectedError) {
        setErrors({
          form:
            "Replies aren’t open just yet. Please try again soon, or send your reply to the family directly." +
            (import.meta.env.DEV ? " (Developer note: set rsvp.endpoint in src/config/eventConfig.ts.)" : ""),
        });
      } else {
        setErrors({ form: "Something went wrong, please try again. Your answers are still here." });
      }
    } finally {
      setSending(false);
    }
  };

  const onSaveTicket = async () => {
    if (!reply) return;
    setTicketStatus("working");
    try {
      const result = await saveTicket(reply.name);
      setTicketStatus(result === "cancelled" ? "" : "saved");
    } catch {
      setTicketStatus("error");
    }
  };

  const err = (key: keyof Errors) =>
    errors[key] ? (
      <p className="field__err" id={`${uid}-${key}-err`}>
        <IconAlert size={15} />
        {errors[key]}
      </p>
    ) : null;

  const showDone = reply && !editing;
  const copy = reply ? doneCopy(reply) : null;

  return (
    <section className="sec s-cream rsvp-sec" id="rsvp" ref={ref} aria-labelledby="rsvp-title">
      <div className="sec__in">
        <SectionHeader
          title="Will you join us?"
          sub={c.rsvp.replyBy ? `Kindly reply by ${c.rsvp.replyBy}` : "Kindly reply at your earliest convenience"}
          id="rsvp-title"
        />

        {showDone && copy ? (
          <div className="rsvp-done" ref={doneRef} tabIndex={-1} aria-live="polite">
            <p className="rsvp-done__title">{copy.title}</p>
            <p className="rsvp-done__body">{copy.body}</p>
            {reply.attendance === "Yes" && reply.phone && (
              <p className="rsvp-done__note">We’ll send you a reminder a week before.</p>
            )}

            {reply.attendance === "Yes" && (
              <>
                <Ticket name={reply.name} />
                <button type="button" className="btn btn--fill btn--wide" onClick={onSaveTicket} disabled={ticketStatus === "working"}>
                  {ticketStatus === "working" ? "Preparing your ticket…" : "Save the ticket to my phone"}
                </button>
                <p className="rsvp-done__status" aria-live="polite">
                  {ticketStatus === "saved" && "Saved. Find it in your downloads or photos."}
                  {ticketStatus === "error" && "Couldn’t create the image. Try a screenshot instead."}
                </p>
              </>
            )}

            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setEditing(true);
                setErrors({});
              }}
            >
              Change my reply
            </button>
          </div>
        ) : (
          <form className="rsvp rv" ref={(el) => {
            formRef.current = el;
            return reveal(el);
          }} onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor={`${uid}-name`}>Your full name</label>
              <input
                ref={nameRef}
                id={`${uid}-name`}
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${uid}-name-err` : undefined}
              />
              {err("name")}
            </div>

            <fieldset className="field" aria-describedby={errors.attendance ? `${uid}-attendance-err` : undefined}>
              <legend>Will you come?</legend>
              <div className="choices">
                {OPTIONS.map((o, i) => (
                  <label key={o.value} className={`choice ${attendance === o.value ? "is-checked" : ""}`}>
                    <input
                      ref={i === 0 ? firstRadio : undefined}
                      type="radio"
                      name="attendance"
                      value={o.value}
                      checked={attendance === o.value}
                      onChange={() => setAttendance(o.value)}
                    />
                    <span className="choice__dot" aria-hidden="true" />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              {err("attendance")}
            </fieldset>

            <div className="field">
              <label htmlFor={`${uid}-phone`}>Phone or WhatsApp for reminders</label>
              <input
                ref={phoneRef}
                id={`${uid}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                placeholder="+91"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={`${uid}-phone-help${errors.phone ? ` ${uid}-phone-err` : ""}`}
              />
              <p className="field__help" id={`${uid}-phone-help`}>
                Optional. Only for a reminder a week before and to share photos after.
              </p>
              {err("phone")}
            </div>

            <div className="field">
              <label htmlFor={`${uid}-wish`}>A wish for the couple</label>
              <textarea
                id={`${uid}-wish`}
                name="wish"
                rows={3}
                maxLength={WISH_MAX}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                aria-describedby={`${uid}-wish-count`}
              />
              <p className="field__count" id={`${uid}-wish-count`}>
                {wish.length} / {WISH_MAX}
              </p>
            </div>

            {errors.form && (
              <p className="rsvp__formerr" role="alert">
                <IconAlert size={16} />
                {errors.form}
              </p>
            )}

            <button type="submit" className={`btn btn--fill btn--wide ${sending ? "is-busy" : ""}`} disabled={sending}>
              {sending ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Sending…
                </>
              ) : reply ? (
                "Update my reply"
              ) : (
                "Send my reply"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
});

export default RSVP;
