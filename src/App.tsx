import { useCallback, useRef, useState } from "react";
import OpeningFilm, { type OpeningHandle } from "./components/opening/OpeningFilm";
import Closing from "./components/sections/Closing";
import DressCode from "./components/sections/DressCode";
import Letter from "./components/sections/Letter";
import MarkTheDay from "./components/sections/MarkTheDay";
import RSVP from "./components/sections/RSVP";
import ScratchDate from "./components/sections/ScratchDate";
import SeeYouThere from "./components/sections/SeeYouThere";
import Timeline from "./components/sections/Timeline";
import Venue from "./components/sections/Venue";
import Confetti from "./components/ui/Confetti";
import MusicToggle from "./components/ui/MusicToggle";
import NoiseOverlay from "./components/ui/NoiseOverlay";
import { useScrollLock } from "./hooks/useScrollLock";

export default function App() {
  const [started, setStarted] = useState(false);
  const [openingDone, setOpeningDone] = useState(false);
  const opening = useRef<OpeningHandle>(null);

  useScrollLock(!openingDone);

  const handleStart = useCallback(() => {
    setStarted(true);
    setOpeningDone(false);
  }, []);
  const handleDone = useCallback(() => setOpeningDone(true), []);
  const replay = useCallback(() => opening.current?.replay(), []);

  return (
    <>
      <main className="page">
        <OpeningFilm ref={opening} onStart={handleStart} onDone={handleDone} />
        <Letter />
        <ScratchDate />
        <MarkTheDay />
        <Timeline />
        <Venue />
        <DressCode />
        <RSVP />
        <SeeYouThere />
        <Closing onReplay={replay} />
      </main>

      <MusicToggle visible={started} />
      <Confetti />
      <NoiseOverlay />
    </>
  );
}
