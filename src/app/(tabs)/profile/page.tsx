import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const getUser = async () => {
  const session = await getSession();

  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
};

export default async function ProfilePage() {
  const user = await getUser();

  const logOut = async () => {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  };

  return (
    <>
      <h1>Welcome! {user?.username}!</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </>
  );
}
