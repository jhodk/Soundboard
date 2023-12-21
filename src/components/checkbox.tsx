import React, { ChangeEvent, FC } from "react";

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  localStorageKey: string;
  updateFn: (value: boolean) => void;
  label: string;
}

export const Checkbox: FC<CheckboxProps> = ({id, updateFn, label, localStorageKey, defaultValue, ...rest}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    updateFn(event.target.checked);
  }

  return (
    <div className="block">
  <label htmlFor={id}>{label}</label>
  <input
      id={id}
      type="checkbox"
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      onChange={handleChange}
      checked={localStorage.getItem(localStorageKey) === "true"}
      {...rest}
      />
    </div>
  )
}