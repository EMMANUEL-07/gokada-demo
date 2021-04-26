/*global google*/
import React from 'react';
import { Map, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
/* import {  InfoWindow } from 'google-maps-react';
import { NavigateNext } from '@material-ui/icons'; */


const MapContainer = props => {


   //This stores the person current location to be used for initial render
   let centered = props.coord1

   //Logic to get center of pickoff and drop off point, to enable both points to be displayed on the screen 
   if (props.coord1 && props.coord2) {
      const latt = (props.coord1.lat + props.coord2.lat) / 2
      const lngg = (props.coord1.lng + props.coord2.lng) / 2

      centered = { lat: latt, lng: lngg }
   }

   return (
      //Map Render function, used the google-maps-react package to help ease workload.
      <Map
         google={props.google}
         zoom={11}
         initialCenter={centered}
         center={
            centered
         }
      >
         {/* Function to display connecting line between pickUp and dropOff */}
         <Polyline
            path={[props.coord1, props.coord2]}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
         />
        
         {/* Function to display marker for user location and also pick up point */}
         <Marker
            name={'Pickup Location'}
            position={props.coord1}
            id={1}

         />
         
         {/* Function to display marker for dropoff point when available */}
         <Marker
            name={'Dropoff Location'}
            position={props.coord2}
         />

         {/* Unfortunately, the InfoWindows meant to display the approprqaite labels didnt function as expected, Sorry I was unable to rectify in stipulated time */}


         {/* <InfoWindow
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
         </InfoWindow> */}

      </Map >
   );

}

export default GoogleApiWrapper({
   apiKey: (['API_KEY_HERE'])
})(MapContainer)