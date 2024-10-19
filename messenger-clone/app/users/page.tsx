// 'use client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React from 'react'
import EmptyState from '../components/EmptyState';

const Users = () => {
  // const router = useRouter();
  // const handleLogout = () => {
  //   signOut();
  //   router.push('/users');
  // }
  return (
    <div className='hidden lg:block lg:pl-80 h-full' >
      <EmptyState />
    </div>
  )
}

export default Users