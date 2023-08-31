import Appshell  from "@/components/appshell";

import { Client, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Client[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/clients`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <Appshell>
      <DataTable columns={columns} data={data} />
    </Appshell>
  )
}
