import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
import UpdateSpotForm from "./components/UpdateSpotForm";
import LandingPage from "./components/LandingPage";
import ManageSpots from "./components/ManageSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path='/'>
            <LandingPage />
          </Route>
          <Route path='/spots/new'>
            <CreateSpotForm />
          </Route>
          <Route path='/spots/current'>
            <ManageSpots />
          </Route>
          <Route path='/spots/:id'>
            <SpotDetails />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
