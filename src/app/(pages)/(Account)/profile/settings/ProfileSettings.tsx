'use client';
import AccountHeader from '../AccountHeader';
import AccountInformation from './AccountInformation';
import { getRememberedAccountPhone, rememberAccountPhone } from '@/accountPhone';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaSave } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UpdatePersonalDetailsSchema,
  UpdatePersonalDetailsSchemaType,
  UpdatePasswordSchema,
  UpdatePasswordSchemaType,
} from '@/schemas/auth.schema';
import { FaLock } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa6';
import { FaEyeSlash } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SpinnerCustom } from '@/app/_Components/ButtonSpinner/ButtonSpinner';
import { Button } from '@/components/ui/button';
import { updateUserDetails } from '@/actions/updateUserData';
import { toast } from 'react-toastify';
import { changeMyPassword } from '@/actions/auth.action';
export default function Profile({ initialPhone }: { initialPhone: string }) {
  const [loading, setLoading] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [showPasswordThere, setShowPasswordThere] = useState(false);
  const { data: myData, update: updateSession } = useSession();
  const accountName = myData?.user?.name ?? '';
  const accountEmail = myData?.user?.email ?? '';
  const accountPhone = myData?.user?.phone;
  const form = useForm<UpdatePersonalDetailsSchemaType>({
    defaultValues: {
      name: '',
      email: '',
      phone: initialPhone,
    },
    resolver: zodResolver(UpdatePersonalDetailsSchema),
  });
  const updataPassForm = useForm<UpdatePasswordSchemaType>({
    defaultValues: {
      password: '',
      newPassword: '',
      rePassword: '',
    },
    resolver: zodResolver(UpdatePasswordSchema),
  });
  const { handleSubmit: handleProfileSubmit, control: profileControl, reset: resetProfile } = form;
  const { handleSubmit: handlePasswordSubmit, control: passwordControl } = updataPassForm;
  const { resetField, getFieldState } = form;

  useEffect(() => {
    if (!getFieldState('name').isDirty) resetField('name', { defaultValue: accountName });
    if (!getFieldState('email').isDirty) resetField('email', { defaultValue: accountEmail });
    if (accountEmail && !getFieldState('phone').isDirty) {
      const phone = getRememberedAccountPhone(accountEmail) || accountPhone?.trim() || initialPhone;
      resetField('phone', { defaultValue: phone });
    }
  }, [accountName, accountEmail, accountPhone, initialPhone, getFieldState, resetField]);
  // updateUserDetails
  async function mySubmit(theData: UpdatePersonalDetailsSchemaType) {
    const defaults = form.formState.defaultValues;
    const changes: Partial<UpdatePersonalDetailsSchemaType> = {};
    if (theData.name !== defaults?.name) changes.name = theData.name;
    if (theData.email.toLowerCase() !== defaults?.email?.toLowerCase()) changes.email = theData.email;
    if (theData.phone !== defaults?.phone) changes.phone = theData.phone;
    if (Object.keys(changes).length === 0) {
      toast.info('No changes to save.');
      return;
    }
    setLoading(true);
    try {
      const res = await updateUserDetails(changes);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success('Details Updated');
      rememberAccountPhone(theData.email, theData.phone);
      if (accountEmail && accountEmail !== theData.email) rememberAccountPhone(accountEmail, theData.phone);
      resetProfile(theData);
      try {
        if (!await updateSession(changes)) {
          toast.info('Profile saved. Sign in again to refresh your account details.');
        }
      } catch {
        toast.info('Profile saved. Sign in again to refresh your account details.');
      }
    } catch {
      toast.error('Could not save your profile details.');
    } finally {
      setLoading(false);
    }
  }
  // change the Password
  async function mySubmitTwo(newData: UpdatePasswordSchemaType) {
    setLoadingPass(true);
    const res = await changeMyPassword(newData);
    if (res.ok) {
      toast.success('Password changed successfully');
      updataPassForm.reset();
    } else {
      toast.error(res.data?.message || res.data?.errors?.msg || 'Could not change your password.');
    }
    setLoadingPass(false);
  }
  return (
    <>
      <AccountHeader />
      <section>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="w-full lg:w-72 shrink-0">
              <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">My Account</h2>
                </div>
                <ul className="p-2">
                  <li>
                    <Link
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      href="/profile/addresses"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-gray-100 text-gray-500 group-hover:bg-gray-200">
                        <FaMapMarkerAlt />
                      </div>
                      <span className="font-medium flex-1">My Addresses</span>
                      <IoIosArrowForward />
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group bg-green-50 text-green-700"
                      href="/profile/settings"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-green-500 text-white">
                        <IoSettingsSharp />
                      </div>
                      <span className="font-medium flex-1">Settings</span>
                      <IoIosArrowForward />
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>
            <main className="flex-1 min-w-0">
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Update your profile information and change your password
                  </p>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 sm:p-8 border-b border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                        <FaUser className="text-2xl text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Profile Information</h3>
                        <p className="text-sm text-gray-500">Update your personal details</p>
                      </div>
                    </div>
                    <form className="space-y-5" onSubmit={handleProfileSubmit(mySubmit)}>
                      <div className="flex flex-col gap-2">
                        <Controller
                          name="name"
                          control={profileControl}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="name">Full Name</FieldLabel>
                              <Input
                                {...field}
                                id="name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your name"
                                autoComplete="off"
                                className="py-5! rounded-md! border! border-gray-200! bg-gray-50/50 focus:bg-white! focus:outline-none! focus:ring-2! focus:ring-green-500/0! focus:border-green-500! transition-all! text-[16px]!"
                              />
                            </Field>
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Controller
                          name="email"
                          control={profileControl}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="email">Email Address</FieldLabel>
                              <Input
                                {...field}
                                id="email"
                                className="py-5! rounded-md! border! border-gray-200! bg-gray-50/50 focus:bg-white! focus:outline-none! focus:ring-2! focus:ring-green-500/0! focus:border-green-500! transition-all! text-[16px]"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your email"
                              />
                            </Field>
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Controller
                          name="phone"
                          control={profileControl}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                              <Input
                                {...field}
                                id="phone"
                                type="tel"
                                aria-invalid={fieldState.invalid}
                                placeholder="01xxxxxxxxx"
                                className="py-5! rounded-md! border! border-gray-200! bg-gray-50/50 focus:bg-white! focus:outline-none! focus:ring-2! focus:ring-green-500/0! focus:border-green-500! transition-all! text-[16px]"
                              />
                              {fieldState.error && <p role="alert" className="text-sm text-red-600">{fieldState.error.message}</p>}
                            </Field>
                          )}
                        />
                      </div>
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="inline-flex items-center gap-2 px-6 py-6 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-600/25"
                        >
                          {loading ? (
                            <>
                              <SpinnerCustom />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <FaSave />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                  <AccountInformation id={myData?.id} role={myData?.user.role} />
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                        <FaLock className="text-2xl text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Change Password</h3>
                        <p className="text-sm font-normal text-gray-500">Update your account password</p>
                      </div>
                    </div>
                    {/**/}
                    <form className="space-y-5" onSubmit={handlePasswordSubmit(mySubmitTwo)}>
                      <Controller
                          name="password"
                          control={passwordControl}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-sm font-medium leading-5 text-gray-700" htmlFor="password">Current Password</FieldLabel>
                              <div className="relative">
                              <input
                                {...field}
                                id="password" autoComplete="current-password"
                                type={showPassword ? 'text' : 'password'}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your current password"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-base font-normal text-gray-900 placeholder:font-normal placeholder:text-gray-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                              />
                                <button
                          type="button" aria-label="Toggle current password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                              </div>
                              {fieldState.error && <p role="alert" className="text-sm text-red-600">{fieldState.error.message}</p>}
                            </Field>
                          )}
                        />
                      <Controller
                          name="newPassword"
                          control={passwordControl}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-sm font-medium leading-5 text-gray-700" htmlFor="newPassword">New Password</FieldLabel>
                              <div className="relative">
                              <input
                                {...field}
                                id="newPassword" autoComplete="new-password"
                                type={showPasswordTwo ? 'text' : 'password'}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your new password"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-base font-normal text-gray-900 placeholder:font-normal placeholder:text-gray-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                              />
                                <button
                          type="button" aria-label="Toggle new password visibility"
                          onClick={() => setShowPasswordTwo(!showPasswordTwo)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                          {showPasswordTwo ? <FaEyeSlash /> : <FaEye />}
                        </button>
                              </div>
                              <p className="text-xs font-normal text-gray-500">Must be at least 6 characters</p>
                              {fieldState.error && <p role="alert" className="text-sm text-red-600">{fieldState.error.message}</p>}
                            </Field>
                          )}
                        />
                      <Controller
                          name="rePassword"
                          control={passwordControl}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-sm font-medium leading-5 text-gray-700" htmlFor="rePassword">Confirm New Password</FieldLabel>
                              <div className="relative">
                              <input
                                {...field}
                                id="rePassword" autoComplete="new-password"
                                type={showPasswordThere ? 'text' : 'password'}
                                aria-invalid={fieldState.invalid}
                                placeholder="Confirm your new password"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-base font-normal text-gray-900 placeholder:font-normal placeholder:text-gray-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                              />
                                <button
                          type="button" aria-label="Toggle confirm password visibility"
                          onClick={() => setShowPasswordThere(!showPasswordThere)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                          {showPasswordThere ? <FaEyeSlash /> : <FaEye />}
                        </button>
                              </div>
                              {fieldState.error && <p role="alert" className="text-sm text-red-600">{fieldState.error.message}</p>}
                            </Field>
                          )}
                        />
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loadingPass}
                          className="inline-flex items-center gap-2 px-6 py-3 h-auto rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-lg shadow-amber-600/25"
                        >
                          {loadingPass ? (
                            <>
                              <SpinnerCustom />
                              <span>Changing Password...</span>
                            </>
                          ) : (
                            <>
                              <FaLock />
                              Change Password
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
