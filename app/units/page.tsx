import Appshell  from "@/components/appshell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CardStackPlusIcon } from "@radix-ui/react-icons";

export default async function MePage() {

    return (
        <Appshell>
                <div className="flex justify-between">
                    <h1 className="text-3xl font-semibold">Unités</h1>
                    <Button variant="outline" asChild>
                        <Link href="/orders/create">
                            <CardStackPlusIcon className="mr-2 h-4 w-4" /> Nouvelle unité
                        </Link>
                    </Button>
                </div>
                Table
                <div className="flex items-center justify-end space-x-2 py-4">
                    Pagination            
                </div>
            </Appshell>
    )
}
