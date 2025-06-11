import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { executeAction } from "@/lib/executeAction";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect("/course");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-medium text-center">Smart Study Hub</h1>

        <form
          action={async (formData: FormData) => {
            "use server";
            await executeAction({
              actionFn: async () => {
                await signIn("credentials", formData);
              },
            });
          }}
          className="space-y-4 rounded-lg bg-white p-6 shadow"
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email address</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              required
            />
          </div>

          <Button type="submit" variant="secondary" className="w-full">
            Sign In
          </Button>
        </form>
        <div className="flex justify-between text-sm">
          <Link href="/forgot-password">
            <Button variant="link" className="p-0">
              Forgot password?
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="link" className="p-0">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
