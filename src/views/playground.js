/*global google*/
import React, { useState, useEffect } from 'react';
import Popover from '@material-ui/core/Popover';
import classes from './firstPage.module.css'
import { AppBar, Toolbar, Typography, IconButton, Box, TextField, ListItem, ListItemAvatar, ListItemText, Avatar, List, Input, Button, Card } from '@material-ui/core';
import { ArrowBackIos, Image, Work, BeachAccess, LocationOn, CheckCircleRounded } from '@material-ui/icons';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import testData from './playData'

const MouseOverPopover = () => {


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
   const [saveDataMn, setSaveDataMn] = useState([])


   const suggestionCapture = []

   const tester = testData;


   const datafeed = async () => {
      const newSetz = await axios.get('http://localhost/gokadaApi/api/suggestions')
      return newSetz.data
   }







   useEffect(async () => {
      const newSetz = await axios.get('http://localhost/gokadaApi/api/suggestions')
      setNewSet(newSetz.data)

      /* context = canvas.current.getContext("2d");
      drawCircle(context, coordinateX, coordinateY);
      return context;
       */
   }, []);

   console.log(newSet);



   let saveDataM = []


   const uniqueSuggestion = () => {

      let uniqueSugggestionsData = Array.from(new Set(suggestionCapture.map(JSON.stringify))).map(JSON.parse)
      console.log(uniqueSugggestionsData)

      const saveData = uniqueSugggestionsData.map(sugData => {

         let dataCoord;

         geocodeByAddress(sugData.desc)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
               saveDataM.unshift({ "address": sugData.desc.toLowerCase(), "main": sugData.main, "sec": sugData.sec, "lat": latLng.lat, "lng": latLng.lng })
               dataCoord = { lat: latLng.lat, lng: latLng.lng }
               return saveDataM;
            })
            /* .then( result => result[-1]) */
            .then(result => result[0])
            .then(result => axios.post('http://localhost/gokadaApi/api/suggestions', result))
            .then(result => console.log(result))
            .catch(error => console.error('Error', error));

         /* console.log(dataCoord) */

         return saveDataM
      })

      return saveDataM
   }
   /*
   fetch("https://bamziapi.ivyarc.com/api/productCart", {
         /* fetch("http://localhost/bamzi/api/productCart", { 
         method: "POST",
         headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            id: cartItem.id,
            productName: cartItem.productName,
            productPrice: cartItem.productPrice,
            active: cartItem.active,
            productQuantity: cartItem.productQuantity,
            productSize: cartItem.productSize,
            productColor: cartItem.productColor,
            productOwner: cartItem.productOwner,
            userId: window.localStorage.getItem("userEmail"),
            productImage1: cartItem.productImage1,
            productImage2: cartItem.productImage2,
            productImage3: cartItem.productImage3
         })
      }) 

   let operations;

   useEffect(() => {
      operations = saveDataMn.map( record => axios.post('http://localhost/gokadaApi/api/suggestions', record))

      console.log(operations)

   }, [saveDataMn]) */

   const letsSee = async () => {

      const wait = uniqueSuggestion()

      /* .then(response => {
         const ops = response.map( record => axios.post('http://localhost/gokadaApi/api/suggestions', record)) 
         return console.log(ops)
      })
       */

   }

   const work = (saveDataM) => axios.post('http://localhost/gokadaApi/api/suggestions', saveDataM[0])

   /* 
   forEach(record => {
   axios.post('http://localhost/gokadaApi/api/suggestions', record)
   console.log('work is working')
   console.log(saveDataM) 
})*/


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
   }, [])



   const checker = () => {
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
         .catch(error => console.error('Error', error))


   };

   const selectFromCurrent = () => {

      axios(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickUpCoord.lat},${pickUpCoord.lng}&key=AIzaSyAVwufhSaNsbADF3iEEzWtFfQsNsAxgyTU`)
         .then(response => response.data.results)
         .then(result => setPickUpAddress(result[0].formatted_address))
         .then(showFirst())

      setPickUpCoord({ lat: pickUpCoord.lat, lng: pickUpCoord.lng })

   }

   const searchOptions = {
      location: new google.maps.LatLng(6.59912, 3.24664),
      radius: 50000,
      types: ['address'],
   }

   const handleChangePick = address => {

      checker()
      const laddress = address.toLowerCase();

      const ours = newSet.filter(test => test.address.includes(laddress))


      if (ours.length == 0) {
         setPickUpAdd(address);
         setMine('none')
      } else {
         setMine('contents')
         setPickUpAdd(address);
         setTdata(ours)
      }

   };


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


         <Button onClick={letsSee}>Run Functions</Button>
         <Button onClick={() => work(saveDataM)}>Run Functions</Button>


         {  mine == 'contents'
            ?
            <Box mx={2}>
               <Input
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
               {tData.map(loc =>
                  <Box my={2}>
                     <ListItem style={{ borderBottom: '1px solid #f1f1f1' }}>
                        <ListItemAvatar>
                           <Avatar>
                              <LocationOn />
                           </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={loc.Main} secondary={loc.Sec} />
                     </ListItem>
                  </Box>
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
                              console.log(suggestion.description)
                              suggestionCapture.push({
                                 desc: suggestion.description,
                                 main: suggestion.formattedSuggestion.mainText,
                                 sec: suggestion.formattedSuggestion.secondaryText
                              })

                              console.log(suggestionCapture)
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
            </PlacesAutocomplete>}


      </Box>
   )

}

export default MouseOverPopover;