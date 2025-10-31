"use client";
import PaymentForm from "@/components/investment/payment-form";

export default function PaymentPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-lg">
				<PaymentForm onSuccess={() => { /* handled in PaymentForm */ }} />
			</div>
		</div>
	);
}
