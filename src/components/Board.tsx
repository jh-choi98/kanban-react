import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  overflow-y: auto;
  border-radius: 5px;
  min-height: 40vh;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 20px;
`;

const Area = styled.div<IArea>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#b2bec3"
      : props.isDraggingFromThis
      ? "#dfe6e9"
      : "transparent"};
  flex-grow: 1;
  padding: 20px;
  transition: background-color 0.4s ease-in-out;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface IBoard {
  toDos: IToDo[];
  boardId: string;
}

interface IArea {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoard) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = { id: Date.now(), text: toDo };
    setToDos((curBoards) => {
      const newBoard = [...curBoards[boardId], newToDo];
      const newWholeBoards = { ...curBoards, [boardId]: newBoard };
      localStorage.setItem("Boards", JSON.stringify(newWholeBoards));
      return newWholeBoards;
    });
    setValue("toDo", "");
  };
  const handleDelete = (id: number) => {
    setToDos((curBoards) => {
      const newBoard = curBoards[boardId].filter((toDo) => toDo.id !== id);
      const newWholeBoards = { ...curBoards, [boardId]: newBoard };
      localStorage.setItem("Boards", JSON.stringify(newWholeBoards));
      return newWholeBoards;
    });
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add a task on ${boardId}`}
          autoComplete="off"
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                toDoId={toDo.id}
                toDoText={toDo.text}
                index={index}
                onDelete={handleDelete}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
