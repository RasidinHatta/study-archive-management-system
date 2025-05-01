"use server"
import { auth } from "@/auth"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TwoFactorToggle from "@/components/auth/TwoFactorToggle "

const ProfilePage = async () => {
  const session = await auth()
  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="w-full max-w-md ml-10 bg-muted-foreground text-background"> {/* Align card to the left */}
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.name}!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 text-sm text-background">
          {session?.user?.image && (
            <div className="flex justify-center">
              <Image
                src={session.user.image}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          )}

          <div>
            <p><span className="font-medium">Name:</span> {session?.user?.name || "N/A"}</p>
            <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Two-Factor:</span>
              <TwoFactorToggle initialValue={!!session?.user?.twoFactorEnabled} />
            </div>
            {session?.user?.emailVerified && (
              <p>
                <span className="font-medium">Email Verified:</span>{" "}
                {new Date(session.user.emailVerified).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage