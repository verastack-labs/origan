// expect-error: TS2339
// expect-message: Property 'password' does not exist on type 'PublicProfile'.
// region: code
type User = { id: number; name: string; email: string; password: string };

type PublicProfile = Omit<User, "password">;

function showProfile(profile: PublicProfile): string {
  return profile.name + " " + profile.password; // @error
}
// endregion
export {};
