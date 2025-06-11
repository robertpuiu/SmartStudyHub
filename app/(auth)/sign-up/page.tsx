import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signupAction } from "@/app/actions/authActions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-medium text-center">Smart Study Hub</h1>

        <form
          action={async (formData: FormData) => {
            "use server";
            const res = await signupAction(formData);
            if (res.success) {
              redirect("/sign-in");
            }
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
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue="Student">
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="PROFESSOR">Professor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" variant="default" className="w-full">
            Create account
          </Button>
        </form>
        <div className="flex justify-center text-sm">
          <Link href="/sign-in">
            <Button variant="link" className="p-0">
              Have an account? Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
