import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import H1 from "../components/H1";
import PrimaryButton from "../components/PrimaryButton";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <div className="text-center">
      <H1>Beta Testing Manager</H1>
      <p>An all-in-one tool for keeping track of beta testers</p>
      <PrimaryButton>Superpower your startup</PrimaryButton>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
      context.res.setHeader("location", "/projects");
      context.res.statusCode = 302;
      context.res.end();
  }

  return {props: {}};
};