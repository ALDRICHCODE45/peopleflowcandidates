"use server";

import { signOut } from "@/core/lib/auth";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  await signOut();
  redirect("/sign-in");
}
