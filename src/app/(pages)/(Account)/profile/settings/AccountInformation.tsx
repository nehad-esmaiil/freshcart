

export default function AccountInformation({ id, role }: { id?: string; role?: string }) {
  return (
    <div className="p-6 sm:p-8 bg-gray-50">
      <h3 className="font-bold text-gray-900 mb-4">Account Information</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">User ID</span>
          <span className="font-mono text-gray-700">{id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Role</span>
          <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-medium capitalize">
            {role || 'user'}
          </span>
        </div>
      </div>
    </div>
  );
}
