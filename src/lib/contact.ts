/**
 * Loose check for a field that takes either an email or a phone number: an
 * "@", or ten or more digits. It only catches an obvious slip, such as a name
 * typed into the wrong box. It does not try to prove the address is real.
 */
export function isContact(value: string): boolean {
  if (value.includes("@")) return true;
  return (value.match(/\d/g)?.length ?? 0) >= 10;
}
