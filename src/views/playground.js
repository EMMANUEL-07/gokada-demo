import React from 'react';
import Popover from '@material-ui/core/Popover';
import { Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'

const MouseOverPopover = () => {

   const getSuggestions = (e) => {
      const input = e.target.value;
      console.log(input)

      axios(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&radius=50000&latlng=6.59912,3.24664&strictbounds&key=AIzaSyAVwufhSaNsbADF3iEEzWtFfQsNsAxgyTU`)
      .then(response => console.log(response))
   }


   return (
      <div>
         <TextField variant='filled' onChange={(e) => getSuggestions(e)} />
      </div>
   );
}

export default  MouseOverPopover;