/*global google*/
import React, { Component, useState, useEffect } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import Popper from '@material-ui/core/Popper';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { NavigateNext } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
   popover: {
      pointerEvents: 'none',
   },
   paper: {
      padding: theme.spacing(1),
   },
}));


const MapContainer = props => {


   let centered = props.coord1

   if (props.coord1 && props.coord2) {
      const latt = (props.coord1.lat + props.coord2.lat) / 2
      const lngg = (props.coord1.lng + props.coord2.lng) / 2

      centered = { lat: latt, lng: lngg }
      console.log(centered)
   }

   return (

      <Map
         google={props.google}
         zoom={11.5}
         initialCenter={centered}
         center={
            centered
         }
      >
         <Polyline
            path={[props.coord1, props.coord2]}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
         />

         
        
         <Marker
            name={'Current location'}
            position={props.coord1}
            id={1}
            onClick={console.log('clickabe')}
         />
         
         <Marker
            name={'Current location'}
            position={props.coord2}
         />


         <InfoWindow
            position={{lat: 6.4565958, lng: 3.4268872}}
            visible={true}
         >
            <div>
               Pickup <NavigateNext />
            </div>
         </InfoWindow>

         <InfoWindow
            position={props.coord2}
            visible={true}
         >
            <div>
               Dropoff <NavigateNext />
            </div>
         </InfoWindow>

      </Map >
   );

}

export default GoogleApiWrapper({
   apiKey: ('AIzaSyAVwufhSaNsbADF3iEEzWtFfQsNsAxgyTU')
})(MapContainer)