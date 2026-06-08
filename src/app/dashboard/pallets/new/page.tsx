import { getDepartmentSectionsAction } from '@/actions/pallet'
import NewPalletForm from './NewPalletForm'

export default async function NewPalletPage() {
  const sections = await getDepartmentSectionsAction()

  return <NewPalletForm existingSections={sections} />
}
