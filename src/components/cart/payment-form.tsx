import { useToast } from "@/hooks/use-toast";
import { CART_PROGRESS_STATE, useCartStore } from "@/lib/client-store";
import { createOrder } from "@/server/actions/create-order";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

interface Props {
  totalPrice: number;
}

export function PaymentForm({ totalPrice }: Props) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const stripe = useStripe();
  const elements = useElements();
  const { cart, changeProgressTo, clearCart } = useCartStore();
  const { toast } = useToast();
  const { executeAsync } = useAction(createOrder, {
    onSuccess({ data }) {
      toast({
        variant: data?.error ? "destructive" : "default",
        description: data?.success || data?.error,
      });

      if (data?.success) {
        changeProgressTo(CART_PROGRESS_STATE.CONFIRMATION_PAGE);
        clearCart();
      }
    },
    onError(error) {
      console.error(error);
    },
  });

  async function handlePayment() {
    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast({
        variant: "destructive",
        description: submitError.message,
      });
      return;
    }

    const response = await createPaymentIntent({
      amount: totalPrice * 100,
    });
    const data = response?.data;
    if (!data) return;

    if (data?.error) {
      toast({
        variant: "destructive",
        description: data.error,
      });
    }

    if (!data?.success) return;
    const url = new URL(window.location.href);
    url.pathname = "/success";

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: data.success.clientSecretId!,
      redirect: "if_required",
      confirmParams: {
        return_url: url.href,
        receipt_email: data.success.user as string,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      return;
    }

    await executeAsync({
      amount: totalPrice,
      paymentIntentId: paymentIntent.id,
      products: cart.map((p) => ({
        productId: p.id,
        variantId: Number(p.variant.id),
        quantity: p.variant.quantity,
      })),
    });
  }

  return (
    <form onSubmit={handleSubmit(handlePayment)}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />

      <Button
        className="my-4  w-full"
        disabled={!stripe || !elements || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}
