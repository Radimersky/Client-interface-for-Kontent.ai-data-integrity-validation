interface IStyledCardRowProps {
  readonly name: string;
  readonly value: string;
}

const StyledCardRow: React.FC<IStyledCardRowProps> = ({ name, value }) => {
  return (
    <p>
      <b>{name}:</b> {value}
    </p>
  );
};

export default StyledCardRow;
