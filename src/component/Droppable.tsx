import { FaGripLines } from 'react-icons/fa6';
import { Dispatch, SetStateAction, useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import Image from 'next/image';
interface DraggableListInterface {
  fileList: [] | File[];
  setFileList: Dispatch<SetStateAction<[] | File[]>>;
  type: string;
}

export default function DraggableList({ type, fileList, setFileList }: DraggableListInterface) {
  const handleDrop = (droppedItem: any) => {
    if (!droppedItem.destination) return;
    var updatedList = [...fileList];
    const [reorderedFile] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedFile);
    setFileList(updatedList);
  };
  return (
    <DragDropContext onDragEnd={handleDrop}>
      <StrictModeDroppable droppableId="list-container">
        {(provided) => (
          <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
            {fileList.map((file, index) => (
              <Draggable key={file.name} draggableId={file.name} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`file-container flex flex-row items-center space-x-2 px-4 py-2 rounded-xl
                              ${snapshot.isDragging ? 'bg-[#E0E1E6]' : 'bg-transparent'}`}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                  >
                    {type === 'image' ? (
                      <Image src={URL.createObjectURL(file)} alt={file.name} width={400} height={400} className="" />
                    ) : (
                      <div className="flex flex-row items-center space-x-2">
                        <FaGripLines className="text-2xl mr-2" />
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">{file.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
