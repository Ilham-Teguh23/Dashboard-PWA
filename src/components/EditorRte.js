import React, { useState } from "react";
import PropTypes from "prop-types";
import RichTextEditor from "react-rte";

function EditorRte(props) {
  const [value, setValue] = useState(
    !props.defaultValue
      ? RichTextEditor.createEmptyValue()
      : RichTextEditor.createValueFromString(props.defaultValue, "html")
  );

  const onChange = (newValue) => {
    setValue(newValue);
    if (props.onChange) {
      props.onChange(newValue.toString("html"));
    }
  };

  return <RichTextEditor value={value} onChange={onChange} />;
}

EditorRte.propTypes = {
  onChange: PropTypes.func,
};

export default EditorRte;
