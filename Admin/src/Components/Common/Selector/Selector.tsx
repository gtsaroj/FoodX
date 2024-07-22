import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../@/components/ui/select";

interface SelectProp {
  options: { label: string; value: string }[];
  value: string;
  selectedOption: (value: string) => void;
  placeholder: string;
}

export const Selector: React.FC<SelectProp> = ({ options, placeholder }) => {
  return (
    <div className="w-full z-[111000] bg-slate-300">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full bg-slate-400 z-[100]">
          {options?.map((option, index) => (
            <SelectItem
              className="w-full cursor-pointer hover:bg-slate-100"
              key={index}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
