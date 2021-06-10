import React from 'react'
import { signOut, useSession } from 'next-auth/client'
import Link from "next/link";
import MenuButton from "./MenuButton";
import InlineButton from './InlineButton';

const Navbar = () => {
    const [session, loading] = useSession();
    return (
        <nav className="w-full bg-white sticky items-center mb-8 top-0 z-30 flex border-b-2 px-8">
            <div className="max-w-7xl h-16 flex items-center mr-auto my-auto">
                <Link href={session ? "/projects" : "/"}><a><p className="text-2xl font-bold">BTM</p></a></Link>
            </div>
            {session && ( 
                <>
                    <button className="relative up-hover-button ml-auto">
                        <div className="flex items-center">
                            <img
                                src={session.user.image}
                                alt={`Profile picture of ${session.user.name}`}
                                className="w-10 h-10 ml-2 rounded-full"
                            />
                        </div>
                        <div className="up-hover-dropdown mt-10">
                            <MenuButton text="Sign out" onClick={signOut}/>
                        </div>
                    </button>
                </>
            )}

            {!session && (
                <>
                    <InlineButton href="/auth/sign-in">Sign in</InlineButton>
                </>
            )}    
        </nav>
    )
}

export default Navbar
