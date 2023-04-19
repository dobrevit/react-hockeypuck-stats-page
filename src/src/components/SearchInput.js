import { TextField } from "@mui/material";

function SearchInput({ onSearch }) {
  return (
    <TextField
      label="Search PGP Keys"
      variant="outlined"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

export default SearchInput;
