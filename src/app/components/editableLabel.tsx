import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  useState,
  useEffect,
} from "react";
import styles from "./editableLabel.module.css";
import classNames from "classnames";

interface EditableLabelProps {
  text: string;
  fieldName: string;
  inputMode: "text" | "numeric";
  onUpdate: (field: string, value: string) => void;
}

export function EditableLabel({
  text,
  fieldName,
  inputMode,
  onUpdate,
}: EditableLabelProps) {
  const [isEditingMode, setIsEditingMode] = useState(false);

  function updateValue(
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    //  Capture the event and get the new value
    let target = event.target as HTMLInputElement;
    let newValue = target.value;

    //  If user clicks outside of edit box without supplying a new value,
    //  set it back to the previous value
    if (newValue === "") {
      newValue = target.placeholder;
    }

    //  Utilize provided callback function from parent
    onUpdate(fieldName, newValue);

    //  Exit editing mode
    setIsEditingMode(false);
  }

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    updateValue(event);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.code === "Enter" ||
      event.key === "Enter" ||
      event.code === "NumpadEnter"
    ) {
      event.preventDefault();
      updateValue(event);
    }
  };

  return isEditingMode ? (
    //  If selected, return an editable text field
    <input
      className={styles.editable_input}
      type="text"
      inputMode={inputMode}
      placeholder={text}
      onBlur={(event) => onBlur(event)}
      onKeyDown={(event) => onKeyDown(event)}
      onKeyUp={(event) => onKeyDown(event)}
      autoFocus={true}
    ></input>
  ) : (
    <p onClick={() => setIsEditingMode(true)}>{text}</p>
  );
}
