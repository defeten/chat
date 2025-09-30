import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import type { API_Check_Response } from "@/types";

type Props = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  showForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SignUp({ username, setUsername, showForm }: Props) {
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string>();
  const debouncedUsername = useDebounce(username, 300);

  useEffect(() => {
    let cancelled = false;
    async function lookup() {
      if (!cancelled) {
        const response = await fetch(
          "/api/check?" + new URLSearchParams({ name: username }),
        );
        if (response.ok) {
          const json: API_Check_Response = await response.json();
          if (!cancelled) {
            if (json.exists) {
              setError("name taken");
            }
            setUsernameTaken(json.exists);
          }
        }
      }
    }

    lookup();
    return () => {
      cancelled = true;
    };
  }, [debouncedUsername]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/signup", {
      method: "post",
      body: new URLSearchParams({
        name: username,
        password,
        confirmation,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      setError(text);
    } else window.location.reload();
  }

  const same = password === confirmation;
  return (
    <form
      className="flex flex-col gap-y-1 rounded-sm bg-stone-400 p-2 text-stone-800 shadow-inner shadow-stone-900"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        name="name"
        placeholder="username"
        pattern="^[0-9A-Za-z_]{4,24}$"
        required
        data-valid={username.charAt(0) !== "_" && !usernameTaken}
        className="rounded-sm bg-transparent p-1 transition-colors outline-none invalid:bg-amber-200/50 focus:bg-stone-300 [&[data-valid='true']:valid]:bg-emerald-200/50"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        minLength={8}
        maxLength={64}
        required
        data-valid={same}
        className="rounded-sm bg-transparent p-1 transition-colors outline-none invalid:bg-amber-200/50 focus:bg-stone-300 [&[data-valid='true']:valid]:bg-emerald-200/50"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <input
        type="password"
        name="confirmation"
        placeholder="again"
        minLength={8}
        maxLength={64}
        required
        data-valid={same}
        className="rounded-sm bg-transparent p-1 transition-colors outline-none invalid:bg-amber-200/50 focus:bg-stone-300 [&[data-valid='true']:valid]:bg-emerald-200/50"
        value={confirmation}
        onChange={({ target }) => setConfirmation(target.value)}
      />
      {error && <span className="text-xs text-red-800">{error}</span>}
      <div className="flex items-center justify-between">
        <button
          disabled={usernameTaken}
          className="cursor-pointer rounded-md p-1 transition-colors hover:bg-stone-300 disabled:cursor-not-allowed disabled:bg-stone-700"
          type="submit"
        >
          signup
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-md p-1 text-red-800 transition-colors hover:bg-stone-300"
          onClick={() => showForm(false)}
        >
          close
        </button>
      </div>
    </form>
  );
}
