import { FaEnvelope, FaShieldAlt, FaLock } from 'react-icons/fa';
import ResetPasswordFlow from './ResetPasswordFlow';

export default function ForgotPassword() {
  return (
      <section className="font-medium text-gray-700 [&_a[href]]:cursor-pointer [&_button:enabled]:cursor-pointer">
        <div className="container py-16 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="hidden lg:block">
              <div className="text-center space-y-6">
                <div className="w-full h-96 bg-linear-to-br from-green-50 via-green-50 to-emerald-50 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-8 left-8 w-24 h-24 rounded-full bg-green-100/50"></div>
                  <div className="absolute bottom-12 right-10 w-32 h-32 rounded-full bg-green-100/50"></div>
                  <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-emerald-100/50"></div>
                  <div className="relative flex flex-col items-center gap-6 z-10">
                    <div className="w-28 h-28 rounded-3xl bg-white shadow-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
                      <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center">
                        <FaLock className="text-green-600 text-4xl" />
                      </div>
                    </div>
                    <div className="absolute -left-16 top-4 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center -rotate-12">
                      <FaEnvelope className="text-green-500 text-xl" />
                    </div>
                    <div className="absolute -right-16 top-8 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center rotate-12">
                      <FaShieldAlt className="text-green-500 text-xl" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse [animation-delay:150ms]"></div>
                      <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse [animation-delay:300ms]"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800">Reset Your Password</h2>
                  <p className="text-lg text-gray-600">
                    Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back
                    into your account in no time.
                  </p>
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaEnvelope className="text-green-600 mr-2" /> Email Verification
                    </div>
                    <div className="flex items-center">
                      <FaShieldAlt className="text-green-600 mr-2" /> Secure Reset
                    </div>
                    <div className="flex items-center">
                      <FaLock className="text-green-600 mr-2" /> Encrypted
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ResetPasswordFlow />
          </div>
        </div>
      </section>
  );
}
