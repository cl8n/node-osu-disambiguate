import { getUserByName, OsuLegacyApiUser } from './osuLegacyApi';

export { OsuLegacyApiUser };

export default async function disambiguateUsername(
  name: string,
  apiKey: string,
): Promise<
  | { likely: true; user: OsuLegacyApiUser }
  | { likely: false; user: OsuLegacyApiUser | OsuLegacyApiUser[] | null }
> {
  const user = await getUserByName(name, apiKey);

  if (user?.name !== name) {
    return {
      likely: false,
      user,
    };
  }

  const oldUser = await getUserByName(`${name}_old`, apiKey);

  if (oldUser != null) {
    return {
      likely: false,
      user: [oldUser, user],
    };
  }

  return {
    likely: true,
    user,
  };
}
