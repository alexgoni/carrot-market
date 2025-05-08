import { redirect } from "next/navigation";

const BASE_URL = "https://github.com/login/oauth/authorize";

export function GET() {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}?${queryString}`;

  return redirect(url);
}
