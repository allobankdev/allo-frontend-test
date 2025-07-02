import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, ListRocket } from './pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"
          element={
            <Home />
          } />
        <Route path="/list-rocket/"
          element={
            <ListRocket />
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
