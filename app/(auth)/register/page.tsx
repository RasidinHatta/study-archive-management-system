import RegisterForm from "@/components/auth/forms/RegisterForm";

/**
 * Registration Page Component
 * 
 * This is a server-side rendered page that simply renders the RegisterForm component.
 * It serves as the route handler for the registration page (/register).
 * 
 * Note: Despite being an async component, it doesn't perform any data fetching
 * currently, but the async designation allows for easy addition of server-side
 * operations in the future if needed.
 */
const Page = async () => {
  return (
    <RegisterForm/>
  );
};

export default Page;