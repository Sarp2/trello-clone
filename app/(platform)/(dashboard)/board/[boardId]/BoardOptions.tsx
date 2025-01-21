"use client";

import { MoreHorizontal, X } from "lucide-react";

import { deleteBoard } from "@/actions/DeleteBoard";
import { useAction } from "@/hooks/UseAction";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";


interface BoardOptionsProps {
  id: string
}


export const BoardOptions = ({
  id,
}: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    }
  });

  const onDelete = () => {
    execute({ id });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="transparent" className="h-auto w-auto p-2" >
          <MoreHorizontal className="h-4 w-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="px-0 pt-3 pb-3"
        side="bottom"
        align="start"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button variant="ghost" className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600">
            <X  className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <Button
          variant="ghost"
          onClick={onDelete}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          disabled={isLoading}
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};