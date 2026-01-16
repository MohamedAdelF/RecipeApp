import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecipeDetails from './pages/RecipeDetails';
import Extracting from './pages/Extracting';
import CookingMode from './pages/CookingMode';
import ShoppingList from './pages/ShoppingList';
import FridgeScan from './pages/FridgeScan';
import Premium from './pages/Premium';

const App: React.FC = () => {
  return (
    <div className="mx-auto max-w-md w-full min-h-[100dvh] bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden relative">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Auth Flow */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main App */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          
          {/* Feature Flows */}
          <Route path="/extracting" element={<Extracting />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/cooking" element={<CookingMode />} />
          <Route path="/fridge-scan" element={<FridgeScan />} />
          <Route path="/premium" element={<Premium />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;