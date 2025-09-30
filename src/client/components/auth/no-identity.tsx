import { useState } from "react";
import { SignIn } from "@/client/components/auth/sign-in";
import { SignUp } from "@/client/components/auth/sign-up";

export function NoIdentity() {
  const [username, setUsername] = useState("");
  const [authDestination, setAuthDestination] = useState<"signin" | "signup">(
    "signin"
  );
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="m-auto flex flex-col gap-y-4 p-2">
      <span className="rounded-sm text-red-500">
        You are disconnected. This is probably because you aren't authenticated,
        please{" "}
        <button
          className="cursor-pointer text-blue-400 outline-none"
          onClick={() => {
            setAuthDestination("signin");
            setShowForm(true);
          }}
        >
          signin
        </button>{" "}
        or{" "}
        <button
          className="cursor-pointer text-blue-400 outline-none"
          onClick={() => {
            setAuthDestination("signup");
            setShowForm(true);
          }}
        >
          signup
        </button>
        .
      </span>
      {showForm ? (
        authDestination === "signin" ? (
          <SignIn
            username={username}
            setUsername={setUsername}
            showForm={setShowForm}
          />
        ) : (
          <SignUp
            username={username}
            setUsername={setUsername}
            showForm={setShowForm}
          />
        )
      ) : null}
    </div>
  );
}
