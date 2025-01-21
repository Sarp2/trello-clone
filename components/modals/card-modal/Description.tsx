"use client";

import { toast } from "sonner";
import { useState, useRef, ElementRef } from "react";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";


import { Skeleton } from "@/components/ui/skeleton";
import { FormSubmit } from "@/components/form/FormSubmit";
import { FormTextArea } from "@/components/form/FormTextArea";
import { Button } from "@/components/ui/button";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/UseAction";
import { updateCard } from "@/actions/UpdateCard";

interface DescriptionProps {
  data: CardWithList
};


export const Description = ({
  data }: DescriptionProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    })
  };

  const disabledEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disabledEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disabledEditing);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id]
      });
      
      toast.success(`Card "${data.title}" updated`);
      disabledEditing();
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      description,
      boardId,
    });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">
          Description
        </p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-4">
            <FormTextArea
              ref={textAreaRef}
              id="description"
              className="w-full mt-2" 
              placeholder="Add a more detailed description..."
              defaultValue={data.description || ""}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>
                Save
              </FormSubmit>
              <Button 
                type="button" 
                onClick={disabledEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function SkeletonDescription() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};