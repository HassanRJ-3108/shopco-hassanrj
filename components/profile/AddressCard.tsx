import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Address {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface AddressCardProps {
  address: Address
  onDelete: () => void
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
        {address.isDefault && <Badge className="mt-2">Default</Badge>}
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

