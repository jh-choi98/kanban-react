import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  padding: 10px;
  margin: 0px 5px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};

  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.4)" : "none"};
`;

interface ICard {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: ICard) {
  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {/* key에 index를 사용해서는 안 된다. */}
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          // react에서 특정 DOM 요소에 직접 접근할 수 있도록 참조를 설정하는 역할
          // Drag & Drop 요소가 제대로 동작하도록, innerRef가 드래그 가능한
          // Card component에 전달되고 있다
          // 이 ref를 통해 react-beatiful-dnd가 해당 DOM 요소를 추적하고,
          // Drag & Drop 관련 기능을 수행할 수 있게 도와준다.
          {...provided.dragHandleProps}
          {...provided.draggableProps}>
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default memo(DraggableCard);
