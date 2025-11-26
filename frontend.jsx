const API_URL = "http://localhost:5000";
import React, { useState } from 'react';
import { Eye, EyeOff, Code, GraduationCap, Briefcase, Home, Glasses, Search, Bell, ShoppingBag, Menu, Calendar, FileText, Book, Clock, DollarSign, Target, BarChart3, Settings, Plus } from 'lucide-react';

export default function AuthSystem() {
  const [currentPage, setCurrentPage] = useState('register');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState('');

  const professions = [
    { id: 'student', name: 'Student', icon: GraduationCap },
    { id: 'professional', name: 'Professional', icon: Briefcase },
    { id: 'homemaker', name: 'Home maker', icon: Home },
    { id: 'senior', name: 'Senior citizen', icon: Glasses }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateRegistration = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (registeredUsers.some(user => user.email === formData.email)) {
      newErrors.email = 'Email already registered';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleRegistration = () => {
    const handleRegistration = async () => {
  const newErrors = validateRegistration();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // backend sent error
      setErrors(prev => ({
        ...prev,
        email: data.message || "Registration failed",
      }));
      return;
    }

    alert(`Registration successful! Welcome ${formData.fullName}!`);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setCurrentPage("login");
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
};

  };

  const handleLogin = () => {
    const handleLogin = async () => {
  const newErrors = validateLogin();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({
        email: data.message || "Invalid email or password",
        password: data.message || "Invalid email or password",
      });
      return;
    }

    // save user + token (optional: localStorage)
    setCurrentUser(data.user);
    // localStorage.setItem("token", data.token);

    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setCurrentPage("profession");
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
};

  };

  const handleProfessionSelect = (professionId) => {
    setSelectedProfession(professionId);
  };

  const handleContinue = () => {
    if (selectedProfession) {
      setCurrentPage('dashboard');
    } else {
      alert('Please select a profession to continue');
    }
  };

  const switchToLogin = () => {
    setCurrentPage('login');
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchToRegister = () => {
    setCurrentPage('register');
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (currentPage === 'dashboard' && selectedProfession === 'senior') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Glasses className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Senior Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center">
              <span className="text-white text-lg font-bold">{currentUser?.fullName?.charAt(0) || 'S'}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Good Morning! ☀</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Today's Medications</h3>
              <p className="text-gray-700">3 scheduled reminders</p>
            </div>

            <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-6">
              <Calendar className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Appointments</h3>
              <p className="text-gray-700">Eye Checkup</p>
              <p className="text-sm text-gray-600">Thursday, 3:00 PM</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-2xl p-6">
              <DollarSign className="w-12 h-12 text-cyan-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Bills & Payments</h3>
              <p className="text-gray-700 mb-4">Electricity due in 2 days</p>
              <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg">PAY</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Daily Routine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { time: '7:30 AM', text: 'BP medicine' },
                { time: '1:00 PM', text: 'Lunch Reminder' },
                { time: '8:00 PM', text: 'Diabetes pill' },
                { time: '5:00 PM', text: 'Physiotherapy' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold">{item.time}</p>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                  <div className="w-8 h-8 bg-teal-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard' && selectedProfession === 'homemaker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
        <header className="bg-gradient-to-r from-teal-100 to-blue-100 px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Home Harmony</h1>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center">
            <span className="text-white text-lg font-bold">{currentUser?.fullName?.charAt(0) || 'H'}</span>
          </div>
        </header>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Good Morning, {currentUser?.fullName?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-gray-600 text-lg mb-6">Let's make today smooth and stress-free.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl p-6 text-white">
              <h3 className="text-lg mb-2">Tasks Today</h3>
              <p className="text-4xl font-bold">6</p>
            </div>

            <div className="bg-gradient-to-br from-red-300 to-red-400 rounded-3xl p-6 text-white">
              <h3 className="text-lg mb-2">Low Grocery Items</h3>
              <p className="text-4xl font-bold">4</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-6">
              <h3 className="text-lg mb-2">Upcoming Bills</h3>
              <p className="text-4xl font-bold">₹1,480</p>
            </div>

            <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-3xl p-6">
              <h3 className="text-lg mb-2">Family Events</h3>
              <p className="text-4xl font-bold">2</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6">Today's Timeline</h3>
            <div className="space-y-4">
              {[
                'Prepare breakfast',
                'Drop kids at school',
                'Buy vegetables',
                'Pay electricity bill'
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-teal-400 rounded-full"></div>
                  <p className="font-medium">{task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard' && selectedProfession === 'professional') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Professional Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-700" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
              <span className="text-white font-bold">{currentUser?.fullName?.charAt(0) || 'P'}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-3xl font-bold mb-4">Hello 👋</h2>
            <p className="text-gray-600 mb-4">Today you have:</p>
            <div className="flex gap-6 mb-6">
              <span>5 tasks</span>
              <span>2 meetings</span>
              <span>3 deadlines</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Task</button>
              <button className="px-4 py-2 border rounded-lg">Create Meeting</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold mb-4">Today's Meetings</h3>
              <div className="space-y-3">
                {['Client Proposal Review', 'Internal Sprint Sync', 'Budget Planning'].map((m, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">{m}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold mb-4">Active Projects</h3>
              <div className="space-y-3">
                {['Vision Design Update', 'HRMS Portal Deployment', 'Payment Gateway Testing'].map((p, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-2">Work Completed: 72%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <p className="text-sm">Avg. Daily Focus: 5.2 hrs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Student Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-700" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
              <span className="text-white font-bold">{currentUser?.fullName?.charAt(0) || 'S'}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Hello, {currentUser?.fullName} 👋
            </h2>
            <p className="text-gray-600 mb-6">You have:</p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span>3 assignments</span>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <span>2 reminders</span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5" />
                <span>1 exam this week</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center gap-2">
                <Code className="w-4 h-4" />
                Ask AI
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Reminders & Exams</h3>
              <div className="space-y-3">
                {['Internal Exam – 8 Days ⏳', 'Fees Payment – 2 Days 💳', 'Library Card – Monday 🔖'].map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                {[
                  { time: '10:00', text: 'DBMS Lecture' },
                  { time: '12:00', text: 'Mini Project Review' },
                  { time: '2:00', text: 'OOPS Tutorial' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{item.time}</p>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'profession') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Select your profession
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {professions.map((profession) => {
              const Icon = profession.icon;
              const isSelected = selectedProfession === profession.id;
              
              return (
                <button
                  key={profession.id}
                  onClick={() => handleProfessionSelect(profession.id)}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all ${
                    isSelected ? 'ring-4 ring-gray-800 scale-105' : ''
                  }`}
                >
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-12 h-12 ${isSelected ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 text-center">
                    {profession.name}
                  </h3>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleContinue}
            className="w-full max-w-md mx-auto block bg-gray-800 text-white py-4 px-8 rounded-full text-xl font-semibold hover:bg-gray-900 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-xl mb-4">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {currentPage === 'login' ? 'Sign In' : 'Registration'}
            </h1>
            <p className="text-gray-500 text-sm">
              {currentPage === 'login' ? 'Welcome back! Please login to continue' : 'Create your account to get started'}
            </p>
          </div>

          <div className="space-y-5">
            {currentPage === 'register' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-gray-800`}
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-gray-800`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-gray-800`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {currentPage === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-gray-800`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              onClick={currentPage === 'login' ? handleLogin : handleRegistration}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              {currentPage === 'login' ? 'Sign In' : 'Register'}
            </button>

            <div className="text-center">
              <button
                onClick={currentPage === 'login' ? switchToRegister : switchToLogin}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                {currentPage === 'login' 
                  ? "Don't have an account? Register" 
                  : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}