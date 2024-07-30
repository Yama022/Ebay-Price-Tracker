import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/authContext';
import { getUserData, updatePassword } from '../services/firebaseService.mjs';
import Header from '../components/Header';

const ProfilePage = () => {
    const router = useRouter();
    // const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, login, logout } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            getUserData(user.uid)
                .then((userData) => {
                    setEmail(userData.email);
                    setUsername(userData.username);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [user, router]);

    const handlePasswordUpdate = () => {
        setIsLoading(true);
        updatePassword(user?.uid, newPassword)
            .then(() => {
                setNewPassword('');
                setIsLoading(false);
                alert('Password updated successfully!');
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('Error updating password:', error);
                alert('Failed to update password. Please try again later.');
            });
    };

    return (
        <div>
            <Header />
            <h1>Profile</h1>
            <p>Email: {email}</p>
            <p>Username: {username}</p>
            <div>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handlePasswordUpdate} disabled={isLoading}>
                    Update Password
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;