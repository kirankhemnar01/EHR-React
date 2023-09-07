import React, {useEffect, useState, useCallback} from "react";
import {
  Typography,
  Box,
  Grid,
  Autocomplete,
  TextField,
  styled,
} from "@mui/material";
import SpecialityCard from "./search-all.js/search-all";
import DoctorCard from "../Components/doctor-list-card.js";
// import SearchImg from '../../../assets/images/home/doc-sis.svg'
import SearchImg from "../../../assets/images/home/search.svg";
import BookImg from '../../../assets/images/home/book-apt.svg'
import PracticesSearch from "./Practices-search/practices-serach";
import SpecialistSearch from "./specilalist-search/specialist-search";


  const physicians = [
    {
      id: 1,
      name: "Dr. John Smith",
      phone: "123-456-7890",
      department: "Cardiology",
      hospital: "St. Mary's Hospital",
      education: "MD, University of Medical Sciences",
      rating: 4,
      pincode: 411061,
      state: 'Maharashtra'
    },
    {
      id: 2,
      name: "Dr. Emily Johnson",
      phone: "987-654-3210",
      department: "Dermatology",
      hospital: "General Hospital",
      education: "DO, City Medical College",
      rating: 4.5,
      pincode: 411060,
      state: 'Kolkata'
    },
    {
      id: 3,
      name: "Dr. Michael Brown",
      phone: "555-123-4567",
      department: "Orthopedics",
      hospital: "City Medical Center",
      education: "MBBS, University of Health Sciences",
      rating: 3,
      pincode: 411027,
      state: 'Tamilnadu'
    },
    {
      id: 4,
      name: "Dr. Sarah Davis",
      phone: "777-888-9999",
      department: "Gastroenterology",
      hospital: "St. Mary's Hospital",
      education: "MD, City Medical College",
      rating: 3.5,
      pincode: 411021,
      state: 'Goa'
    },
    {
      id: 5,
      name: "Dr. Jessica Lee",
      phone: "444-555-6666",
      department: "Neurology",
      hospital: "Marine Hospital",
      education: "DO, University of Medical Sciences",
      rating: 4.9,
      pincode: 411222,
      state: 'Karnataka'
    },
    {
      id: 6,
      name: "Dr. John Lee",
      phone: "444-555-6776",
      department: "Surgen",
      hospital: "Son Johns Hospital",
      education: "DO, University of Medical Sciences",
      rating: 2,
      pincode: 422622,
      state: 'Assam'
    },
    {
      id: 7,
      name: "Dr. Lee Cooper",
      phone: "444-565-6776",
      department: "Orthopedics",
      hospital: "Recover Hospital",
      education: "DO, University of Medical Sciences",
      rating: 3.5,
      pincode: 411115,
      state: 'Bihar'
    }
    
  ]


function Home() {

  const [value, setValue] = useState();
  const [drList, setDrList] = useState([]);

  console.log("value", value);
  console.log("value2", drList);

  const LogoImage = styled("img")({
    marginRight: "10px",
    height: "200px",
  });
  const BookImgWrapper = styled("img")({
    marginRight: "10px",
    height: "500px",
    position: "relative",
  });

  const forChild = (value) => setValue(value);
  const setPractice = (value) => setValue(value);
  const setSpecialist = (value) => setValue(value);
  
  useEffect(() => {
    value ? setDrList([value]) : setDrList(physicians);
  }, [value])
  
  // useEffect(() => {
  //   if (value) {
  //     if (value.hospital) {
  //       // If a hospital is selected, filter physicians by hospital
  //       const filteredPhysicians = physicians.filter(
  //         (physician) => physician.hospital === value.hospital
  //       );
  //       setDrList(filteredPhysicians);
  //     } else if (value.department) {
  //       // If a specialist is selected, filter physicians by department
  //       const filteredPhysicia ns = physicians.filter(
  //         (physician) => physician.department === value.department
  //       );
  //       setDrList(filteredPhysicians);
  //     }
  //   } else {
  //     // If no value is selected, show all physicians
  //     setDrList(physicians);
  //   }
  // }, [value]);
  

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignContent: "center"}}
    >
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item xs={12}>
          <Box bgcolor="#FDFAEE" sx={{ padding: "20px" }}>
            <SpecialityCard data={physicians} forChild={ forChild } />
          </Box>
        </Grid>
        <Box
          sx={{
            position: "absolute",
            bottom: "80%",
            // left: "10%",
            right: "0%"
          }}
        >
          <LogoImage src={SearchImg} />
        </Box>
        <Grid item xs={12}>
          <Box bgcolor="#FDFAEE" sx={{ padding: "50px" }}>
            <Typography variant="h5" sx={{marginBottom: "20px"}}>let's choose physician filter by practices and specialities</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <SpecialistSearch data={physicians} setSpecialist={setSpecialist} />
              </Grid>
              <Grid item xs={6}>
                <PracticesSearch data={physicians} setPractice={setPractice} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                zIndex: 2,
                opacity: 0.7,
                bottom: '-5%'
              }}
            >
              <BookImgWrapper src={BookImg} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box bgcolor="#FFF0BB" sx={{ padding: "65px", height: '550px', overflowY:'auto' }}>
            {drList?.map((item, index) => (
              <DoctorCard data={item} key={index}  />
             ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
