import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export const getSession = async () => {
  return await getIronSession<SessionContent>(await cookies(), {
    cookieName: "carrot-market",
    password: process.env.COOKIE_PASSWORD!,
  });
};

export const storeUserSession = async (id: number) => {
  const session = await getSession();
  session.id = id;
  await session.save();
};
