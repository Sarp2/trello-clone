"use client";

import { toast } from "sonner";
import { useState, useRef, ElementRef } from "react";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { ListWrapper } from "./ListWrapper";
import { FormInput } from "@/components/form/FormInput";
import { FormSubmit } from "@/components/form/FormSubmit";
import { Button } from "@/components/ui/button";

import { useAction } from "@/hooks/UseAction";
import { createList } from "@/actions/CreateList";


export const ListForm = () => {
  const router = useRouter();
  const params = useParams();

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  
  const [ isEditing, setIsEditing ] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disabledEditing = () => {
    setIsEditing(false);
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success("List created successfully");
      disabledEditing();
      router.refresh();
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

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disabledEditing);

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    execute({ title, boardId });
  };

  if(isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput 
            ref={inputRef}
            id="title"
            errors={fieldErrors}
            placeholder="Enter list title..."
            className="text-sm px-2 py-1 h-7 font-medium border-transparent 
            hover:border-input focus:border-input transition"
          />
          <input 
            value={params.boardId}
            name="boardId"
            hidden
          />
          
          <div className="flex items-center gap-x-1">
            <FormSubmit>
              Add List
            </FormSubmit>
            <Button 
              onClick={disabledEditing}
              variant="ghost"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button 
      onClick={enableEditing}
      className="w-full rounded-md bg-white/80 hover:bg-white/50 
      transition p-3 flex items-center font-medium text-sm"
    >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};