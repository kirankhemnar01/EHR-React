import React, {useState} from 'react';
// import { Typography, Paper, Divider, Box, Grid, Autocomplete, TextField, SearchIcon, IconButton } from '@mui/material';  
import { Box, Autocomplete, TextField, Grid} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Formik, Form, Field, ErrorMessage, dirty } from "formik";



function SpecialityCard({ data, forChild }) {
  console.log("data", data);

  const [searchValue, setSearchValue] = useState(null); // Initialize with null
  const [isChanged, setIsChanged] = useState(false);
  console.log("isChnaged", isChanged);
  
  console.log("searchValue", searchValue);

  // Custom filter function
  const customFilter = (option, value) => {
    console.log("searchvalue", value);
    console.log("option", option);
    // Case-insensitive search by name, department, hospital, and education
    return (
      option.name.toLowerCase().includes(value.toLowerCase()) ||
      option.department.toLowerCase().includes(value.toLowerCase()) ||
      option.hospital.toLowerCase().includes(value.toLowerCase()) ||
      option.education.toLowerCase().includes(value.toLowerCase()) ||
      option.state.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleFocus = () => {
    setIsChanged(true);
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="110%">
      <Box>
      <SearchIcon/>
      </Box>
      <Box width="60%">
      <Formik
       initialValues={{
         
       }}
       onSubmit={(values) => {
         console.log(values, "values"); // You can handle form submission here
       }}
     >
      {({ handleSubmit, errors, touched, dirty }) => (
      <Form>
        <Autocomplete
          id="size-small-outlined-1"
          size="small"
          options={touched && isChanged  ? data : []}
          // options={ data }
          getOptionLabel={(option) => option.name}
          filterOptions={(options, state) =>
            options.filter((option) => customFilter(option, state.inputValue))
          }
          value={searchValue}
          onChange={(event, newValue) => { setSearchValue(newValue); forChild(newValue); setIsChanged(false) }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              size="large"
              placeholder="Search for practices, specialities, and physicians"
              onChange={handleFocus}
            />
          )}
        />
      </Form>
      )}
      </Formik>
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

export default SpecialityCard;
