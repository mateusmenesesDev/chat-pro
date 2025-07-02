import Image from "next/image";
import authHero from "public/auth-hero.jpg";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import LoginOptions from "~/features/auth/components/LoginOptions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <Image
            src={authHero}
            alt="Premium Chat Experience"
            width={500}
            height={500}
            className="shadow-premium h-full w-full rounded-2xl object-cover"
          />
        </div>

        <div className="animate-slide-up mx-auto w-full max-w-md">
          <Card className="shadow-elegant bg-card/80 border-0 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="bg-primary animate-pulse-glow mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <svg
                  className="text-primary-foreground h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold">
                Welcome to ChatPro
              </CardTitle>
              <CardDescription className="text-base">
                Experience premium messaging designed for professionals
              </CardDescription>
            </CardHeader>
            <LoginOptions />
          </Card>
        </div>
      </div>
    </div>
  );
}
