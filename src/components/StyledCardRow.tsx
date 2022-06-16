import { Typography } from '@mui/material';

interface IStyledCardRowProps {
  readonly name: string;
  readonly value: string;
}

const StyledCardRow: React.FC<IStyledCardRowProps> = ({ name, value }) => {
  return (
    <Typography variant="body2" paddingTop={1} style={{ wordWrap: 'break-word' }}>
      <b>{name}:</b> {value}
    </Typography>
  );
};

export default StyledCardRow;
