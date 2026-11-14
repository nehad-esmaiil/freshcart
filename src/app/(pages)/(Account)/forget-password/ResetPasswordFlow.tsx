'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheck, FaEnvelope, FaEye, FaEyeSlash, FaKey, FaLock, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { toast, Bounce } from 'react-toastify';
import { forgotPasswords, resetPassword, verifyResetCode } from '@/actions/auth.action';
import { forgotPasswordSchema, otpSchema, ResetPasswordSchema } from '@/schemas/auth.schema';

const inputStyle = 'w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 outline-none transition-all focus:border-[#22c55e] focus:ring-2 focus:ring-[#dcfce7]';
const buttonStyle = 'w-full rounded-xl bg-[#16a34a] px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#15803d] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50';
const linkStyle = 'inline-flex items-center gap-2 text-sm font-medium text-[#16a34a] hover:text-[#15803d]';
const iconStyle = 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400';
const toastOptions = { autoClose: 3000, closeOnClick: true, draggable: true, theme: 'light' as const, transition: Bounce };
const messages = ['Reset code sent to your email!', 'Code verified!', 'Password reset successfully!'];
const titles = ['Forgot Password?', 'Check Your Email', 'Create New Password'];
const busyLabels = ['Sending Code...', 'Verifying...', 'Resetting Password...'];
const submitLabels = ['Send Reset Code', 'Verify Code', 'Reset Password'];

export default function ResetPasswordFlow() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const result = step === 0 ? forgotPasswordSchema.safeParse({ email })
      : step === 1 ? otpSchema.safeParse({ otp: code })
      : ResetPasswordSchema.safeParse({ ...fields, email });
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])));
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const response = step === 0 ? await forgotPasswords({ email })
        : step === 1 ? await verifyResetCode({ otp: code })
        : await resetPassword(ResetPasswordSchema.parse({ ...fields, email }));
      if (!response.ok) {
        toast.error(response.error || 'Something went wrong. Please try again.', toastOptions);
        return;
      }
      toast.success(messages[step], toastOptions);
      setStep(step + 1);
    } catch {
      toast.error('Something went wrong. Please try again.', toastOptions);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await forgotPasswords({ email });
      if (response.ok) {
        setCode('');
        setErrors({});
        toast.success('New code sent!', toastOptions);
      } else toast.error(response.error || 'Something went wrong. Please try again.', toastOptions);
    } catch {
      toast.error('Something went wrong. Please try again.', toastOptions);
    } finally {
      setBusy(false);
    }
  }

  function fieldError(name: string) {
    return errors[name] && <p role="alert" className="mt-1 text-sm text-red-500">{errors[name]}</p>;
  }

  return <div className="w-full">
    <div className="rounded-2xl bg-white p-8 shadow-xl lg:p-12">
      <div className="mb-8 text-center">
        <div className="mb-4 text-3xl font-bold text-[#16a34a]">Fresh<span className="text-gray-800">Cart</span></div>
        {step < 3 && <>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">{titles[step]}</h1>
          <p className="text-gray-600">{["No worries, we'll send you a reset code", 'Enter the 6-digit code sent to ' + email, 'Your new password must be different from previous passwords'][step]}</p>
        </>}
      </div>
      {step === 3 ? <div className="space-y-6 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#dcfce7] text-3xl text-[#16a34a]"><FaCheck /></div>
        <div><h1 className="mb-2 text-2xl font-bold text-gray-800">Password Reset!</h1>
          <p className="text-gray-600">Your password has been successfully reset. You can now sign in with your new password.</p></div>
        <Link href="/login" className={buttonStyle + ' block'}>Back to Sign In</Link>
      </div> : <>
        <div className="mb-8 flex items-center justify-center" aria-label={'Step ' + (step + 1) + ' of 3'}>
          {[FaEnvelope, FaKey, FaLock].map((Icon, index) => <div key={index} className="flex items-center">
            <div className={'flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ' + (index <= step ? 'bg-[#16a34a] text-white' : 'bg-gray-100 text-gray-400') + (index === step ? ' ring-4 ring-[#dcfce7]' : '')}>
              {index < step ? <FaCheck /> : <Icon className="text-xs" />}
            </div>
            {index < 2 && <div className={'mx-2 h-0.5 w-16 transition-all duration-300 ' + (index < step ? 'bg-[#16a34a]' : 'bg-gray-200')} />}
          </div>)}
        </div>
        <form key={step} onSubmit={submit} noValidate className="space-y-6">
          {step === 0 && <div>
            <label htmlFor="reset-email" className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <input id="reset-email" type="email" autoComplete="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} />
              <FaEnvelope className={iconStyle} />
            </div>{fieldError('email')}
          </div>}
          {step === 1 && <>
            <div>
              <label htmlFor="reset-code" className="mb-2 block text-sm font-semibold text-gray-700">Verification Code</label>
              <div className="relative">
                <input id="reset-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className={inputStyle + ' text-center [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation_Mono,Courier_New,monospace] text-2xl tracking-[0.5em] text-gray-700 placeholder:[color:color-mix(in_oklab,currentColor_50%,transparent)]'} />
                <FaShieldAlt className={iconStyle} />
              </div>{fieldError('otp')}
            </div>
            <p className="text-center text-sm text-gray-500">Didn&apos;t receive the code? <button type="button" disabled={busy} onClick={resend} className="font-semibold text-[#16a34a] hover:text-[#15803d]">Resend Code</button></p>
          </>}
          {step === 2 && [['newPassword', 'New Password', 'Enter new password'], ['rePassword', 'Confirm Password', 'Confirm new password']].map(([name, label, placeholder]) =>
            <div key={name}>
              <label htmlFor={name} className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
              <div className="relative">
                <input id={name} name={name} type={visible[name] ? 'text' : 'password'} autoComplete="new-password" placeholder={placeholder} className={inputStyle + ' pr-12'} />
                <FaLock className={iconStyle} />
                <button type="button" aria-label={(visible[name] ? 'Hide ' : 'Show ') + label.toLowerCase()} onClick={() => setVisible({ ...visible, [name]: !visible[name] })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{visible[name] ? <FaEyeSlash /> : <FaEye />}</button>
              </div>{fieldError(name)}
            </div>)}
          <button type="submit" disabled={busy} className={buttonStyle}>
            {busy ? <span className="flex items-center justify-center gap-2"><FaSpinner className="animate-spin" />{busyLabels[step]}</span> : submitLabels[step]}
          </button>
          {step < 2 && <div className="text-center">
            {step === 1 ? <button type="button" disabled={busy} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#16a34a]" onClick={() => { setCode(''); setErrors({}); setStep(0); }}><FaArrowLeft className="text-xs" /> Change email address</button>
              : <Link href="/login" className={linkStyle}><FaArrowLeft className="text-xs" /> Back to Sign In</Link>}
          </div>}
        </form>
        {step === 0 && <div className="mt-8 border-t border-gray-100 pt-6 text-center text-gray-600">Remember your password? <Link href="/login" className="font-semibold text-[#16a34a] transition-colors hover:text-[#15803d]">Sign In</Link></div>}
      </>}
    </div>
  </div>;
}
