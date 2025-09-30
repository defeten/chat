import { useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { Button } from "@/client/components/ui/button";

export function SignOut() {
  const [pending, set] = useState(false);

  function click() {
    set(true);
    fetch("/api/signout").then(() => window.location.reload());
  }

  return (
    <Button theme="dark" onClick={() => click()} disabled={pending}>
      <IoLogOut className="h-6 w-6 fill-red-900" />
    </Button>
  );
}
