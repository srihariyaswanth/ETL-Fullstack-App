import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Form.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', form);
      alert(res.data.msg);
      const { user } = res.data;
      localStorage.setItem('user', JSON.stringify(user));

     if (user.role === 'Engineer') return navigate('/dashboard/engineer');
else if (user.role === 'Coordinator') return navigate('/dashboard/coordinator');
else if (user.role === 'Incharge') return navigate('/dashboard/incharge');
else if (user.role === 'EIC') return navigate('/dashboard/eic');  
else if (user.role === 'ContractCell') return navigate('/dashboard/contractor');
else if (user.role === 'Admin') return navigate('/dashboard');  
else return navigate('/dashboard');


    } catch (err) {
      alert('Login failed: Invalid credentials');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <Link to="/">Don't have an account? Register</Link>
    </div>
  );
};

export default Login;
