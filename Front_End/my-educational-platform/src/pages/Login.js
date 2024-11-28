import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import '../styles/Login.css';
import { loginStudent, loginCounselor } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (role === 'student') {
                const response = await loginStudent({ email, password });
                const { token, student } = response.data; // Destructure token and student from response
                login(token, student); // Pass both token and student to login
                navigate('/student');
            }
            if (role === 'counselor') {
                const response = await loginCounselor({ email, password });
                const { token, counselor } = response.data; // Destructure token and counselor from response
                login(token, counselor); // Pass both token and counselor to login
                navigate('/counselor');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="welcome-section">
                    <h1>Welcome Back!</h1>
                    <p>Access your educational journey with a single login. Choose your role to continue.</p>
                    <div className="feature">
                        <div className="feature-icon">🔒</div>
                        <div className="feature-text">
                            <h3>Secure Access</h3>
                            <p>Protected data and privacy</p>
                        </div>
                    </div>
                </div>
                <div className="login-form">
                    <div className="role-selector">
                        <button className={`role-button ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>Student</button>
                        <button className={`role-button ${role === 'counselor' ? 'active' : ''}`} onClick={() => setRole('counselor')}>Counselor</button>
                        {/* <button className={`role-button ${role === 'school' ? 'active' : ''}`} onClick={() => setRole('school')}>School</button> */}
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                        </div>
                        {/* <div className="form-footer">
                        <label className="remember-me">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div> */}
                        <button type="submit" className="sign-in-button">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;