/*global google*/
import React, { Component, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField, ListItem, ListItemAvatar, ListItemText, Avatar, List, Input, Button, Card } from '@material-ui/core';
import classes from './firstPage.module.css'
import { ArrowBackIos, Image, Work, BeachAccess, LocationOn, CheckCircleRounded } from '@material-ui/icons';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Link } from 'react-router-dom'
import Success from '../assets/success.jpg'
/* import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'; */
import Map from './map'
import axios from 'axios'




const MainPage = props => {



   const [screen, setScreen] = useState('first')
   const [pickUpAdd, setPickUpAdd] = useState('')
   const [dropOffAdd, setDropOffAdd] = useState('')
   const [pickUpAddress, setPickUpAddress] = useState('')
   const [dropOffAddress, setDropOffAddress] = useState('')
   const [pickUpCoord, setPickUpCoord] = useState('')
   const [dropOffCoord, setDropOffCoord] = useState('')
   const [pickFromCurrent, setPickFromCurrent] = useState('contents')


   const showFirst = () => {
      setScreen('first')
      setPickFromCurrent('contents')
   }

   const showPickup = () => {
      setScreen('pickUp')
   }

   const showDropoff = () => {
      setScreen('dropOff')
   }

   const successfulLookup = position => {
      const { latitude, longitude } = position.coords;

      console.log({ lat: latitude, lng: longitude }); 
      setPickUpCoord({ lat: latitude, lng: longitude })
         
   }

   useEffect(() => {
      window.navigator.geolocation.getCurrentPosition(successfulLookup);
   },[])
   

   const firstPage = (props) => {

      return (

         <Box style={{ height: '100vh' }}>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', boxShadow: '0px 0px 0px 0px' }}>
               <Toolbar align='center'>
                  <Typography variant="h5" fontWeight="fontWeightBold" className={classes.typographyp}>
                     <Box fontWeight="fontWeightBold">
                        Parcel request
                  </Box>
                  </Typography>
               </Toolbar>
            </AppBar>

            <Box display="flex" flexDirection="column" mx={2} >
               <div onClick={showPickup}><TextField id="1" label="Pickup address" variant="filled" margin='normal' fullWidth value={pickUpAddress} /></div>
               <div onClick={showDropoff}><TextField id="2" label="Dropoff address" variant="filled" margin='normal' fullWidth value={dropOffAddress} /></div>

            </Box>

            <Box style={{ height: '100%', backgroundColor: 'blue' }}>
               <Map coord1={pickUpCoord} coord2={dropOffCoord} />

            </Box>   

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

   const dropOff = props => {


      const handleChangeDrop = address => {
         setDropOffAdd(address);
      };

      const handleSelectDrop = address => {
         geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
               setDropOffCoord(latLng)
               setDropOffAddress(address)
               console.log('Success', latLng)
               console.log('Success', address)
               console.log('Success', dropOffCoord)
               console.log('Success', dropOffAddress)
               showFirst()
            })
            .catch(error => console.error('Error', error));

      };

      const searchOptions = {
         location: new google.maps.LatLng(6.59912, 3.24664),
         radius: 50000,
         types: ['address'],
         strictBounds: true
      }


      return (<Box>
         <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', boxShadow: '0px 0px 0px 0px' }}>
            <Toolbar >
               <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={showFirst}>
                  <ArrowBackIos />
                  <Typography variant="subtitle1" >
                     Back
                  </Typography>
               </IconButton>

               <Typography variant="h5" className={classes.typographydp}>
                  Dropoff &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               </Typography>

            </Toolbar>
         </AppBar>
         <PlacesAutocomplete
            value={dropOffAdd}
            onChange={handleChangeDrop}
            onSelect={handleSelectDrop}
            searchOptions={searchOptions}
            strict
         >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
               <div>
                  <TextField
                     variant='filled'
                     defaultValue={dropOffAdd}
                     fullWidth
                     {...getInputProps({
                        placeholder: 'Dropoff address',
                        className: 'location-search-input',
                     })}
                  />
                  <div className="autocomplete-dropdown-container">
                     {loading && <div>Loading...</div>}
                     {<List >
                        {suggestions.map(suggestion => {
                           const className = suggestion.active
                              ? 'suggestion-item--active'
                              : 'suggestion-item';
                           // inline style for demonstration purpose
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
               </div>
            )}
         </PlacesAutocomplete>
      </Box>
      );
   }

   const pickUp = props => {

      const handleChangePick = address => {
         setPickUpAdd(address);
      };

      const checker = (e) => {
         setPickFromCurrent('none')
      };

      const handleSelectPick = address => {
         geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
               setPickUpCoord(latLng)
               setPickUpAddress(address)
               console.log('Success', latLng)
               console.log('Success', address)
               console.log('Success', dropOffCoord)
               console.log('Success', dropOffAddress)
               showFirst()
            })
            .catch(error => console.error('Error', error));
      };

      const selectFromCurrent = () => {
         
         axios(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickUpCoord.lat},${pickUpCoord.lng}&key=AIzaSyAVwufhSaNsbADF3iEEzWtFfQsNsAxgyTU`)
               .then(response => response.data.results)
               .then( result => setPickUpAddress( result[0].formatted_address))
               .then( showFirst() ) 
         
         setPickUpCoord({lat:pickUpCoord.lat,lng: pickUpCoord.lng})

      }

      const searchOptions = {
         location: new google.maps.LatLng(6.59912, 3.24664),
         radius: 50000,
         types: ['address'],
      }


      return (

         <Box style={{ height: '100vh' }}>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', boxShadow: '0px 0px 0px 0px' }}>
               <Toolbar >
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={showFirst}>
                     <ArrowBackIos />
                     <Typography variant="subtitle1" >
                        Back
                  </Typography>
                  </IconButton>

                  <Typography variant="h5" className={classes.typographydp}>
                     Pickup &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               </Typography>

               </Toolbar>
            </AppBar>


            <PlacesAutocomplete
               value={pickUpAdd}
               onChange={handleChangePick}
               onSelect={handleSelectPick}
               searchOptions={searchOptions}
            >
               {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <Box mx={2}>
                     <Input
                        variant='filled'
                        defaultValue={pickUpAdd}
                        fullWidth
                        {...getInputProps({
                           placeholder: 'Pickup address',
                           className: 'location-search-input',
                        })}
                        onFocus={e => checker(e)}
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
                              console.log(suggestion.description)
                              const className = suggestion.active
                                 ? 'suggestion-item--active'
                                 : 'suggestion-item';
                              // inline style for demonstration purpose
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
            </PlacesAutocomplete>
         </Box>
      )
   }

   let screenShown;

   if (screen == 'first') {
      screenShown = firstPage()
   } else if (screen == 'pickUp') {
      screenShown = pickUp()
   } else if (screen == 'dropOff') {
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
