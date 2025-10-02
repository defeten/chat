import { Author } from "@/client/components/messages/author";
import type { User } from "@/types";

type Props = {
  users: User[];
};

export function UserList({ users }: Props) {
  return (
    <div className="mx-auto my-auto grid grid-cols-2 text-center">
      <p className="col-span-2 text-center font-semibold">
        Users ({users.length})
      </p>
      {users.map((user) => (
        <Author key={`userlist:${user.name}`} data={user} />
      ))}
    </div>
  );
}
