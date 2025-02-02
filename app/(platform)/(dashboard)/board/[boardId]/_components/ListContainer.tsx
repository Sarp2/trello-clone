"use client";

import { toast } from "sonner";
import { useEffect, useState, useRef, ElementRef } from "react";
import { useEventListener } from "usehooks-ts";

import { ListForm } from "./listForm";
import { ListItem } from "./ListItem";

import { ListWithCards } from "@/types";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { useAction } from "@/hooks/UseAction";
import { updateListOrder } from "@/actions/UpdateListOrder";
import { updateCardOrder } from "@/actions/UpdateCardOrder";

interface ListContainerProps { 
  boardId: string;
  data: ListWithCards[];
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [ removed ] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


export const ListContainer = ({ 
  boardId, 
  data 
}: ListContainerProps) => {
  const [ orderedData, setOrderedData ] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: (data) => {
      toast.success("List reordered")
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: (data) => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if(!destination) {
      return;
    }

    // if dropped in the same position
    if(destination.droppableId === source.droppableId && 
      destination.index === source.index) {
        return;
    }

    // User moves a list
    if(type === "list") {
      const items = reorder(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) => ({...item, order: index}));

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // User moves a card
    if(type === "card") {
      const newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destinationList = newOrderedData.find(list => list.id === destination.droppableId);

      if(!sourceList || !destinationList) {
        return;
      }

      // Check if the cards exists on the sourceList
      if(!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if the cards exists on the destinationList
      if(!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving the card in the same list
      if(source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ boardId: boardId, items: reorderedCards })

        // User moves a card to another list
      } else {
        const [ movedCard ] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add the card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order for each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ boardId: boardId, items: destinationList.cards });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full overflow-x-scroll scrollbar-hide"
          >
            {orderedData.map((list, index) => (
              <ListItem 
              key={list.id}
              data={list}
              index={index}
              />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};