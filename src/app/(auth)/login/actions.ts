/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { storeUserSession } from "@/lib/session";
import { redirect } from "next/navigation";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/,
);

const formSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(4)
      .regex(
        passwordRegex,
        "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-",
      ),
  })
  .superRefine(async ({ email, password }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      ctx.addIssue({
        code: "custom",
        message: "An account with this email does not exists.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }

    const ok = await bcrypt.compare(password, user!.password ?? "");
    if (!ok) {
      ctx.addIssue({
        code: "custom",
        message: "Wrong password.",
        path: ["password"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export const loginAction = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    await storeUserSession(user!.id);
    redirect("/profile");
  }
};
