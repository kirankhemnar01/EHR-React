import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Autocomplete,
  TextField,
  styled,
  Card,
  CardContent,
} from "@mui/material";
import DoctorCard from "../../Components/doctor-list-card.js";
import InfoCard from "../../Components/education-info-card.js";

const RoundedCard = styled(Card)({
  borderRadius: "10px", // Adjust the radius as needed
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add shadow for depth
});

// dummy data

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

const cardInfo = {
  title: "Family Physician",
  practiceName: "Juno Medical",
  boardCertifications: "American Board of Family Medicine",
  education:
    "Medical School - Morehouse School of Medicine, Doctor of Medicine",
  languagesSpoken: "English",
  gender: "Male",
  npiNumber: "1962634535",
};

function PhysicianDetails() {

  const { id } = useParams();
  console.log("id", id);

  const physicianDetails = physicians.find((physician) => physician.id === parseInt(id));
  console.log("physicianDetails", physicianDetails);


  return (
    <Box sx={{ height: "100%", backgroundColor: "#FFF0BB" }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box sx={{ padding: "20px", height: "200px" }}>
            <DoctorCard data={physicianDetails} />
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        style={{ height: "100%", paddingRight: "60px", paddingLeft: "60px" }}
      >
        <Grid item xs={12}>
          <Box sx={{ height: "100%", marginBottom: "10px" }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>
              About Doctor
            </Typography>
            <RoundedCard>
              <CardContent sx={{backgroundColor: "#FDFAEE"}}>
                <Typography>
                  I'm a board-certified Family Medicine physician with over 10
                  years of clinical experience. I have worked in the Tulsa area
                  in various settings with the goal to provide excellent care
                  while growing as a provider. I enjoy building relationships
                  and learning new skills. I'm passionate about providing
                  thorough care to patients of all backgrounds. I completed my
                  medical training at In His Image Family Medicine Residency,
                  and I approach clinical professional developmental through
                  collaborative learning efforts such as OSU ECHO and
                  self-study. My goal in providing patient care is to build
                  trust, optimize health, and have mutually satisfying
                  interactions through the process.
                </Typography>
              </CardContent>
            </RoundedCard>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: "100%", marginBottom: "10px" }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>
              OPD Time
            </Typography>
            <RoundedCard>
              <CardContent sx={{backgroundColor: "#FDFAEE"}}>
                <Typography>Day: Monday to Saturday</Typography>
                <Typography>Timing:01:00pm - 03:00pm</Typography>
              </CardContent>
            </RoundedCard>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: "100%", marginBottom: "10px" }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>
              Education and Background
            </Typography>
            <RoundedCard>
              <InfoCard
                title="Family Physician"
                subtitle={cardInfo.practiceName}
              />
              <InfoCard
                title="Board Certifications"
                subtitle={cardInfo.boardCertifications}
              />
              <InfoCard
                title="Education and Training"
                subtitle={cardInfo.education}
              />
              <InfoCard
                title="Languages Spoken"
                subtitle={cardInfo.languagesSpoken}
              />
              <InfoCard title="Provider's Gender" subtitle={cardInfo.gender} />
              <InfoCard title="NPI Number" subtitle={cardInfo.npiNumber} />
            </RoundedCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PhysicianDetails;
