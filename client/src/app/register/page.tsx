import { redirect } from "next/navigation";

// Public registration is disabled — only admins can sign in.
export default function RegisterPage() {
  redirect("/login");
}
