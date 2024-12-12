// import { Card, Col } from "@themesberg/react-bootstrap";
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { getDatabase, ref, onValue, get, off } from "firebase/database";

// export default () => {
//     const location = useLocation();
//     const idPaket = location.pathname.split("/")[3];
//     const [coordinates, setCoordinates] = useState([]);
//     const mapRef = useRef(null);
//     const markersRef = useRef([]);
//     const [isMapReady, setIsMapReady] = useState(false);

//     const initMap = () => {
//         if (coordinates.length > 0 && !mapRef.current) {
//             mapRef.current = new window.google.maps.Map(document.getElementById("map"), {
//                 center: { lat: coordinates[0].latitude, lng: coordinates[0].longitude },
//                 zoom: 12,
//             });

//             markersRef.current[0] = new window.google.maps.Marker({
//                 position: { lat: coordinates[0].latitude, lng: coordinates[0].longitude },
//                 map: mapRef.current,
//                 title: "Incident",
//                 icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
//             });

//             markersRef.current[1] = new window.google.maps.Marker({
//                 position: { lat: coordinates[1].latitude, lng: coordinates[1].longitude },
//                 map: mapRef.current,
//                 title: "User",
//                 icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//             });

//             for (let i = 2; i < coordinates.length; i++) {
//                 markersRef.current[i] = new window.google.maps.Marker({
//                     position: { lat: coordinates[i].latitude, lng: coordinates[i].longitude },
//                     map: mapRef.current,
//                     title: `Responder ${i - 1}`,
//                     icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
//                 });
//             }

//             setIsMapReady(true);
//         }
//     };

//     useEffect(() => {
//         const db = getDatabase();
//         const incidentRef = ref(db, `TNSALERT/PANIC/INCIDENT/${idPaket}`);

//         const listener = onValue(incidentRef, async (snapshot) => {
//             const dataResponse = snapshot.val();

//             if (dataResponse) {
//                 const incidentCoordinates = {
//                     latitude: dataResponse.lokasi.latitude,
//                     longitude: dataResponse.lokasi.longitude,
//                 };

//                 const snapshotUser = ref(db, `TNSALERT/PROFILE/${dataResponse.member_code}/USER`);
//                 onValue(snapshotUser, async (userSnapshot) => {
//                     const dataUser = userSnapshot.val();

//                     if (dataUser && dataUser.lokasi) {
//                         const userCoordinates = {
//                             latitude: dataUser.lokasi.latitude,
//                             longitude: dataUser.lokasi.longitude,
//                         };

//                         let respondersCoordinates = [];
//                         if (Array.isArray(dataResponse.responderlive)) {
//                             const responderPromises = dataResponse.responderlive.map(async (responderId) => {
//                                 const responderRef = ref(db, `TNSALERT/PANIC/RESPONDER/${responderId}/PROFILE`);
//                                 try {
//                                     const responderSnapshot = await get(responderRef);
//                                     const responderData = responderSnapshot.val();
//                                     if (responderData && responderData.lokasi) {
//                                         return {
//                                             id: responderId,
//                                             latitude: responderData.lokasi.latitude,
//                                             longitude: responderData.lokasi.longitude,
//                                         };
//                                     }
//                                 } catch (error) {
//                                     console.error(`Error fetching responder data for ${responderId}:`, error);
//                                 }
//                                 return null;
//                             });

//                             respondersCoordinates = (await Promise.all(responderPromises)).filter(Boolean);
//                         }

//                         setCoordinates([incidentCoordinates, userCoordinates, ...respondersCoordinates]);
//                     }
//                 });
//             }
//         });

//         return () => {
//             off(incidentRef);
//         };
//     }, [idPaket]);

//     useEffect(() => {
//         if (coordinates.length > 0) {
//             if (!isMapReady) {
//                 setTimeout(initMap, 500);
//             } else {
//                 markersRef.current[0].setPosition({
//                     lat: coordinates[0].latitude,
//                     lng: coordinates[0].longitude,
//                 });

//                 markersRef.current[1].setPosition({
//                     lat: coordinates[1].latitude,
//                     lng: coordinates[1].longitude,
//                 });

//                 for (let i = 2; i < coordinates.length; i++) {
//                     if (markersRef.current[i]) {
//                         markersRef.current[i].setPosition({
//                             lat: coordinates[i].latitude,
//                             lng: coordinates[i].longitude,
//                         });
//                     } else {
//                         markersRef.current[i] = new window.google.maps.Marker({
//                             position: { lat: coordinates[i].latitude, lng: coordinates[i].longitude },
//                             map: mapRef.current,
//                             title: `Responder ${i - 1}`,
//                             icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
//                         });
//                     }
//                 }
//             }
//         }
//     }, [coordinates, isMapReady]);

//     return (
//         <Col xl={12} className="mt-2">
//             <Card border="light">
//                 <Card.Body>
//                     <div id="map" style={{ width: '100%', height: '400px' }}></div>
//                 </Card.Body>
//             </Card>
//         </Col>
//     );
// };
