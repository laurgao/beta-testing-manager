import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import H1 from "../components/H1";
import PrimaryButton from "../components/PrimaryButton";

export default function Home() {
  return (
    <div className="px-4">
      <div className="text-center">
        <H1 className="mb-4">Beta Testing Manager</H1>
        <p className="mb-8 btm-text-gray-500">An all-in-one tool for keeping track of beta testers</p>
        <PrimaryButton href="/auth/sign-in">Superpower your startup</PrimaryButton>
        <img src="/img/hero2.png" alt="Hero image" className="sm:w-2/3 w-full mx-auto mt-12 shadow-lg" />
        <img src="/img/hero4.png" alt="Hero image" className="sm:w-2/3 w-full mx-auto mt-24 mb-24 shadow-lg" />
      </div>
      <footer className="btm-text-gray-400 text-xs mb-4">
        Made with love by <a href="https://lauragao.ca/" className="underline">Laura Gao</a>
      </footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return { redirect: { permanent: false, destination: "/projects", } };
  }

  return { props: {} };
};