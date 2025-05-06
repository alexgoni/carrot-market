/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/,
);

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4)
    .regex(
      passwordRegex,
      "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-",
    ),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};
