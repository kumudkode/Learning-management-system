import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

'use client';

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    await register(email, password, name, role);
    toast.success('Account created successfully!');
    router.push('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    // Provide a user-friendly error message that doesn't depend on API
    toast.error('Failed to create account. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};