interface Props {
  name: string;
  entries: number;
}
const Rank = ({ name, entries }: Props) => {
  return (
    <div>
      <div className="white f3">{`${name}, your current rank is...`}</div>
      <div className="white f1">{entries}</div>
    </div>
  );
};

export default Rank;
