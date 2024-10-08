import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { saveLocalStorage } from "./utils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0px 10%;
`;

const Header = styled.div`
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  border-radius: 10px;
  width: 70%;
  height: 50px;
  border: none;
  padding: 0px 15px;
  transition: box-shadow 0.3s ease-in;
  &:focus {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.7);
  }
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 4%;
  overflow-y: auto;
  margin-bottom: 30px;
  scrollbar-width: none;
  // fr은 그리드 컨테이너의 가용 공간을 비율로 나누는 단위

  // repeat(3, fr): 가용 공간을 1/3씩 나눠 쓰겠다.
  // == grid-template-columns: 1fr 1fr 1fr;

  // grid-template-columns: repeat(2, 1fr 2fr);
  // == grid-template-columns: 1fr 2fr 1fr 2fr
  // 가용 공간을 6등분한 뒤, 4개의 열에 각각 1/6, 2/6, 1/6, 2/6씩 할당
`;

interface ICategory {
  newCategoryKey: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<ICategory>();
  const onCategorySubmit = ({ newCategoryKey }: ICategory) => {
    if (newCategoryKey === "") return;
    if (newCategoryKey in toDos) {
      setValue("newCategoryKey", "");
      return;
    }
    const newWholeBoards = { ...toDos, [newCategoryKey]: [] };
    saveLocalStorage(newWholeBoards);
    setToDos(newWholeBoards);
    setValue("newCategoryKey", "");
  };

  const onDragEnd = (info: DropResult) => {
    // console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // movement in the same board
      setToDos((curBoards) => {
        const newBoard = [...curBoards[source.droppableId]];
        const targetToDo = newBoard.splice(source.index, 1)[0];
        newBoard.splice(destination.index, 0, targetToDo);
        const newWholeBoards = {
          ...curBoards,
          [source.droppableId]: newBoard,
        };
        saveLocalStorage(newWholeBoards);
        return newWholeBoards;
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // movement across boards
      setToDos((curBoards) => {
        const sourceBoard = [...curBoards[source.droppableId]];
        const destBoard = [...curBoards[destination.droppableId]];
        const targetToDo = sourceBoard.splice(source.index, 1)[0];
        destBoard.splice(destination.index, 0, targetToDo);
        const newWholeBoards = {
          ...curBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destBoard,
        };
        saveLocalStorage(newWholeBoards);
        return newWholeBoards;
      });
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    setToDos((curBoards) => {
      const { [boardId]: _, ...newWholeBoards } = curBoards;
      saveLocalStorage(newWholeBoards);
      return newWholeBoards;
    });
  };

  useEffect(() => {
    const storedBoardsString = localStorage.getItem("Boards");
    if (storedBoardsString) {
      setToDos(JSON.parse(storedBoardsString));
    }
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Header>
          <Form onSubmit={handleSubmit(onCategorySubmit)}>
            <Input
              {...register("newCategoryKey")}
              placeholder="Create your own categories"
              autoComplete="off"
            />
          </Form>
        </Header>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board
              key={boardId}
              boardId={boardId}
              toDos={toDos[boardId]}
              onDeleteBoard={handleDeleteBoard}
            />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;

// 1. Make it pretty
// 2. Implement delete (tash can)
// 3. Implement droppable board
