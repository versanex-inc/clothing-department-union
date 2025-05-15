import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl font-bold tracking-wide text-white uppercase mb-6">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-200 mb-6">
          Your order has been placed successfully. We will deliver your product soon via Cash on Delivery.
        </p>
        <Link
          href="/shop"
          className="inline-block py-3 px-6 text-center font-medium text-white bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}