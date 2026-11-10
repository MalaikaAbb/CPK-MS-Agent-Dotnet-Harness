// HARNESS-AUTHORED. The Slots Code-tab page imports makeSlotOverride from
// "../_shared/slot-override", which no doc page publishes. The page's own comment
// says it exists so that "the cast is centralized in one named helper". The
// minimal version is exactly that cast.
export function makeSlotOverride<TDefault>(component: unknown): TDefault {
  return component as TDefault;
}
