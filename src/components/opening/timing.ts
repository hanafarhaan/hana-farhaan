import { eventConfig } from "../../config/eventConfig";

/** Seconds into the film when the curtains have cleared and the stage text may begin. */
export const TEXT_AT_SECONDS = 5.5;

/** Stage text: delay between lines, and each line's fade duration. */
export const STAGE_STAGGER_MS = 260;
export const STAGE_LINE_MS = 1100;
export const STAGE_FAST_STAGGER_MS = 70;
export const STAGE_FAST_LINE_MS = 550;

/** Arabic, transliteration, meaning, ornament, names, invitation lines…, date, city. */
export const STAGE_LINE_COUNT = 7 + eventConfig.stage.invitation.length;

export const stageDuration = (fast: boolean) =>
  fast
    ? STAGE_FAST_STAGGER_MS * (STAGE_LINE_COUNT - 1) + STAGE_FAST_LINE_MS
    : STAGE_STAGGER_MS * (STAGE_LINE_COUNT - 1) + STAGE_LINE_MS;
