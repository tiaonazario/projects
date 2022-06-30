import { initializeApp } from 'firebase/app';
import { config } from './config/config';

import { AppRoutes } from "./Routes"
initializeApp(config.firebaseConfig);

function App() {

  return (
    <AppRoutes />
  )
}

export default App
