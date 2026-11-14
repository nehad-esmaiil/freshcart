import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import ProfileSettings from './ProfileSettings';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  return <ProfileSettings initialPhone={session?.user?.phone ?? ''} />;
}
