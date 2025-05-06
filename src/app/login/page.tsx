"use client";

import FormButton from "@/components/FormButton";
import Input from "@/components/Input";
import SocialLogin from "@/components/SocialLogin";
import { useActionState } from "react";
import { login } from "./actions";

export default function LogInPage() {
  const [state, action] = useActionState(login, null);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
