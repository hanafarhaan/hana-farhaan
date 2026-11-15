
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EntranceScreen from "./components/EntranceScreen";
import {
  CalendarDays,
  MapPin,
  Clock,
  Heart,
  ArrowDown,
  Send,
  Music2,
  VolumeX,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { eventConfig as event } from "./config/eventConfig";
import "./index.css";

function App() {
  const [entered, setEntered] = useState(false);
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    attendance: "",
    guests: "1",
    message: "",
  });

  useEffect(() => {
    const updateCountdown = () => {
      // Countdown uses midnight on the engagement date in IST.
      const target = new Date(
        `${event.date}T00:00:00+05:30`
      ).getTime();

      const difference = Math.max(0, target - Date.now());

      setRemaining({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const enterInvitation = () => {
    window.scrollTo(0, 0);
    setEntered(true);
  };

  const handleRSVP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temporary local demonstration.
    // We will connect this to Google Sheets before launch.
    setSubmitted(true);
  };

  const scrollToRSVP = () => {
    document.getElementById("rsvp")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main>
      <AnimatePresence>
        {!entered && <EntranceScreen key="entrance" onEnter={enterInvitation} />}
      </AnimatePresence>

      <div className="website">

        <nav className="navbar">
          <a href="#home" className="brand">
            H <span>&</span> F
          </a>

          <div className="nav-links">
            <a href="#details">THE CELEBRATION</a>
            <a href="#countdown">COUNTDOWN</a>
            <a href="#rsvp">RSVP</a>
          </div>

          <button
            className="music-button"
            onClick={() => setMusicEnabled(!musicEnabled)}
            aria-label="Toggle music"
            title="Music control placeholder"
          >
            {musicEnabled ? <Music2 /> : <VolumeX />}
          </button>
        </nav>

        {/* HERO */}

        <section id="home" className="hero section">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="eyebrow">
              TOGETHER WITH THEIR FAMILIES
            </span>

            <p className="hero-intro">
              Request the pleasure of your company
              as they celebrate their engagement
            </p>

            <h1 className="couple-names">
              {event.bride}
              <span className="ampersand">&</span>
              {event.groom}
            </h1>

            <div className="ornament-divider">
              <span>✦</span>
            </div>

            <p className="hero-caption">
              Two hearts. One beautiful beginning.
            </p>

            <p className="hero-date">
              {event.day.toUpperCase()} · {event.dateDisplay.toUpperCase()}
            </p>

            <button
              className="text-button"
              onClick={scrollToRSVP}
            >
              KINDLY RSVP <ArrowDown size={14} />
            </button>
          </motion.div>
        </section>

        {/* INVITATION MESSAGE */}

        <section className="invitation-section section">
          <span className="eyebrow">A SPECIAL CELEBRATION</span>

          <h2>A New Chapter Begins</h2>

          <p className="section-copy">
            With the blessings of Allah and the love of our
            families, we joyfully invite you to join us as
            Hana and Farhaan begin a beautiful new chapter
            in their lives.
          </p>

          <Heart className="gold-icon" />
        </section>

        {/* EVENT DETAILS */}

        <section id="details" className="details-section section">
          <span className="eyebrow">SAVE THE DATE</span>

          <h2>The Celebration</h2>

          <div className="detail-grid">

            <div className="detail-item">
              <CalendarDays />
              <span className="detail-label">THE DATE</span>
              <h3>{event.dateDisplay}</h3>
              <p>{event.day}</p>
            </div>

            <div className="detail-item">
              <Clock />
              <span className="detail-label">THE TIME</span>
              <h3>{event.time}</h3>
              <p>Indian Standard Time</p>
            </div>

            <div className="detail-item">
              <MapPin />
              <span className="detail-label">THE VENUE</span>
              <h3>{event.venue}</h3>
              <p>{event.city}</p>
              {event.mapsUrl && (
                <a
                  className="map-link"
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GET DIRECTIONS
                </a>
              )}
            </div>

          </div>
        </section>

        {/* COUNTDOWN */}

        <section id="countdown" className="countdown-section section">
          <span className="eyebrow">UNTIL WE CELEBRATE</span>

          <h2>Counting Every Moment</h2>

          <p className="section-copy">
            The days are getting closer to a beautiful celebration.
          </p>

          <div className="countdown-grid">
            {Object.entries(remaining).map(([label, value]) => (
              <div className="countdown-item" key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}

        <section className="gallery-section section">
          <span className="eyebrow">A MOMENT TO REMEMBER</span>

          <h2>Our Story</h2>

          <p className="section-copy">
            A collection of beautiful moments.
          </p>

          <div className="gallery-placeholder">
            <Sparkles size={32} />
            <p>Hana & Farhaan's photographs</p>
            <span>PHOTO GALLERY COMING SOON</span>
          </div>
        </section>

        {/* RSVP */}

        <section id="rsvp" className="rsvp-section section">
          <span className="eyebrow">YOUR PRESENCE IS OUR GIFT</span>

          <h2>Kindly RSVP</h2>

          <p className="section-copy">
            It would mean so much to have you with us.
            Please let us know if you will be joining the celebration.
          </p>

          {submitted ? (
            <div className="success-message">
              <CheckCircle2 size={38} />
              <h3>Thank You!</h3>
              <p>
                Your demonstration response has been received
                on this device. The live RSVP connection
                will be added before launch.
              </p>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={handleRSVP}>

              <label htmlFor="guest-name">YOUR NAME</label>

              <input
                id="guest-name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                required
              />

              <label htmlFor="attendance">
                WILL YOU BE JOINING US?
              </label>

              <select
                id="attendance"
                value={form.attendance}
                onChange={(e) =>
                  setForm({ ...form, attendance: e.target.value })
                }
                required
              >
                <option value="">Select your response</option>
                <option value="Yes">Joyfully accepts</option>
                <option value="No">Regretfully declines</option>
              </select>

              <label htmlFor="guest-count">NUMBER OF GUESTS</label>

              <select
                id="guest-count"
                value={form.guests}
                onChange={(e) =>
                  setForm({ ...form, guests: e.target.value })
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option value={n} key={n}>{n}</option>
                ))}
              </select>

              <label htmlFor="message">
                A LITTLE MESSAGE (OPTIONAL)
              </label>

              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                placeholder="Send your wishes..."
              />

              <button className="gold-submit" type="submit">
                SEND RESPONSE <Send size={15} />
              </button>

            </form>
          )}

          <p className="closing-note">
            With love, duas and gratitude.
          </p>
        </section>

        {/* FOOTER */}

        <footer className="footer">
          <div className="footer-ornament">✦</div>

          <h2>Hana <span>&</span> Farhaan</h2>

          <p>{event.dateDisplay}</p>

          <p className="footer-message">
            May Allah bless this beautiful journey.
          </p>

          <div className="footer-arabic">
            الْحَمْدُ لِلَّهِ
          </div>
        </footer>

      </div>
    </main>
  );
}

export default App;
