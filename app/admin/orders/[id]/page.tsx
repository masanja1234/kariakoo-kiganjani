import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adminGetOrderById } from "@/actions/orders";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { getOrderSupportLink } from "@/lib/whatsapp";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await adminGetOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Maagizo
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Agizo #{order.orderNumber}
        </h1>
        <StatusBadge status={order.status} />
        <StatusBadge status={order.paymentStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Bidhaa Zilizoagizwa</h2>
            <div className="space-y-3">
              {order.items.map((item) => {
                const img = item.product.images.find((i) => i.isMain) ?? item.product.images[0];
                return (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                      {img?.url && <Image src={img.url} alt={item.productName} fill className="object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.productName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity} × {formatPrice(item.unitPrice)}</p>
                      {item.supplierCostPriceSnapshot && (
                        <p className="text-xs text-gray-400">Gharama: {formatPrice(item.supplierCostPriceSnapshot)} | Faida: {formatPrice(item.profitSnapshot ?? 0)}</p>
                      )}
                    </div>
                    <p className="font-bold text-sm">{formatPrice(item.totalPrice)}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Jumla Ndogo</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Uwasilishaji</span><span>{formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 dark:border-gray-800 pt-2">
                <span>Jumla</span><span className="text-primary-600 dark:text-primary-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          {order.payment && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Malipo</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-500">Njia</p><StatusBadge status={order.payment.method} /></div>
                <div><p className="text-gray-500">Hali</p><StatusBadge status={order.payment.status} /></div>
                <div><p className="text-gray-500">Kiasi</p><p className="font-medium">{formatPrice(order.payment.amount)}</p></div>
                {order.payment.transactionReference && (
                  <div><p className="text-gray-500">Ref</p><p className="font-mono text-xs">{order.payment.transactionReference}</p></div>
                )}
              </div>
              {order.payment.status === "PENDING" && (
                <OrderStatusUpdater
                  orderId={order.id}
                  paymentId={order.payment.id}
                  currentStatus={order.status}
                  currentPaymentStatus={order.payment.status}
                />
              )}
            </div>
          )}
        </div>

        {/* Customer & Delivery */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Mteja</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
              <p className="text-gray-500">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-gray-500">{order.customerEmail}</p>}
            </div>
            <a
              href={getOrderSupportLink(order.orderNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400"
            >
              <MessageCircle size={14} />
              Wasiliana WhatsApp
            </a>
          </div>

          {order.delivery && (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Uwasilishaji</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>{order.delivery.address}</p>
                <p>{order.delivery.district}, {order.delivery.region}</p>
                <StatusBadge status={order.delivery.status} className="mt-2" />
                {order.delivery.riderName && <p className="mt-2">Rider: {order.delivery.riderName}</p>}
                {order.delivery.trackingNote && <p className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg mt-2">{order.delivery.trackingNote}</p>}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Tarehe</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.createdAt).toLocaleString("sw-TZ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
