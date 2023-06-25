import Appshell  from "@/components/appshell";
import { UserProfile } from "@clerk/nextjs";


export default async function MePage() {

  return (
    <Appshell title="Commandes">
        <UserProfile />
    </Appshell>
  )
}
