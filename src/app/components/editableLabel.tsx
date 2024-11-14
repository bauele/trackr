import { useState } from "react";
import styles from "./editableLabel.module.css";
import React from "react";
import classNames from "classnames";

interface EditableLabelProps {
  text: string;
  fieldName: string;
  inputMode: "text" | "numeric";

  //  This props allows the editing mode to be set
  //  from parent component without having to move this
  //  component's entire state and logic to parent
  isExternalEditing: boolean;
  onUpdate: (field: string, value: string) => void;
}

export function EditableLabel({
  text,
  fieldName,
  inputMode,
  isExternalEditing,
  onUpdate,
}: EditableLabelProps) {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [errorMode, setErrorMode] = useState(false);

  function updateValue(
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    //  Capture the event and get the new value
    const target = event.target as HTMLInputElement;
    let newValue = target.value;

    //  If user clicks outside of edit box without supplying a new value,
    //  set it back to the previous value
    if (newValue === "") {
      newValue = target.placeholder;
    }

    //  If input mode is numeric, prevent user
    //  from supplying any nondigits
    if (inputMode === "numeric") {
      const validInput = /^\d+$/.test(newValue);
      if (!validInput) {
        setErrorMode(true);
        return;
      }
    }

    //  Utilize provided callback function from parent
    onUpdate(fieldName, newValue);

    //  Exit editing mode
    setErrorMode(false);
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

  return isEditingMode || isExternalEditing ? (
    //  If selected, return an editable text field
    <input
      className={classNames(
        styles.editable_input,
        errorMode && styles.input_error
      )}
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
