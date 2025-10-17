import type { Route } from "./+types/login";
import { SignIn } from "@clerk/react-router";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In - Creator Pool" },
    { name: "description", content: "Sign in to your Creator Pool account." },
  ];
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Creator Pool
            </span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/signup"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-purple-600 hover:bg-purple-700 text-sm normal-case",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                formFieldInput:
                  "border-gray-300 focus:border-purple-500 focus:ring-purple-500",
                footerActionLink: "text-purple-600 hover:text-purple-500",
              },
            }}
            routing="hash"
            signUpUrl="/signup"
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
