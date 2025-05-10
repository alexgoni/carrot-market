"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { storeUserSession } from "@/lib/session";

const getToken = async (): Promise<string> => {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  if (exists) {
    return getToken();
  } else {
    return token;
  }
};

const checkTokenExists = async (token: number) => {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: String(token),
    },
    select: {
      id: true,
    },
  });
  console.log({ exists });
  return !!exists;
};

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"));
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(checkTokenExists, "This token does not exist.");

interface ActionState {
  token: boolean;
}

export const smsLogin = async (prevState: ActionState, formData: FormData) => {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // delete token
      await db.sMSToken.deleteMany({ where: { user: { phone: result.data } } });

      // create token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: { phone: result.data },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // send the token using twilio

      return {
        token: true,
      };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: String(result.data),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      await storeUserSession(token!.userId);
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }
};
