"use client";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {}

export default function ProfileDropdown({}: ProfileDropdownProps) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    abbreviationOfName: "",
  });
  const router = useRouter();

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("user") as string) || JSON.parse(sessionStorage.getItem("user") as string);

    console.log("user:", user);

    if (!user) {
      router.push("/");
      return;
    }

    const { name, email } = user;

    const abbreviationOfName = name
      ?.split(" ")
      .map((el: any) => el.charAt(0))
      .join("");

    setUser({ name, email, abbreviationOfName });
  }, []);

  function signOut() {
    localStorage.removeItem("user");
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>{user.abbreviationOfName || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email || "user@gmail.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
