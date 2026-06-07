import { prisma } from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import Link from 'next/link'
import PalletScanner from '@/components/PalletScanner'
import ClosedPalletEditor from '@/components/ClosedPalletEditor'
import ClosePalletModal from '@/components/ClosePalletModal'
import PalletBarcodeButton from '@/components/PalletBarcodeButton'
import { redirect } from 'next/navigation'

export default async function PalletDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return redirect('/')

  // Await params as required by Next.js 15
  const { id } = await params

  const pallet = await prisma.pallet.findUnique({
    where: { id, departmentId: session.id },
    include: {
      products: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!pallet) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Bancale non trovato</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Torna alla Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm font-medium mb-1 inline-block">
            ← Torna alla Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{pallet.name}</h1>
          <p className="text-sm text-gray-500">
            Creato il: {new Date(pallet.createdAt).toLocaleString('it-IT')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            pallet.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {pallet.status}
          </span>
          {pallet.status === 'OPEN' && (
            <ClosePalletModal palletId={pallet.id} palletName={pallet.name} />
          )}
          {pallet.status === 'CLOSED' && (
            <PalletBarcodeButton palletId={pallet.id} palletName={pallet.name} />
          )}
        </div>
      </div>

      {pallet.status === 'OPEN' ? (
        <PalletScanner palletId={pallet.id} initialProducts={pallet.products} />
      ) : (
        <ClosedPalletEditor palletId={pallet.id} initialProducts={pallet.products} />
      )}
    </div>
  )
}
