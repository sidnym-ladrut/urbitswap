import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Location,
  useLocation,
} from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { CollectionGrid } from '@/app/Views';
import NavBar from '@/app/NavBar';
import { urbitAPI, wagmiAPI } from '@/api';
import { APP_TERM } from '@/constants';
import type { ReactRouterState } from '@/types/urbui';

export function App() {
  return (
    <WagmiConfig config={wagmiAPI}>
      <BrowserRouter basename={`/apps/${APP_TERM}/`}>
        <RoutedApp />
      </BrowserRouter>
    </WagmiConfig>
  );
}

function RoutedApp() {
  const location = useLocation();
  const state = location.state as ReactRouterState;

  return (
    <RoutedAppRoutes state={state} location={location} />
  );
}

// NOTE: This seemingly unnecessary indirection is required to allow modals
// to overlay on top of base paths without causing those base paths to
// re-render their contents.
function RoutedAppRoutes({
  state,
  location,
}: {
  state: ReactRouterState;
  location: Location;
}) {
  return (
    <React.Fragment>
      <Routes location={state?.backgroundLocation || location}>
        <Route element={
          <React.Fragment>
            <header children={<NavBar />} />
            <main className="p-4" children={<Outlet />} />
          </React.Fragment>
        }>
          <Route path="/" element={<CollectionGrid />} />
          <Route path="/item/:itemid" element={<p children="Item" />} />
        </Route>
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/item/:itemid">
            <Route path="bid" element={<p children="Bid" />} />
            <Route path="take" element={<p children="Take" />} />
            <Route path="cancel" element={<p children="Cancel" />} />
          </Route>
        </Routes>
      )}
    </React.Fragment>
  );
}
