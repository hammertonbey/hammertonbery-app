import fs from 'fs/promises'
import path from 'path'
import { HomeClient } from '@/components/HomeClient'

export default async function Home() {
  const privacyPolicyPath = path.join(process.cwd(), 'public', 'privacy-policy.md');
  const privacyPolicyContent = await fs.readFile(privacyPolicyPath, 'utf8');

  return <HomeClient privacyPolicyContent={privacyPolicyContent} />;
}

