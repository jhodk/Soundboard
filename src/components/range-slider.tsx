import { ChangeEvent, FC } from "react";

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  localStorageKey: string;
  defaultValue: number;
  updateFn: (value: number) => void;
  label: string;
}

export const RangeSlider: FC<RangeSliderProps> = ({label, localStorageKey, updateFn, defaultValue, ...rest}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    updateFn(parseInt(event.target.value, 10));
  }

  return (
    <div className="block">
  <label>{label}</label>
  <input
      type="range"
      className="inline w-[20rem] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      onChange={handleChange}
      value={localStorage.getItem(localStorageKey) ?? defaultValue}
      {...rest}
      />
    </div>
  )
}
