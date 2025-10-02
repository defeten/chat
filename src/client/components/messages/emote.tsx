type Props = {
  name: string;
};

export function Emote({ name }: Props) {
  return (
    <span title={name} data-emote={name}>
      {name + " "}
    </span>
  );
}
