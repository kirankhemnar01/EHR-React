import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  styled,
  Container,
  Divider,
  Link,
} from "@mui/material";
// import Logo from "../../../assets/images/logo.svg"; // Replace with your logo path
import Logo from "../../../assets/logo/medical-logo.svg"
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector } from "react-redux";

const HeaderAppBar = styled(AppBar)({
  backgroundColor: "#FDFAEE",
  minHeight: '80px',
  // Add styles for the AppBar here
});

const HeaderToolbar = styled(Toolbar)({
  // Add styles for the Toolbar here
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const LogoContainer = styled("div")({
  // Add styles for the logo container here
  display: "flex",
  alignItems: "center",
});

const LogoImage = styled("img")({
  // Add styles for the logo image here
  marginRight: "10px",
  height: "40px",
});

const NavigationContainer = styled("div")({
  // Add styles for the navigation container here
  display: "flex",
  alignItems: "center",
});

const StyledNavigationButton = styled(Button)({
  // Add styles for the navigation button here
  marginLeft: "16px",
  color: "black",
  fontFamily: "sharp-sans-semibold, fallback-font, Arial, sans-serif",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 600,
  textTransform: "none", // Keep button text in original case
  display: "flex",
  alignItems: "center",
});

function Header() {
  const store = useSelector((state) => state);
  console.log("store", store);
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const homeHandler = () => {
    navigate('/home')
  }

  return (
    <HeaderAppBar position="static">
      <Container>
        <HeaderToolbar>
          <LogoContainer onClick={homeHandler} sx={{cursor:"pointer"}}>
            <LogoImage src={Logo} alt="Company Logo" />
            <Typography variant="h6" sx={{ color: "black" }}>
              Care Group
            </Typography>
          </LogoContainer>
          <NavigationContainer>
            <StyledNavigationButton
              color="inherit"
              // onClick={handleMenuClick}
              sx={{ color: "#333333" }}
            >
              Browse
            </StyledNavigationButton>
            <Divider orientation="vertical" flexItem />
            <StyledNavigationButton
              color="inherit"
              component={Link}
              to="/help"
              sx={{ color: "#333333" }}
            >
              Help
            </StyledNavigationButton>
            <Divider orientation="vertical" flexItem />
            <StyledNavigationButton
              color="inherit"
              component={Link}
              to="/list"
              sx={{ color: "#333333" }}
            >
              List your practice on care group
            </StyledNavigationButton>
            <Divider orientation="vertical" flexItem />
            <StyledNavigationButton
              color="inherit"
              onClick={handleMenuClick}
              endIcon={<ArrowDropDownIcon />}
            >
              Login/Signup
            </StyledNavigationButton>
            {/* <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Patients" />
                <Typography variant="body1" style={{ marginLeft: "20px" }}>
                  Log in
                  <Link component={RouterLink} to="/signin"></Link>
                </Typography>
                <Typography variant="body1" style={{ marginLeft: "20px" }}>
                  Sign up
                  <Link component={RouterLink} to="/signup"></Link>
                </Typography>
              </MenuItem>
              <Divider orientation="horizontal" flexItem />
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Doctors" />
                <Typography variant="body1" style={{ marginLeft: "20px" }}>
                  Log in
                  <Link component={RouterLink} to="/signin"></Link>
                </Typography>
              </MenuItem>
            </Menu> */}
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Patients" />
              <Typography variant="body1" style={{ marginLeft: "20px" }}>
                <Link component={RouterLink} to="/signin/patient" style={{ textDecoration: "underline", color: "blue" }}>
                  Log in
                </Link>
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "20px" }}>
                <Link component={RouterLink} to="/signup" style={{ textDecoration: "underline", color: "blue" }}>
                  Sign up
                </Link>
              </Typography>
            </MenuItem>
            <Divider orientation="horizontal" flexItem />
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Doctors" />
              <Typography variant="body1" style={{ marginLeft: "20px" }}>
                <Link component={RouterLink} to="/signin/doctor" style={{ textDecoration: "underline", color: "blue" }}>
                  Log in
                </Link>
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "20px" }}>
                <Link component={RouterLink} to="/signupDoctor" style={{ textDecoration: "underline", color: "blue" }}>
                  Sign up
                </Link>
              </Typography>
            </MenuItem>
          </Menu>

          </NavigationContainer>
        </HeaderToolbar>
      </Container>
    </HeaderAppBar>
  );
}

export default Header;
