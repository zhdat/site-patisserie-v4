import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectCategory() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Catégories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous</SelectItem>
        <SelectItem value="noel">Noël</SelectItem>
        <SelectItem value="paques">Pâques</SelectItem>
      </SelectContent>
    </Select>
  );
}
