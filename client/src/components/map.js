import MapGL, {Marker} from 'react-map-gl';
import {useState, useMemo, useEffect, Fragment} from 'react';
import axios from 'axios';
import Pin from "./pin";
import PinModal from './pinModal'
import CreatePinModal from './createPinModal'
import { useAuthentication } from "../context/authenticationContext";


function Map() {
    const { authentication } = useAuthentication();
    const [selectedPin, setSelectedPin] = useState(null);
    const [markersData, setMarkers] = useState({ objects: []});
    const [hasDoubleClicked, setDoubleClick] = useState(false);
    const [createPinModal, setCreatePinModal] = useState(null);
    const [tmpMarker, setTmpMarker] = useState(null);
    const PinSetter = (pin) => setSelectedPin(pin);
    const PinCloser = () => setSelectedPin(null);
    const CreatePinCloserAndRemove = () => {
        setTmpMarker(null)
        setCreatePinModal(null)
    }; 
    const createPinCloser = () => setCreatePinModal(null);
    
    useEffect( () => {
        if(authentication.isAuthenticated != null){
            getMarkers()
        }
      }, [authentication]);


    const getMarkers = async () => {
        await axios.get('/pin?approved=true')  
        .then(res => {  
            setMarkers({
            objects: [...res.data.entries]
            });
        }).catch(err => {
            // Error alert 
        });  
    }  

    const addPin = (event) => {
        setDoubleClick(true);
        const [ lng, lat ] = event.lngLat;
        const info = { id: "", type: 'Tmp', longitude: lng, latitude: lat}
        setTmpMarker(info);
        setCreatePinModal(true)
    };

    // useMemo as to cache function in case of alot of pins
    const markers = useMemo(() => markersData.objects.map(
        pin => (
            <Marker key={pin.id} longitude={pin.longitude} latitude={pin.latitude} >                
                <Pin PinSetter={PinSetter} info={pin} />
            </Marker>
        ),
    ), [markersData.objects]);
    
    const [viewport, setViewport] = useState({
        latitude: 45.4211,
        longitude: -75.6903,
        zoom: 5,
    });

    return (
        <div>
            {hasDoubleClicked === false &  authentication.isAuthenticated === false ? 
                <div className="adjust-left"><h3>Double-click anywhere on the map to add a pin📌</h3></div> : 
                null
            }         
            <Fragment>
                <MapGL
                    {...viewport}
                    width='100vw'
                    height='100vh'
                    onViewportChange={viewport => {setViewport(viewport)}}
                    mapStyle="mapbox://styles/sunrisepulp/ckkwxncdl5iph17nzmy5cexbm"
                    mapboxApiAccessToken={process.env.REACT_APP_API_KEY}
                    onDblClick={addPin}
                    doubleClickZoom={false}
                >
                {markers}
                {tmpMarker  ? <Marker key={tmpMarker.id} longitude={tmpMarker.longitude} latitude={tmpMarker.latitude} >                
                                <Pin PinSetter={PinSetter} info={tmpMarker} />
                              </Marker> : null}
                {selectedPin  ? <PinModal info={selectedPin} show={selectedPin} close={PinCloser} /> : null}
                {createPinModal  ? <CreatePinModal info={tmpMarker} 
                                   closeOnly={createPinCloser} setters={setTmpMarker} 
                                   show={createPinModal} close={CreatePinCloserAndRemove} /> 
                                   : null}
            </MapGL>
            </Fragment>
        </div>
    )
} 

export default Map;