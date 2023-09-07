import React, {useState} from 'react';
import { Box, Autocomplete, TextField, Grid} from '@mui/material';


function SpecialistSearch({ data, setSpecialist }) {

  const [searchValue, setSearchValue] = useState(null); // Initialize with null
  console.log("searchValue", searchValue);

  // Custom filter function
  const customFilter = (option, value) => {
    // Case-insensitive search by name, department, hospital, and education
    return (
      option.name.toLowerCase().includes(value.toLowerCase()) ||
      option.department.toLowerCase().includes(value.toLowerCase()) ||
      option.hospital.toLowerCase().includes(value.toLowerCase()) ||
      option.education.toLowerCase().includes(value.toLowerCase())
    );
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="110%">
      <Box>
      </Box>
      <Box width="100%">
      <Autocomplete
        id="size-small-outlined-1"
        size="small"
        options={data}
        getOptionLabel={(option) => option.department}
        filterOptions={(options, state) =>
          options.filter((option) => customFilter(option, state.inputValue))
        }
        value={searchValue}
          onChange={(event, newValue) => { setSearchValue(newValue); setSpecialist(newValue)}}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select Specialist"
          />
        )}
      />

      {/* Display search results here */}
      <Grid container spacing={2}>
        {data
          .filter((data) => customFilter(data, searchValue?.name || ""))
          .map((physician) => (
            <Grid item key={physician.id}>
              {/* Render physician details */}
            </Grid>
          ))}
      </Grid>

      </Box>
    </Box>
  );
}

export default SpecialistSearch;
