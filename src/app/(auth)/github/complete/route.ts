import db from "@/lib/db";
import { storeUserSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_PROFILE_URL = "https://api.github.com/user";

const getAccessTokenOfGithub = async (code: string) => {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `${ACCESS_TOKEN_URL}?${queryString}`;

  const accessTokenResponse = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  return accessTokenResponse.json();
};

const getUserInfoOfGithub = async (accessToken: string) => {
  const userProfileResponse = await fetch(USER_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });

  return userProfileResponse.json();
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }

  const { error, access_token } = await getAccessTokenOfGithub(code);
  if (!!error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login, email } =
    await getUserInfoOfGithub(access_token);
  const user = await db.user.findUnique({
    where: {
      github_id: String(id),
    },
    select: {
      id: true,
    },
  });

  // user가 존재하는 경우
  if (!!user) {
    await storeUserSession(user.id);
    return redirect("/profile");
  }

  // user가 존재하지 않는 경우 => create user
  try {
    const newUser = await db.user.create({
      data: {
        username: `Github-${login}`,
        github_id: String(id),
        avatar: avatar_url,
        email,
      },
      select: {
        id: true,
      },
    });

    await storeUserSession(newUser.id);
  } catch (error) {
    return new Response(JSON.stringify({ error: "The username is taken" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return redirect("/profile");
}
