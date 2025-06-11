"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export default function SignInButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <Link href="/sign-in">
      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          toggleSidebar();
        }}
      >
        Sign In
      </Button>
    </Link>
  );
}
