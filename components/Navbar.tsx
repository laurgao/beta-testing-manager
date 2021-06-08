import React from 'react'
import { signOut, useSession } from 'next-auth/client'
import Link from "next/link";
import MenuButton from "./MenuButton";

const Navbar = () => {
    const [session, loading] = useSession();
    return (
        <nav className="w-full bg-white sticky mb-8 top-0 z-30 flex">
            <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
                <Link href="/"><a><p>BTM</p></a></Link>
            </div>
            {session && ( 
                <>
                    <button className="relative up-hover-button">
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
                    <Link href="/auth/sign-in"><button className="button tertiary">Sign in</button></Link>
                </>
            )}    
        </nav>
    )
}

export default Navbar
