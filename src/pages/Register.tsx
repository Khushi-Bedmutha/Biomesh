import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Phone, MapPin, ShieldCheck, CrossIcon, DeleteIcon, Trash } from 'lucide-react';
import { register } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'hospital',
    email: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    contacts: [{ name: '', position: '', email: '', phone: '' }],
    address: '',
    walletAddress: '',
    publicKey: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleContactChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = {
      ...newContacts[index],
      [e.target.name]: e.target.value
    };
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: '', position: '', email: '', phone: '' }]
    });
  };

  const deleteContact = (index: number) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter((_, i) => i !== index)
    });
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await register({
        institutionName: formData.institutionName,
        institutionType: formData.institutionType,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        registrationNumber: formData.registrationNumber,
        contacts: formData.contacts,
        address: formData.address,
      })
      localStorage.setItem('token', response.token);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err: any) {
      console.log("Error during registration: ", err);
    }
    // TODO: Integrate with API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-900">Institution Registration</h2>
          <p className="text-gray-600 mt-2">Create an account for your institution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Institution Name</label>
            <input
              id="institutionName"
              type="text"
              value={formData.institutionName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Institution Type</label>
            <select
              id="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="research_center">Research Center</option>
              <option value="university">University</option>
              <option value="pharma_company">Pharmaceutical Company</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Number</label>
            <input
              id="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>



          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Contact Information</label>
            {formData.contacts.map((contact, index) => (
              <div className=' flex flex-row justify-center items-center'>
                <div onClick={() => deleteContact(index)} className='m-3'>
                  <Trash className='color-red' />
                </div>
                <div key={index} className="grid grid-cols-4 gap-4">

                  <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, e)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    name="position"
                    type="text"
                    placeholder="Position"
                    value={contact.position}
                    onChange={(e) => handleContactChange(index, e)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) => handleContactChange(index, e)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, e)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={addContact} className="text-blue-600">+ Add Contact</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
              <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
              <ShieldCheck className="absolute right-3 top-3 text-gray-400" size={18} />
            </div>
            {formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0 && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">Create Account</button>
        </form>
      </div>
    </div>
  );
}
