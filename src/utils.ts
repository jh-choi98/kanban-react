import { IToDoState } from "./atoms";

// store in local storage
export function saveLocalStorage(WholeBoards: IToDoState) {
  localStorage.setItem("Boards", JSON.stringify(WholeBoards));
}
