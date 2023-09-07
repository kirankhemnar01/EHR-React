import React,{useState} from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Paper,
  Rating
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
// import BookImg from '../../../../../assets/images/home/book-apt.svg'
import BookAppontment from "../Patient/Appontment";

const DoctorCard = ({ data }) => {

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const detailsHandler = () => {
    navigate(`/home/details/${data.id}`)
  }

  const bookhandler = () => {
    console.log("book")
    // navigate('/home/book/1')
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Paper elevation={3} >
      <Card style={{ marginBottom: "20px" }}>
        <CardContent style={{ backgroundColor: "#FDFAEE" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar
              alt="Doctor's Profile"
              src="profile-image-url.jpg" // Replace with the actual image URL
              sx={{ width: 120, height: 120, cursor: 'pointer' }}
              onClick={detailsHandler}
            />
            <Box flex="1" ml={2}>
              <Typography variant="h5">{data.name}</Typography>
              <Typography variant="subtitle1">{data.department}</Typography>
              <Typography variant="body2">{data.hospital}</Typography>
              <Typography variant="body2">{data.education}</Typography>
              <Typography variant="body2">{data.state}</Typography>

            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2, marginRight: '50px' }}>
            <Typography variant="subtitle1" color="text.secondary">
              Rating:
            </Typography>
            <Rating
              value={data.rating}
              precision={0.1}
              readOnly
              sx={{ ml: 1 }}
            />
          </Box>
            <Box
              textAlign="center" // Center align content
              display="flex"
              flexDirection="column" // Stack items vertically
              alignItems="center" // Center items horizontally
            >
              <Typography variant="body2">
                <PhoneInTalkIcon sx={{marginBottom: '-7px'}} /> {data.phone}
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#FFF04B", color: "black", marginTop: "8px" }}
                onClick={bookhandler}
              >
                Book Appointment
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <BookAppontment open={isModalOpen} handleClose={handleCloseModal} />
    </Paper>
  );
};

export default DoctorCard;
