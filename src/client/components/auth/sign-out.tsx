import { useState } from "react";
import { Button } from "@/client/components/ui/button";

export function SignOut() {
  const [pending, set] = useState(false);

  function click() {
    set(true);
    fetch("/api/signout").then(() => window.location.reload());
  }

  return (
    <Button theme="dark" onClick={() => click()} disabled={pending}></Button>
  );
}
