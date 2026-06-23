import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchItem } from "@/types";

interface SearchResultItemProps {
  item: SearchItem;
  onSelect: () => void;
}

export function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
    >
      <div>
        <div className="font-semibold text-slate-900">{item.label}</div>
        <div className="text-xs text-slate-500 mt-1 uppercase">{item.type}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400" />
    </Link>
  );
}
