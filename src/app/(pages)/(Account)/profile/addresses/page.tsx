'use client';
import AccountHeader from '../AccountHeader';
import { Dialog as EditDialog } from '@base-ui/react/dialog';
import { FaXmark } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { IoIosArrowForward } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
  addAddresses,
  getAddresses,
  RemoveAddress,
  } from '@/actions/userAddress.action';
import { AddAddressSchemaType, AddAddressSchema } from '@/schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { FaLocationDot } from 'react-icons/fa6';
import { FaCity } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';
import { FaPen } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { AddressData, Details } from '@/api/types/address.type';

export default function Profile() {
  const [addressData, setaddressData] = useState<AddressData | null>(null);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Details | null>(null);
  const editForm = useForm<AddAddressSchemaType>({ resolver: zodResolver(AddAddressSchema) });

  function openEdit(address: Details) {
    const { name, details, phone, city } = address;
    editForm.reset({ name, details, phone, city });
    setEditing(address);
  }

  async function saveEdit(values: AddAddressSchemaType) {
    if (!editing) return;
    if (Object.keys(values).every((key) => {
      const field = key as keyof AddAddressSchemaType;
      return values[field] === editing[field];
    })) {
      setEditing(null);
      return;
    }

    // Route supports creating and removing addresses, so retain the original until the replacement is saved.
    const created = await addAddresses(values);
    if (!created.ok) {
      toast.error(created.error || 'Could not update address.');
      return;
    }
    const removed = await RemoveAddress(editing._id).catch(() => null);
    setEditing(null);
    await getAddressData();
    if (removed?.status === 'success') toast.success('Address updated successfully!');
    else toast.error('The new address was saved, but the previous address could not be removed.');
  }

  const form = useForm<AddAddressSchemaType>({
    defaultValues: {
      name: '',
      details: '',
      phone: '',
      city: '',
    },
    resolver: zodResolver(AddAddressSchema),
  });
  function openAdd() {
    form.reset();
    setAdding(true);
  }

  const addressForm = editing ? editForm : form;
  const isSaving = addressForm.formState.isSubmitting;
  async function mySubmit(data: AddAddressSchemaType) {
    const result = await addAddresses(data);
    if (!result.ok) {
      toast.error(result.error || 'Failed to add address');
      return;
    }
    await getAddressData();
    setAdding(false);
    form.reset();
    toast.success('Address added successfully!');
  }
  async function getAddressData() {
    const res = await getAddresses();
    setaddressData(res);
  }
  async function RemoveUserAddress(productId: string) {
    const res = await RemoveAddress(productId);
    if (res.status === 'success') {
      setaddressData(res);
      getAddressData();
    }
  }
  const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this address?");
  if (!confirmDelete) return;

  await RemoveUserAddress(id);
};
  useEffect(() => {
    getAddressData();
  }, []);
  return (
    <>
      <EditDialog.Root open={adding || !!editing} onOpenChange={(open) => {
        if (!open && !isSaving) {
          setEditing(null);
          setAdding(false);
        }
      }}>
        <EditDialog.Portal>
          <EditDialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <EditDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 font-medium text-gray-700 shadow-2xl outline-none data-open:animate-in data-open:zoom-in-95 duration-200 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <EditDialog.Title className="text-xl font-bold text-gray-900">{editing ? 'Edit Address' : 'Add New Address'}</EditDialog.Title>
              <EditDialog.Close aria-label="Close" disabled={isSaving}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200">
                <FaXmark aria-hidden />
              </EditDialog.Close>
            </div>
            <form onSubmit={addressForm.handleSubmit(editing ? saveEdit : mySubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {([
                  ['name', 'Address Name', 'e.g. Home, Office'],
                  ['details', 'Full Address', 'Street, building, apartment...'],
                  ['phone', 'Phone Number', '01xxxxxxxxx'],
                  ['city', 'City', 'Cairo'],
                ] as const).map(([key, label, placeholder]) => {
                  const fieldClass = 'w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20';
                  return (
                    <div key={key} className={key === 'name' || key === 'details' ? 'col-span-2' : ''}>
                      <label htmlFor={'edit-' + key} className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
                      {key === 'details' ? (
                        <textarea id={'edit-' + key} rows={3} placeholder={placeholder} {...addressForm.register(key)}
                          className={fieldClass + ' resize-none'} />
                      ) : (
                        <input id={'edit-' + key} type={key === 'phone' ? 'tel' : 'text'} placeholder={placeholder}
                          {...addressForm.register(key)} className={fieldClass} />
                      )}
                      {addressForm.formState.errors[key]?.message && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{addressForm.formState.errors[key]?.message}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 pt-4">
                <EditDialog.Close disabled={isSaving}
                  className="flex-1 cursor-pointer rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200">Cancel</EditDialog.Close>
                <button type="submit" disabled={isSaving}
                  className="flex-1 cursor-pointer rounded-xl bg-[#16a34a] px-6 py-3 font-semibold text-white shadow-lg shadow-[#16a34a]/25 transition-colors hover:bg-[#15803d] disabled:opacity-50">
                  {isSaving ? (editing ? 'Updating...' : 'Adding...') : (editing ? 'Update' : 'Add Address')}
                </button>
              </div>
            </form>
          </EditDialog.Popup>
        </EditDialog.Portal>
      </EditDialog.Root>
      <section className="min-h-screen bg-gray-50/50 font-medium">
        <AccountHeader />
        <section>
          <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <aside className="w-full lg:w-72 shrink-0">
                <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">My Account</h2>
                  </div>
                  <ul className="p-2">
                    <li>
                      <Link
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-green-600 bg-green-50 hover:text-green-900"
                        href="/profile/addresses"
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-green-500 text-white">
                          <FaMapMarkerAlt />
                        </div>
                        <span className="font-medium flex-1">My Addresses</span>
                        <IoIosArrowForward />
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        href="/profile/settings"
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-gray-100 text-gray-500 group-hover:bg-gray-200">
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
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Manage your saved delivery addresses
                      </p>
                    </div>
                    <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold cursor-pointer hover:bg-green-700 hover:text-white transition-colors shadow-lg shadow-green-600/25">
                          <FaPlus className="text-sm" />
                          Add Address
                        </button>
                  </div>
                  {/* loading */}
                  {!addressData && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array(2)
                          .fill(0)
                          .map((_, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="w-11 h-11 rounded-xl bg-gray-300 shrink-0"></div>
                                  <div className="flex-1 min-w-0 space-y-2 py-1">
                                    <div className="h-4 bg-gray-300 rounded w-3/5"></div>{' '}
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>{' '}
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>{' '}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-9 h-9 rounded-lg bg-gray-300"></div>{' '}
                                  <div className="w-9 h-9 rounded-lg bg-gray-300"></div>{' '}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                  {/* add addresses */}
                  {addressData?.ok && addressData?.data && addressData.data.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addressData.data.map((address) => (
                          <div
                            key={address._id}
                            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-200 group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                  <FaLocationDot className="text-lg text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-gray-900 mb-1">{address.name}</h3>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {address.details}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                      <FaPhone className="text-xs" />
                                      {address.phone}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <FaCity className="text-xs" />
                                      {address.city}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  className="w-9 h-9 rounded-lg bg-gray-100  cursor-pointer text-gray-600 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition-colors"
                                  title="Edit address"
                                  aria-label="Edit address"
                                  onClick={() => openEdit(address)}
                                >
                                  <FaPen className="text-sm" />
                                </button>
                                <button
                                  className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 cursor-pointer hover:text-red-600 flex items-center justify-center transition-colors disabled:opacity-50"
                                  title="Delete address"
                                  onClick={() => {
                                    handleDelete(address._id);
                                  }}
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {/* No Addresses Yet */}
                  {addressData?.ok && addressData?.data?.length === 0 && (
                    <>
                      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                          <FaMapMarkerAlt className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Addresses Yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                          Add your first delivery address to make checkout faster and easier.
                        </p>
                        <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 hover:text-white transition-colors shadow-lg shadow-green-600/25 cursor-pointer">
                              <FaPlus className="text-sm" />
                              Add Your First Address
                            </button>
                      </div>
                    </>
                  )}
                </div>
              </main>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
