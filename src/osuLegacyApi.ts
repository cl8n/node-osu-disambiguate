import { get } from 'https';

export interface OsuLegacyApiUser {
  country: string;
  id: number;
  joinDate: string;
  name: string;
}

export function getUserByName(
  name: string,
  apiKey: string,
): Promise<OsuLegacyApiUser | null> {
  const url = `https://osu.ppy.sh/api/get_user?k=${apiKey}&type=string&u=${name}`;

  return new Promise((resolve, reject) => {
    const request = get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => {
        const result = JSON.parse(data) as [] | [Record<string, string>];

        if (result.length === 0) {
          return resolve(null);
        }

        resolve({
          country: result[0].country,
          id: parseInt(result[0].user_id, 10),
          joinDate: result[0].join_date,
          name: result[0].username,
        });
      });
    });

    request.on('error', (error) => reject(error.message));
  });
}
