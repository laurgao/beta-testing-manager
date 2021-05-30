import Image from 'next/image'
import {getSession, useSession} from "next-auth/client"
import {GetServerSideProps} from "next";

export default function Home() {
  const [session, loading] = useSession();
  
  // console.log(session); // works
  return (
    <div>
      <p className="text-6xl">Hello world</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
      context.res.setHeader("location", "/auth/sign-in");
      context.res.statusCode = 302;
      context.res.end();
  }

  return {props: {}};
};