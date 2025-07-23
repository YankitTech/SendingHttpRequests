import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]); //data state
  const [IsFetching, setIsFetching] = useState(false); // fetching state
  const [error, setError] = useState(); //error state

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        // update UI and show error to user
        setError({
          message: error.message || "Could not fetch data try again later",
        });
        setIsFetching(false);
      }

      // end loading state either data recieved or error recieved
    }
    fetchPlaces();
  }, []);

  if (error) {
    return (
      <>
        <Error
          title="Error loading data"
          message={error.message}
          onConfirm={""}
        />
      </>
    );
  }

  return (
    <Places
      loadingText="Fetching place data"
      isLoading={IsFetching}
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
