import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import InlineButton from "./InlineButton";
import MoreMenu from "./MoreMenu";
import MoreMenuItem from "./MoreMenuItem";

const Navbar = () => {
    const { data: session, status } = useSession()
    return (
        <nav className="w-full bg-white sticky items-center mb-8 top-0 z-30 flex border-b-2 px-8">
            <div className="max-w-7xl h-16 flex items-center mr-auto my-auto">
                <Link href={session ? "/projects" : "/"}><p className="text-2xl font-bold">BTM</p></Link>
            </div>
            {session ? ( 
                <>
                    <MoreMenu
                        customButton={
                            <img
                                src={session.user.image}
                                alt={`Profile picture of ${session.user.name}`}
                                className="w-10 h-10 ml-2 rounded-full"
                            />
                        }
                        openMenuClassName="mt-2"
                    >
                        <MoreMenuItem text="Sign out" onClick={signOut}/>
                    </MoreMenu>
                </>
            ) : status === "loading" ? (
                <p>Loading...</p>
            ) : (
                <InlineButton href="/auth/sign-in">Sign in</InlineButton>
            )}  
        </nav>
    )
}

export default Navbar