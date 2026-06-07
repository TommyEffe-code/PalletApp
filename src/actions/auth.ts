'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const departmentId = formData.get('departmentId') as String
  const password = formData.get('password') as String

  if (!departmentId || !password) {
    return { error: 'Department and password are required' }
  }

  const department = await prisma.department.findUnique({
    where: { id: departmentId as string },
  })

  if (!department || department.password !== password) {
    return { error: 'Invalid password' }
  }

  const cookieStore = await cookies()
  cookieStore.set('department_id', department.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('department_id')
  redirect('/')
}

export async function getSession() {
  const cookieStore = await cookies()
  const departmentId = cookieStore.get('department_id')?.value

  if (!departmentId) return null

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  })

  return department
}
