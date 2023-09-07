import React, { useState } from 'react';
import { Box, Autocomplete, TextField, Grid } from '@mui/material';

function PracticesSearch({ data, setPractice }) {
  const [searchValue, setSearchValue] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const customFilter = (option, value) => {
    return (
      option.name.toLowerCase().includes(value.toLowerCase()) ||
      option.department.toLowerCase().includes(value.toLowerCase()) ||
      option.hospital.toLowerCase().includes(value.toLowerCase()) ||
      option.education.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSearchValue(newValue);
    setPractice(newValue);
    setSelectedHospital(newValue?.hospital || null);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="110%">
      <Box width="100%">
        <Autocomplete
          id="size-small-outlined-1"
          size="small"
          options={data}
          getOptionLabel={(option) => option.hospital}
          filterOptions={(options, state) =>
            options.filter((option) => customFilter(option, state.inputValue))
          }
          value={searchValue}
          onChange={handleAutocompleteChange}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select Practices" />
          )}
        />

        {/* Display search results here */}
        <Grid container spacing={2}>
          {data
            .filter((data) => customFilter(data, searchValue?.name || ""))
            .filter(
              (physician) =>
                selectedHospital
                  ? physician.hospital === selectedHospital ||
                    physician.hospital === searchValue?.hospital
                  : true
            )
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

export default PracticesSearch;
