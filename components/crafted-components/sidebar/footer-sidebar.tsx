import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth, getRole, signOut } from "@/lib/auth";
import { ChevronUp, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignInButton from "./sign-in-button";

export default async function FooterSidebar() {
  const session = await auth();
  const role = await getRole();
  return (
    <SidebarFooter>
      <div className="bg-red-600 ">{role}</div>
      {session ? (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex justify-between">
                  <div className="flex">
                    <User className="mr-2" /> {session.user?.email}
                  </div>
                  <ChevronUp className="size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link className="text-red" href="/profile">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link className="text-red" href="/settings">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    "use server";
                    await signOut();
                    redirect("/sign-in");
                  }}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      ) : (
        <SignInButton />
      )}
    </SidebarFooter>
  );
}
