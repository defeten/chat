import { use, useState } from "react";

type Props = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  showForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SignIn({ showForm, username, setUsername }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url =
      process.env.NODE_ENV === "development"
        ? "/api/signin"
        : process.env.PUBLIC_BASEURL + "/signin";

    const response = await fetch(url, {
      method: "post",
      body: new URLSearchParams({
        name: username,
        password,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      setError(text);
    } else window.location.reload();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col rounded-sm bg-stone-400 p-1 text-stone-800"
    >
      <input
        type="text"
        name="name"
        placeholder="username"
        required
        className="rounded-sm bg-transparent p-1 transition-colors outline-none focus:bg-stone-300"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        required
        className="rounded-sm bg-transparent p-1 transition-colors outline-none focus:bg-stone-300"
      />
      {error && <span className="text-xs text-red-800">{error}</span>}
      <div className="flex items-center justify-between">
        <button
          className="cursor-pointer rounded-md p-1 transition-colors hover:bg-stone-300"
          type="submit"
        >
          signin
        </button>
        <button
          type="button"
          className="cursor-pointer text-red-800 rounded-md p-1 transition-colors hover:bg-stone-300"
          onClick={() => showForm(false)}
        >
          close
        </button>
      </div>
    </form>
  );
}
