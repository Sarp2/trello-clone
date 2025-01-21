"use client";

import { stripeRedirect } from "@/actions/StripeRedirect";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { useAction } from "@/hooks/UseAction";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  isPro: boolean;
};

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  const onClick = () => {
    if(isPro) {
      execute({});
    } else {
      proModal.onOpen();
    }
  };

  return (
    <Button onClick={onClick} variant="primary">
      {isPro ? "Manage subscription" : "Upgrade to Pro"}
    </Button>
  );
};