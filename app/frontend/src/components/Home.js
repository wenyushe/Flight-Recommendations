import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Button, Center, Heading, Container, Stack, Input, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react'


import axios from "axios";

const Home = () => {

    // page navigation to Advanced Queries page
    let navigate = useNavigate();
    const navigateToAdv = () => {
        navigate('advQueries');
    }

    // page navigation to Advanced Queries page
    const navigateToAddData = () => {
        navigate('addData');
    }

    // page navigation to Recommendations page
    const navigateToRec = () => {
        navigate('/recommendations', {state: {origin: origin,
                                    destination: destination,
                                    month: monthMap.get(month)}});
    }

    // page navigation to Update Name page
    const navigateToUpName = () => {
        navigate('updateName');
    }

    // page navigation to View Flights page
    const navigateToView = () => {
        navigate('viewFlights');
    }

    // handle submit should insert new customer info into database
    const handleSubmit = event => {
        console.log('submitted form');
        event.preventDefault();  // prevent page refresh
    }

    // Sidebar
    const Sidebar = ({ isOpen, onClose }) => {
        return (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Navigation</DrawerHeader>
              <DrawerBody>
                <Stack spacing={4}>
                  <Button as={Link} to="/advQueries">Advanced Queries</Button>
                  <Button as={Link} to="/addData">Contribute to Database</Button>
                  <Button as={Link} to="/updateName">Update Personal Info</Button>
                  <Button as={Link} to="/viewFlights">View Personal Flights</Button>
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        );
    };
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    // retrieve adv query 1
    const [num, setnum] = useState("0");
    useEffect(() => {
        axios.get('http://localhost:3002/').then((response) => {
            setnum(response.data[0].cCount)
        })
    }, [])

    // variables for form below
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [month, setMonth] = useState('');

    // For month dropdown menu
    const handleOptionClick = event => {
        const selectedOption = event.target.value;
        setMonth(selectedOption);
    };
    const options = [ // month name options for dropdown menu
        { label: "January", value: "January" },
        { label: "February", value: "February" },
        { label: "March", value: "March" },
        { label: "April", value: "April" },
        { label: "May", value: "May" },
        { label: "June", value: "June" },
        { label: "July", value: "July" },
        { label: "August", value: "August" },
        { label: "September", value: "September" },
        { label: "October", value: "October" },
        { label: "November", value: "November" },
        { label: "December", value: "December" },
    ];
    const monthMap = new Map([  // maps from month name to numerical number 1-12
        ["January", 1],
        ["February", 2],
        ["March", 3],
        ["April", 4],
        ["May", 5],
        ["June", 6],
        ["July", 7],
        ["August", 8],
        ["September", 9],
        ["October", 10],
        ["November", 11],
        ["December", 12]
    ]);

  return (
    <div>
        <div>
            <p>
                <Button onClick={handleOpen} margin="1rem 0 0 1rem" variant="outline" colorScheme="gray">Navigate</Button>
                <Sidebar isOpen={isOpen} onClose={handleClose} />
            </p>
            <Center className="title">
                <Heading>
                Flight Recommendations
                </Heading>
            </Center>
            <Center>
                Number of Flights in Database: {num} <br /> 
            </Center>
            {/* <Container className='button-container'>            
                <Button className='normal-button' onClick={navigateToAdv}>
                    Click for advanced queries
                </Button> 

                <Button className='normal-button' onClick={navigateToAddData}>
                    Contribute to Database
                </Button> 

                <Button className='normal-button' onClick={navigateToUpName}>
                    Update Personal Info
                </Button> 

                <Button className='normal-button' onClick={navigateToView}>
                    View Personal Flights
                </Button> 
            </Container> */}
            
        </div>

        <div>
        <Container>
            <br/>
            {/* <Heading className='recommendation-section'>
                Get Recommendations:
            </Heading> */}
            <div>
                Enter Flight Information: <br /> 
            </div>
            <br/>
            <form onSubmit={handleSubmit}>

                <Stack spacing={3}>

                    <Input
                    placeholder='Origin Airport (ex: SFO)'
                    id="origin_"
                    name="origin_"
                    type="text"
                    onChange={event => setOrigin(event.target.value)}
                    value={origin}
                    size='md'
                    />

                    <Input
                    placeholder='Destination Airport (ex: ORD)'
                    id="destination_"
                    name="destination_"
                    type="text"
                    onChange={event => setDestination(event.target.value)}
                    value={destination}
                    size='md'
                    />

                    <Menu>
                        <MenuButton as={Button}>{month || "Select Month"}</MenuButton>
                        <MenuList>
                            {options.map(option => (
                            <MenuItem key={option.value} value={option.value} onClick={handleOptionClick}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                </Stack>
                
                <Button className='submit-button' type="submit" onClick={navigateToRec}>
                    Click for Recommendations!
                </Button> 

        </form>
        </Container>
    </div>
    </div>
  )
}

export default Home