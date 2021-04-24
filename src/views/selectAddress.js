/*global google*/
import React, { Component, useState } from 'react';
import PlacesAutocomplete, {
   geocodeByAddress,
   getLatLng
} from 'react-places-autocomplete';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField, ListItem, ListItemAvatar, ListItemText, Avatar, List } from '@material-ui/core';
import axios from 'axios';
import { ContactSupportOutlined } from '@material-ui/icons';


const LocationSearchInput = (props) => {

   const [address, setAddress] = useState('')

   const handleChange = address => {
      setAddress(address);
   };

   const handleSelect = address => {
      geocodeByAddress(address)
         .then(results => getLatLng(results[0]))
         .then(latLng => console.log('Success', latLng))
         .catch(error => console.error('Error', error));
   };

   const searchOptions = {
      location: new google.maps.LatLng(6.59912, 3.24664),
      radius: 50000,
      types: ['address'],
      strictBounds: true
   }

   if (window.navigator.geolocation) {
      const successfulLookup = position => {
         const { latitude, longitude } = position.coords;
         
         console.log({latitude, longitude})

         axios(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAVwufhSaNsbADF3iEEzWtFfQsNsAxgyTU`)
            .then(response => response )

      }

      const result = window.navigator.geolocation.getCurrentPosition(successfulLookup);
   }


   return (
      <PlacesAutocomplete
         value={address}
         onChange={handleChange}
         onSelect={handleSelect}
         searchOptions={searchOptions}
         strict
      >
         {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
            return (
               <div>
                  <TextField
                     variant='filled'
                     fullWidth
                     {...getInputProps({
                        placeholder: 'Dropoff address',
                        className: 'location-search-input',
                     })}
                  />
                  <div className="autocomplete-dropdown-container">
                     {loading && <div>Loading...</div>}
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
                              <span>{suggestion.description}</span>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )
         }}
      </PlacesAutocomplete>
   );

}

export default LocationSearchInput;
