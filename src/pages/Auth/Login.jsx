import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowUpRight, FiSmartphone } from 'react-icons/fi';
import { IoKeyOutline, IoChevronDownOutline, IoEye, IoEyeOff, IoHardwareChipOutline } from 'react-icons/io5';
import { BsArrowRight } from 'react-icons/bs';
import './login.scss';
import logo from '../../assets/images/logo.png';
import { BiMobileVibration } from 'react-icons/bi';
import { BsKey } from "react-icons/bs";


const demoUsers = [
  { email: 'intelgenz2026@gmail.com', password: 'intelgenz2026', role: 'user' },
  { email: 'intelgenz2025@gmail.com', password: 'intelgenz2025', role: 'user' },
  { email: 'intelgenz2024@gmail.com', password: 'intelgenz2024', role: 'user' },
  { email: 'intelgenz2023@gmail.com', password: 'intelgenz2023', role: 'user' },
  { email: 'intelgenz2022@gmail.com', password: 'intelgenz2022', role: 'user' },
  { email: 'intelgenzadmin@gmail.com', password: 'admin2026', role: 'Admin' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 'otp-verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const isFormValid = email.trim() !== '' && password.trim() !== '';
  const isOtpValid = mobile.trim() !== '';
  const isOtpFull = otp.every(digit => digit !== '');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const userMatch = demoUsers.find(u => u.email === email && u.password === password);

    if (userMatch) {
      localStorage.setItem('is_logged', 'true');
      localStorage.setItem('role', userMatch.role);
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setStep('otp-verify');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="login-container">
      {/* Header */}
      <header className="login-header">
        <div className="logo-section">
          <img src={logo} alt="Threati Logo" className="logo-img" />
        </div>
        <div className="language-selector">
          <span className="lang-icon">EN</span>
          <div className="lang-text-wrapper">
            <span className="lang-label">Language</span>
            <span className="lang-value">English</span>
          </div>
          <IoChevronDownOutline className="dropdown-icon" />
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-content">
          <h1 className="login-title">
            {step === 'login' ? (
              <>Login to your <br /> <span className="brand-text">Intelgenz</span> account</>
            ) : (
              <>Authenticate your <br /> <span className="brand-text">Intelgenz</span> account</>
            )}
          </h1>

          {step === 'login' ? (
            <form className="login-form-wrapper" onSubmit={handleLogin}>
              <div className="inputs-card">
                <div className="input-group">
                  <label>
                    <FiMail className="input-icon" />
                    EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your provided by your organization"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>
                    <BsKey className="input-icon" />
                    PASSWORD
                  </label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IoEyeOff /> : <IoEye />}
                    </button>
                  </div>
                </div>
              </div>

              {error && <div className="error-message" style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>{error}</div>}

              <div className="forgot-password">
                Forgot password? <Link to="/reset">Request reset</Link>
              </div>

              <button
                type="submit"
                className={`login-button ${isFormValid ? 'active' : 'disabled'}`}
                disabled={!isFormValid}
              >
                <BsArrowRight className="arrow-icon-left" /> Log in to Intelgenz
              </button>
            </form>
          ) : null
            //  step === 'otp-request' ? (
            //   <form className="login-form-wrapper" onSubmit={handleRequestOtp}>
            //     <div className="inputs-card otp-card">
            //       <p className="otp-instruction">Enter your mobile number to authenticate your account.</p>
            //       <hr className="otp-divider" />
            //       <div className="input-group">
            //         <label>
            //           <BiMobileVibration className="mobile-icon" />
            //           ENTER MOBILE NUMBER
            //         </label>
            //         <div className="mobile-input-wrapper">
            //           <div className="country-code-selector">
            //             <span>{countryCode}</span>
            //             <IoChevronDownOutline className="cc-dropdown-icon" />
            //           </div>
            //           <input
            //             type="tel"
            //             placeholder="Enter your provided by your organization"
            //             value={mobile}
            //             onChange={(e) => {
            //               const numericValue = e.target.value.replace(/\D/g, '');
            //               setMobile(numericValue);
            //             }}
            //           />
            //         </div>
            //       </div>
            //     </div>

            //     <button
            //       type="submit"
            //       className={`login-button ${isOtpValid ? 'active' : 'disabled'} mt-3`}
            //       disabled={!isOtpValid}
            //     >
            //       <BsArrowRight className="arrow-icon-left me-2" /> Request OTP
            //     </button>
            //   </form>
            // ) : (
            //   <form className="login-form-wrapper animate-slide-up" onSubmit={handleVerifyOtp}>
            //     <div className="inputs-card otp-verify-card">
            //       <p className="otp-instruction">
            //         We have send a four digit OTP to your mobile. You can <br />
            //         resend in <span className="timer-text">00: {timer < 10 ? `0${timer}` : timer}Sec</span>
            //       </p>
            //       <hr className="otp-divider" />
            //       <div className="input-group">
            //         <div className="otp-label-wrapper">
            //           <label>
            //             <span className="dots-icon">***</span>
            //             ENTER OTP
            //           </label>
            //           <IoEyeOff className="otp-eye-icon" />
            //         </div>
            //         <div className="otp-inputs-wrapper">
            //           {otp.map((digit, index) => (
            //             <input
            //               key={index}
            //               id={`otp-input-${index}`}
            //               type="text"
            //               maxLength="1"
            //               placeholder="-"
            //               value={digit}
            //               onChange={(e) => handleOtpChange(index, e.target.value)}
            //               onKeyDown={(e) => handleOtpKeyDown(index, e)}
            //             />
            //           ))}
            //         </div>
            //       </div>
            //     </div>

            //     <button
            //       type="submit"
            //       className={`login-button ${isOtpFull ? 'active' : 'disabled'} mt-3`}
            //       disabled={!isOtpFull}
            //     >
            //       <BsArrowRight className="arrow-icon-left me-2" /> Verify OTP & Authenticate
            //     </button>
            //   </form>
            // )
          }

          {step === 'login' && (
            <p className="terms-text">
              By logging in, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </p>
          )}

          <p className="new-user-text">
            New user? <Link to="/request-access">Request Access <BsArrowRight className="arrow-right-small" /></Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="footer-links">
          <Link to="/data-usage">Data Usage <FiArrowUpRight className="footer-link-icon" /></Link>
          <Link to="/privacy-policy">Privacy <FiArrowUpRight className="footer-link-icon" /></Link>
          <Link to="/support">Support <FiArrowUpRight className="footer-link-icon" /></Link>
        </div>
        <div className="copyright">
          © 2026 Intelgenz all rights reserved
        </div>
      </footer>
    </div>
  );
};

export default Login;