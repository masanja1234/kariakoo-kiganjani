import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">Kariakoo Kiganjani</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fungua akaunti mpya — ni bure!</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
