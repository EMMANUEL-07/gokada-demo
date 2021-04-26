/*global google*/
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField, ListItem, ListItemAvatar, ListItemText, Avatar, List, Button, Card } from '@material-ui/core';
import { ArrowBackIos, LocationOn } from '@material-ui/icons';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Map from './map'
import axios from 'axios'




const MainPage = props => {

   /* Simple state management used across all components and functions */

   const [screen, setScreen] = useState('first')
   const [pickUpAdd, setPickUpAdd] = useState('')
   const [dropOffAdd, setDropOffAdd] = useState('')
   const [pickUpAddress, setPickUpAddress] = useState('')
   const [dropOffAddress, setDropOffAddress] = useState('')
   const [pickUpCoord, setPickUpCoord] = useState('')
   const [dropOffCoord, setDropOffCoord] = useState('')
   const [pickFromCurrent, setPickFromCurrent] = useState('contents')
   const [mine, setMine] = useState('none')
   const [tData, setTdata] = useState([])
   const [newSet, setNewSet] = useState([])


   //Functionality to navigate between screens and also handle some other functions

   const showFirst = () => {
      setScreen('first')
      setPickFromCurrent('contents')
      uniqueSuggestion();
   }

   const showPickup = () => {
      setScreen('pickUp')
   }

   const showDropoff = () => {
      setScreen('dropOff')
   }

   //Functionality to get user's current location, on page initial mount
   const successfulLookup = position => {
      const { latitude, longitude } = position.coords;
      setPickUpCoord({ lat: latitude, lng: longitude })

   }

   useEffect(() => {
      window.navigator.geolocation.getCurrentPosition(successfulLookup);
   }, [])


   //Functionality to get stored suggestions from database, on page initial mount
   useEffect(async () => {
      const newSetz = await axios.get('http://localhost/gokadaApi/api/suggestions')
      setNewSet(newSetz.data)

   }, []);


   //Array const where all suugestions are stored from the autoplaces complete response
   const suggestionCapture = []

   //Array const where unique suugestions are stored alog with its coordinates and formatted details
   let saveDataM = []

   //Functionalty to process suggestions, return unique values, process them into desired object format, and store in database
   const uniqueSuggestion = () => {

      let uniqueSugggestionsData = Array.from(new Set(suggestionCapture.map(JSON.stringify))).map(JSON.parse)

      const saveData = uniqueSugggestionsData.map(sugData => {

         

         geocodeByAddress(sugData.desc)
         .then(results => getLatLng(results[0]))
         .then(latLng => {
            saveDataM.unshift({ "address": sugData.desc.toLowerCase(), "main": sugData.main, "sec": sugData.sec, "lat": latLng.lat, "lng": latLng.lng })
            return saveDataM;
         })
         .then(result => result[0])
         .then(result => axios.post('http://localhost/gokadaApi/api/suggestions', result))
         .catch(error => console.error('Error', error));

         return saveDataM
      })

      return saveDataM
   }


   //Functional Component holding content to be displayed on load of application

   const firstPage = (props) => {

      return (

         <Box style={{ height: '100vh' }}>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', boxShadow: '0px 0px 0px 0px' }}>
               <Toolbar align='center'>
                  <Typography variant="h5" fontWeight="fontWeightBold" style={{ flexGrow: 1, textAlign: "center", fontWeight: "bold"}}>
                     <Box fontWeight="fontWeightBold">
                        Parcel request
                  </Box>
                  </Typography>
               </Toolbar>
            </AppBar>

            {/* Input fields serving as gateway to accept pickup and dropoff details */}
            <Box display="flex" flexDirection="column" mx={2} >
               <div onClick={showPickup}><TextField id="1" label="Pickup address" variant="filled" margin='normal' fullWidth value={pickUpAddress} /></div>
               <div onClick={showDropoff}><TextField id="2" label="Dropoff address" variant="filled" margin='normal' fullWidth value={dropOffAddress} /></div>

            </Box>

            {/* Section displaying rendered map */}
            <Box style={{ height: '100%'}}>
               <Map coord1={pickUpCoord} coord2={dropOffCoord} />

            </Box>

            {/* Section to display order details when ready */}
            { pickUpAddress && dropOffAddress ?
               <Card style={{ width: '100%' }}>
                  <Box display='flex' justifyContent='space-between' p={1} fontWeight="fontWeightBold" fontSize="h5.fontSize">
                     <Box> ₦1500,<small>00</small></Box>
                     <Box> <small>3.3km</small> | <small>24 mins</small></Box>
                  </Box>

                  <Box display='flex' justifyContent='space-between' style={{ marginBottom: '12px' }} p={1}>
                     <Button style={{ marginBottom: '30px', color: 'white', backgroundColor: '#00c799', padding: '12px' }} size='large' variant='contained' fullWidth >Enter Parcel Details</Button>
                  </Box>

               </Card>
               :
               null
            }


         </Box>
      )
   }


   //Functional Component to display interface for dropOff details
   const dropOff = props => {


      //Onchange functionality executed as user inputs value
      const handleChangeDrop = address => {
         const laddress = address.toLowerCase();

         const ours = newSet.filter(test => test.address.includes(laddress))


         if (ours.length === 0) {
            setDropOffAdd(address);
            setMine('none')
         } else {
            setMine('contents')
            setDropOffAdd(address);
            setTdata(ours)
            setDropOffAdd(address);
         }
      };

      //OnSelect functionality executed when user confirms address, for values coming from autoComplete api
      const handleSelectDrop = address => {
         geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
               setDropOffCoord(latLng)
               setDropOffAddress(address)
               showFirst()
            })
            .catch(error => console.error('Error', error));

      };

      //OnSelect functionality executed when user confirms address, for values coming from database
      const handleDropFromDB = (loc) => {

         setDropOffCoord({ lat: loc.lat, lng: loc.lng })

         const addressBack = loc.address.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());

         setDropOffAddress(addressBack)

         showFirst()

      }

      //Config options for autocomplete Api
      const searchOptions = {
         location: new google.maps.LatLng(pickUpCoord.lat, pickUpCoord.lng),
         radius: 50000,
         types: ['address'],
         componentRestrictions: { country: "ng" },
         strictBounds: true

      }


      return (
         <Box style={{ height: '100vh' }}>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', boxShadow: '0px 0px 0px 0px' }}>
               <Toolbar >
                  <IconButton edge="start"  color="inherit" aria-label="menu" onClick={showFirst}>
                     <ArrowBackIos />
                     <Typography variant="subtitle1" >
                        Back
            </Typography>
                  </IconButton>

                  <Typography variant="h5" style={{ flexGrow: 1, textAlign: "center", display: "flex", justifyContent: "center"}}>
                     Dropoff &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         </Typography>

               </Toolbar>
            </AppBar>

            {/* Dynamic content to display input for either data from the autocomplete function or from the database */}
            {mine === 'contents'
               ?
               <Box mx={2}>
                  <TextField
                     variant='filled'
                     defaultValue={dropOffAdd}
                     fullWidth
                     autoFocus
                     {...{
                        placeholder: 'Pickup address',
                        className: 'location-search-input',
                     }}
                     onChange={e => handleChangeDrop(e.target.value)}
                  />
                  {tData.map(loc => {
                     return (<Box my={2}  >
                        <ListItem style={{ borderBottom: '1px solid #f1f1f1' }} onClick={() => handleDropFromDB(loc)} >
                           <ListItemAvatar>
                              <Avatar>
                                 <LocationOn />
                              </Avatar>
                           </ListItemAvatar>
                           <ListItemText primary={loc.main} secondary={loc.sec} />
                        </ListItem>
                     </Box>)
                  }
                  )
                  }
               </Box>
               :
               <PlacesAutocomplete
                  value={dropOffAdd}
                  onChange={handleChangeDrop}
                  onSelect={handleSelectDrop}
                  searchOptions={searchOptions}
               >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                     <Box mx={2}>
                        <TextField
                           variant='filled'
                           autoFocus
                           defaultValue={dropOffAdd}
                           fullWidth
                           {...getInputProps({
                              placeholder: 'Pickup address',
                              className: 'location-search-input',
                           })}


                        />

                        <div className="autocomplete-dropdown-container">
                           {loading && <div>Loading...</div>}
                           {<List>
                              {suggestions.map(suggestion => {
                                 suggestionCapture.push({
                                    desc: suggestion.description,
                                    main: suggestion.formattedSuggestion.mainText,
                                    sec: suggestion.formattedSuggestion.secondaryText
                                 })

                                 const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';

                                 const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };



                                 return (
                                    <div
                                       {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                       })}
                                    >
                                       <ListItem style={{ borderBottom: '1px solid #f5f5f9' }}>
                                          <ListItemAvatar>
                                             <Avatar>
                                                <LocationOn />
                                             </Avatar>
                                          </ListItemAvatar>
                                          <ListItemText primary={suggestion.formattedSuggestion.mainText} secondary={suggestion.formattedSuggestion.secondaryText} />
                                       </ListItem>
                                    </div>
                                 );
                              })}


                           </List>}

                        </div>
                     </Box>
                  )}
               </PlacesAutocomplete>}
         </Box>
      )
   }

   //Functional Component to display interface for pickUp details
   const pickUp = props => {

      //Onchange functionality executed as user inputs value
      const handleChangePick = address => {

         checker()
         const laddress = address.toLowerCase();

         const ours = newSet.filter(test => test.address.includes(laddress))


         if (ours.length === 0) {
            setPickUpAdd(address);
            setMine('none')
         } else {
            setMine('contents')
            setPickUpAdd(address);
            setTdata(ours)
         }

      };

      //Function to toggle select from current location option
      const checker = (e) => {
         setPickFromCurrent('none')
      };

      //OnSelect functionality executed when user confirms address, for values coming from autoComplete api
      const handleSelectPick = address => {
         geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
               setPickUpCoord(latLng)
               setPickUpAddress(address)
               showFirst()
            })
            .catch(error => console.error('Error', error));
      };

      //OnSelect functionality executed when user confirms address, for values coming from database
      const handlePickFromDB = (loc) => {

         setPickUpCoord({ lat: loc.lat, lng: loc.lng })

         const addressBack = loc.address.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());

         setPickUpAddress(addressBack)

         showFirst()

      }

      //Function to handle select from current location
      const selectFromCurrent = () => {

         axios(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickUpCoord.lat},${pickUpCoord.lng}&key=['API_KEY_HERE']`)
         .then(response => response.data.results)
         .then(result => setPickUpAddress(result[0].formatted_address))
         .then(showFirst())

         setPickUpCoord({ lat: pickUpCoord.lat, lng: pickUpCoord.lng })

      }

      //Config options for autocomplete Api
      const searchOptions = {
         location: new google.maps.LatLng(pickUpCoord.lat, pickUpCoord.lng),
         radius: 50000,
         types: ['address'],
         componentRestrictions: { country: "ng" },
         strictBounds: true

      }


      return (

         <Box style={{ height: '100vh' }}>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', boxShadow: '0px 0px 0px 0px' }}>
               <Toolbar >
                  <IconButton edge="start"  color="inherit" aria-label="menu" onClick={showFirst}>
                     <ArrowBackIos />
                     <Typography variant="subtitle1" >
                        Back
                  </Typography>
                  </IconButton>

                  <Typography variant="h5" style={{ flexGrow: 1, textAlign: "center", display: "flex", justifyContent: "center"}}>
                     Pickup &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Typography>

               </Toolbar>
            </AppBar>

            {/* Dynamic content to display input for either data from the autocomplete function or from the database */}
            {  mine === 'contents'
               ?
               <Box mx={2}>
                  <TextField
                     variant='filled'
                     defaultValue={pickUpAdd}
                     fullWidth
                     autoFocus
                     {...{
                        placeholder: 'Pickup address',
                        className: 'location-search-input',
                     }}
                     onFocus={e => checker(e)}
                     onChange={e => handleChangePick(e.target.value)}
                  />
                  {tData.map(loc => {
                     return (<Box my={2}  >
                        <ListItem style={{ borderBottom: '1px solid #f1f1f1' }} onClick={() => handlePickFromDB(loc)} >
                           <ListItemAvatar>
                              <Avatar>
                                 <LocationOn />
                              </Avatar>
                           </ListItemAvatar>
                           <ListItemText primary={loc.main} secondary={loc.sec} />
                        </ListItem>
                     </Box>)
                  }
                  )
                  }
               </Box>
               :
               <PlacesAutocomplete
                  value={pickUpAdd}
                  onChange={handleChangePick}
                  onSelect={handleSelectPick}
                  searchOptions={searchOptions}
               >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                     <Box mx={2}>
                        <TextField
                           variant='filled'
                           autoFocus
                           defaultValue={pickUpAdd}
                           fullWidth
                           {...getInputProps({
                              placeholder: 'Pickup address',
                              className: 'location-search-input',
                           })}


                        />
                        <div style={{ display: pickFromCurrent }} onClick={selectFromCurrent}>
                           <ListItem style={{ borderBottom: '1px solid #f5f5f9' }}>
                              <ListItemAvatar>
                                 <Avatar>
                                    <LocationOn />
                                 </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Current Location" secondary="Pick up from current location" />
                           </ListItem>
                        </div>

                        <div className="autocomplete-dropdown-container">
                           {loading && <div>Loading...</div>}
                           {<List>
                              {suggestions.map(suggestion => {
                                 suggestionCapture.push({
                                    desc: suggestion.description,
                                    main: suggestion.formattedSuggestion.mainText,
                                    sec: suggestion.formattedSuggestion.secondaryText
                                 })

                                 const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';

                                 const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };



                                 return (
                                    <div
                                       {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                       })}
                                    >
                                       <ListItem style={{ borderBottom: '1px solid #f5f5f9' }}>
                                          <ListItemAvatar>
                                             <Avatar>
                                                <LocationOn />
                                             </Avatar>
                                          </ListItemAvatar>
                                          <ListItemText primary={suggestion.formattedSuggestion.mainText} secondary={suggestion.formattedSuggestion.secondaryText} />
                                       </ListItem>
                                    </div>
                                 );
                              })}


                           </List>}

                        </div>
                     </Box>
                  )}
               </PlacesAutocomplete>}
         </Box>
      )
   }


   //conditional statement to determine which screen to be displayed per time

   let screenShown;

   if (screen === 'first') {
      screenShown = firstPage()
   } else if (screen === 'pickUp') {
      screenShown = pickUp()
   } else if (screen === 'dropOff') {
      screenShown = dropOff()
   } else {
      screenShown = firstPage()
   }

   return (
      <div>
         { screenShown}

      </div>
   )

}

export default MainPage;
