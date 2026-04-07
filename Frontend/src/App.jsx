import { Routes, Route } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';
import SignIn from './pages/SignIn';
import Feedback from './pages/Feedback';
import GetInTouch from './pages/GetInTouch';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import WomenService from './pages/WomenService';
import MenService from './pages/MenService';
import MyBooking from './pages/MyBooking';
import ProfileDashboard from './pages/ProfileDashboard';
import SaveAddress from './pages/SaveAddress';
import AddAddress from './pages/AddAddress';
import SelectAddress from './pages/SelectAddress'
import Cart from './pages/Cart';
import Reschedule from './pages/Reschedule';
import About from './pages/About';
import RequestCallback from './pages/RequestCallback';
import ProfileSettings from './pages/ProfileSettings';
import SelectLocation from './pages/SelectLocation';
import SelectSlots from './pages/SelectSlots';
import Checkout from './pages/Checkout';
import SeedDatabase from './pages/SeedDatabase';
import TermsAndPolicy from './pages/TermsAndPolicy';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/" element={<Home />} />
      <Route path="/women-service" element={<WomenService />} />
      <Route path="/men-service" element={<MenService />} />
      <Route path="/about" element={<About />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/contact" element={<GetInTouch />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/terms-and-policy" element={<TermsAndPolicy />} />

      {/* Protected routes — require login */}
      <Route path="/profile-dashboard" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />
      <Route path="/my-booking" element={<ProtectedRoute><MyBooking /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/save-address" element={<ProtectedRoute><SaveAddress /></ProtectedRoute>} />
      <Route path="/add-address" element={<ProtectedRoute><AddAddress /></ProtectedRoute>} />
      <Route path="/select-address" element={<ProtectedRoute><SelectAddress /></ProtectedRoute>} />
      <Route path="/select-location" element={<ProtectedRoute><SelectLocation /></ProtectedRoute>} />
      <Route path="/select-slots" element={<ProtectedRoute><SelectSlots /></ProtectedRoute>} />
      <Route path="/request-callback" element={<ProtectedRoute><RequestCallback /></ProtectedRoute>} />
      <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
      <Route path="/reschedule" element={<ProtectedRoute><Reschedule /></ProtectedRoute>} />
      <Route path="/seed-database" element={<ProtectedRoute><SeedDatabase /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
