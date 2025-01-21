"use client";

import { ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { ListHeader } from "./ListHeader";
import { CardForm } from "./CardForm";
import { CardItem } from "./CardItem";

import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";

interface ListItemProps {
  data: ListWithCards;
  index: number;
};


export const ListItem = ({
  data,
  index,
}: ListItemProps) => {
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disabledEditing = () => {
    setIsEditing(false);
  };

  const enabledEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    })
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shrink-0 h-full w-[272px] select-none "
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader
              onAddCard={enabledEditing}
              data={data}
            />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                  "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                  data.cards.length === 0 ? "mt-2" : "mt-0",
                )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem
                      index={index}
                      key={card.id}
                      data={card}
                    />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textAreaRef}
              listId={data.id}
              isEditing={isEditing}
              enableEditing={enabledEditing}
              disabledEditing={disabledEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};