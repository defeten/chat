import type { User } from "@/types";
import { Author } from "./messages/author";

type Props = {
  users: User[];
};

export function UserList({ users }: Props) {
  return (
    <div className="my-auto mx-auto grid grid-cols-2 text-center">
      <p className="font-semibold text-center col-span-2">
        Users ({users.length})
      </p>
      {users.map((user) => (
        <Author key={`userlist:${user.name}`} data={user} />
      ))}
    </div>
  );
}
