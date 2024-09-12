import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const Button = styled.button`
  position: absolute;
  border: none;
  background-color: inherit;
  right: 15px;
  top: 13px;
  opacity: 0.5;
  transition: opacity 0.3s ease-in;
  height: 10px;
  &:hover {
    opacity: 1;
  }
`;

interface ITrashCan {
  onDelete: () => void;
}

function TrashCan({ onDelete }: ITrashCan) {
  return (
    <Button onClick={onDelete}>
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  );
}

export default TrashCan;
