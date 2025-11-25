import LoginPage from "@/features/Dashboard/SignIn/pages/SignInPage";

const SignInPage = ({
  searchParams,
}: {
  searchParams: { error?: string };
}) => {
  return (
    <>
      <LoginPage searchParams={searchParams} />
    </>
  );
};

export default SignInPage;

