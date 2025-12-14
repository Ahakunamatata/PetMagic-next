import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - AIPetLive',
  description: 'Login to AIPetLive to start creating magical pet transformations',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🐾 AIPetLive
          </h1>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-500 mt-4">
          Demo credentials: hackathon / 1214
        </p>
      </div>
    </div>
  );
}
