import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin-portal');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" style={{ backgroundImage: 'url("/tactical_login_bg_1777046483593.png")' }}></div>
      <div className="login-overlay"></div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="security-badge">
              <ShieldAlert size={24} className="text-primary" />
              <span>SECURE_ACCESS / AUTH_V1.0</span>
            </div>
            <h1>ADMIN_LOG_IN</h1>
            <p>Access restricted to authorized Ordal personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-group">
              <label>IDENTIFIER_EMAIL</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Enter authorized email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="login-input-group">
              <label>ACCESS_KEY</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter secret key" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">ERROR: {error.toUpperCase()}</div>}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "INITIATE_SESSION"}
            </button>
          </form>

          <div className="login-footer">
            <div className="red-line-accent"></div>
            <span>IP_LOGGED // SYSTEM_STANDBY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
