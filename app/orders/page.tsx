import Appshell  from "@/components/appshell";

import { Order, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Order[]> {
  const res = await fetch('http://localhost:3000/api/orders')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <Appshell title="Commandes">
      <h1 className="text-3xl font-semibold">Commandes</h1>
      <DataTable columns={columns} data={data} />
    </Appshell>
  )
}
