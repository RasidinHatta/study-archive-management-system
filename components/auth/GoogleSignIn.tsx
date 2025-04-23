
import { signIn } from "@/auth"
import { Button } from "../ui/button"

export default function GoogleSignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
    >
      <Button className="w-full" type="submit">
        Sign In With Google
      </Button>
    </form>
  )
} 