"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ModeToggle } from '@/components/theme/next-theme';
import { useSession, signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader';
import axios from 'axios';
import { cn } from '@/lib/utils';

const RegisterPage = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setLoading] = useState(false)

  const router = useRouter()

  const { data: session } = useSession()
  const [pageIsLoading, setpageIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      setpageIsLoading(true)
      router.push("/")
      setpageIsLoading(false)
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", {
        username, email, password
      });
      if (data.success) {
        signIn("credentials", {
          email, password
        })
      }
    } catch (error: any) {
      if (error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {pageIsLoading ? (
        <Loader />
      ) : (
        <section className='grid place-content-center h-screen'>
          <div className='relative top-[-40px]'>
            <ModeToggle />
          </div>
          <div className='dark:bg-gray-800 shadow-lg p-5 rounded-lg border-t-4 border-green-500'>
            <h1 className='text-xl font-bold my-4'>Register</h1>

            <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
              <input
                className='w-[400px] sm:w-[500px] border border-gray-200 py-2 px-4 bg-transparent font-normal'
                type="text"
                placeholder='Full Name'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className='w-[400px] sm:w-[500px] border border-gray-200 py-2 px-4 bg-transparent font-normal'
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className='w-[400px] sm:w-[500px] border border-gray-200 py-2 px-4 bg-transparent'
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className={cn(
                'bg-green-600 text-white font-bold cursor-pointer px-6 py-2',
                isloading ? "bg-transparent" : "bg-green-600"
              )} disabled={isloading}>
                {isloading ?
                  <div className={cn(
                    "flex gap-2 items-center justify-center ml-6",
                  )}>
                    <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                    <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                    <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                  </div> :
                  "Register"
                }
              </button>
              <div className='flex items-center'>
                <div className='flex w-full h-[1px] bg-sky-600'></div>
                <p className='text-sm mb-1 px-4'>or</p>
                <div className='w-full h-[1px] bg-sky-600'></div>
              </div>
            </form>
            <div className='flex flex-col gap-3'>
              <button
                onClick={() => signIn("google", { callbackUrl: '/' })}
                className='dark:text-white dark:hover:bg-sky-600 dark:border-slate-900 bg-transparent text-black border hover:bg-gray-300 transition duration-200 py-3 px-5 rounded-full text-sm w-full flex items-center justify-center gap-3'
              >
                <FcGoogle className='text-2xl ' />
                Sign up with google
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: '/' })}
                className='dark:text-white dark:hover:bg-sky-600 dark:border-slate-900 bg-transparent text-black border hover:bg-gray-300 transition duration-200 py-3 px-5 rounded-full text-sm w-full flex items-center justify-center gap-3'
              >
                <FaGithub className='text-2xl' />
                Sign up with Github
              </button>

            </div>

            {error && <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
              {error}
            </div>}
            <Link className='text-sm mt-3 flex items-center justify-end' href={`/login`}>
              Already have an account?
              <span className='underline ml-1'>
                Login
              </span>
            </Link>
          </div>
        </section>
      )
      }
    </>
  )
}

export default RegisterPage