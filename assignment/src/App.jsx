import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
const GOOGLE_CLIENT_ID = "263909778192-4jma5efiopgp4ud14camlg1jrb5m6k7p.apps.googleusercontent.com";
function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </GoogleOAuthProvider>

    )
}
export default App
