import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0px 10%;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 4%;
  // fr은 그리드 컨테이너의 가용 공간을 비율로 나누는 단위

  // repeat(3, fr): 가용 공간을 1/3씩 나눠 쓰겠다.
  // == grid-template-columns: 1fr 1fr 1fr;

  // grid-template-columns: repeat(2, 1fr 2fr);
  // == grid-template-columns: 1fr 2fr 1fr 2fr
  // 가용 공간을 6등분한 뒤, 4개의 열에 각각 1/6, 2/6, 1/6, 2/6씩 할당
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // movement in the same board
      setToDos((curBoards) => {
        const newBoard = [...curBoards[source.droppableId]];
        const targetToDo = newBoard.splice(source.index, 1)[0];
        newBoard.splice(destination.index, 0, targetToDo);
        return {
          ...curBoards,
          [source.droppableId]: newBoard,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // movement across boards
      setToDos((curBoards) => {
        const sourceBoard = [...curBoards[source.droppableId]];
        const destBoard = [...curBoards[destination.droppableId]];
        const targetToDo = sourceBoard.splice(source.index, 1)[0];
        destBoard.splice(destination.index, 0, targetToDo);
        return {
          ...curBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={toDos[boardId]} />
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
// 4. Implement user-defined boards
// 5. localStorage
