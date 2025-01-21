"use client";

import { toast } from "sonner";
import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { Plus, X } from "lucide-react";

import { useParams } from "next/navigation";
import { useOnClickOutside, useEventListener } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { FormTextArea } from "@/components/form/FormTextArea";
import { FormSubmit } from "@/components/form/FormSubmit";

import { useAction } from "@/hooks/UseAction";
import { createCard } from "@/actions/CreateCard";

interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disabledEditing: () => void;
  isEditing: boolean;
};


export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps> (({
  listId,
  enableEditing,
  disabledEditing,
  isEditing,
}, ref) => {
  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);

  const { execute, fieldErrors } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" created`);
      disabledEditing();
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Escape") {
      disabledEditing();
    }
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const listId = formData.get("listId") as string;
    const boardId = params.boardId as string;

    console.log({title, listId, boardId});

    execute({ title, listId, boardId });
  };

  useOnClickOutside(formRef, disabledEditing);
  useEventListener("keydown", onKeyDown);

  const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  if(isEditing) {
    return (
      <form 
        action={onSubmit} 
        ref={formRef} 
        className="m-1 py-0.5 px-1 space-y-4"
      >
        <FormTextArea
          ref={ref} 
          id="title"
          onKeyDown={onTextAreaKeyDown}
          placeholder="Enter a title for this card..."
          errors={fieldErrors}
        />
        <input 
          hidden 
          id="listId" 
          name="listId" 
          value={listId} 
          readOnly
        />
        <div className="flex items-center gap-x-1">
          <FormSubmit>
            Add Card
          </FormSubmit>
          <Button 
            onClick={disabledEditing} 
            size="sm" 
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div className="p-2 px-2">
      <Button
        onClick={enableEditing}
        size="sm"
        variant="ghost"
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button>
    </div>    
  );
});

CardForm.displayName = "CardForm";