// app/account/guest/customer/[id]/page.tsx

export default function CustomerPage({ params }: { params: { id: string } }) {
    return <div>고객 ID: {params.id}</div>;
  }
  