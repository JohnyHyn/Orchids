import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();


const ADMIN_EMAILS = [
    'nhuynh1307@gmail.com',
];
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Hàm xử lý sau khi Google trả về thông tin đăng nhập
    const loginWithGoogle = (decodedGoogleData) => {
        const userEmail = decodedGoogleData.email?.toLowerCase();
        const isAdmin = ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === userEmail);

        const loggedInUser = {
            id: decodedGoogleData.sub || Date.now().toString(),
            email: decodedGoogleData.email,
            name: decodedGoogleData.name,
            avatar: decodedGoogleData.picture,
            role: isAdmin ? 'admin' : 'user', // Tự động phân quyền dựa trên email
        };

        setUser(loggedInUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        return loggedInUser;
    };

    // Đăng xuất
    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    // Cập nhật thông tin profile (Task 1: Member can edit his/her information)
    const updateProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
    };
    const isAdmin = Boolean(
        user && ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === user.email?.toLowerCase())
    );
    return (
        <AuthContext.Provider
            value={{
                user,
                isAdmin, // Luôn luôn là true nếu email là nhuynh1307@gmail.com
                isMember: Boolean(user && !isAdmin),
                loginWithGoogle,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);