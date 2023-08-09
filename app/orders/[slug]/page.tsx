export default function Page({ params }: { params: { slug: string } }) {
    return <div>Commande: {params.slug}</div>
  }