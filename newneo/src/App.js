// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Home from './Home';
import Account from './Account';
import PetForm from './PetForm';
import PetPage from './PetPage';
import { UserProvider } from './UserContext';

const App = () => {
    const handleRegisterSubmit = (formData) => {
        console.log('Form Data:', formData);
        // Add logic to send registration data to the server
    };

    const handleLoginSubmit = (user) => {
        console.log('User logged in:', user);
        // Add logic to handle user login in your app (e.g., update context)
    };

    const handleLoadAccount = (user) => {
        console.log('User loaded:', user);
        // Add logic to handle user login in your app (e.g., update context)
    };

    const handlePetSubmit = (petName) => {
        console.log('Pet entered:', petName);
        // Add logic to handle user login in your app (e.g., update context)
    };

    return (
        <UserProvider>
            <Router>
                <div>
                    <Header/>
                    <Routes>
                        {/* Default path when website is loaded (Home)*/}
                        <Route path="/" element={<Home />} />
                        
                        {/* other routes */}
                        <Route path="/register" element={<RegisterForm onSubmit={handleRegisterSubmit} />} />
                        <Route path="/login" element={<LoginForm onLogin={handleLoginSubmit} />} />
                        <Route path="/pets" element={<PetForm onSubmit={handlePetSubmit} />} />
                        <Route path="/account" element={<Account onLoad={handleLoadAccount}/>} />
                        <Route path="/petpage" element={<PetPage />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}
export default App;
