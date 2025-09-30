import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { IoLogOut } from "react-icons/io5";

export function SignOut() {
  const [pending, set] = useState(false);

  function click() {
    set(true);
    fetch("/api/signout").then(() => window.location.reload());
  }

  return (
    <Button theme="dark" onClick={() => click()} disabled={pending}>
      <IoLogOut className="w-6 h-6 fill-red-900" />
    </Button>
  );
}
