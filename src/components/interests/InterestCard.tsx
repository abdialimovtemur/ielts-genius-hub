// components/interests/InterestCard.tsx
import Image from "next/image";
import { Check } from "lucide-react";
import { Interest } from "@/types/interest";

interface InterestCardProps {
  interest: Interest;
  isSelected: boolean;
  onToggle: (interestId: string) => void;
}

export default function InterestCard({ interest, isSelected, onToggle }: InterestCardProps) {
  // Matn uzunligiga qarab column span ni aniqlaymiz
  const getColumnSpan = () => {
    const length = interest.name.length;
    if (length <= 8) return 1;
    if (length <= 16) return 2;
    return 3;
  };

  const columnSpan = getColumnSpan();

  // Mobile uchun column span - 3 columnli cardlarni 2 column qilamiz
  const mobileColumnSpan = columnSpan === 3 ? 2 : columnSpan;

  return (
    <div
      onClick={() => onToggle(interest._id)}
      className={`
        relative cursor-pointer group transition-all duration-200 ease-out
        ${isSelected ? "transform scale-[1.02]" : "hover:scale-[1.01]"}
        col-span-${mobileColumnSpan} md:col-span-${columnSpan}
      `}
      style={{ 
        gridColumn: `span ${mobileColumnSpan} / span ${mobileColumnSpan}`,
        // Media query uchun inline style
        ...(typeof window !== 'undefined' && window.innerWidth >= 768 && {
          gridColumn: `span ${columnSpan} / span ${columnSpan}`
        })
      }}
    >
      <div className={`
        relative p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 h-full
        ${isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
        }
      `}>
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}

        {/* Icon */}
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 flex-shrink-0
        `}>
          <div className="relative w-12 h-12">
            <Image
              src={interest.icon ? `https://dead.uz${interest.icon}` : "/images/interest-placeholder.svg"}
              alt={interest.name}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';

                // Show fallback text icon
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full flex items-center justify-center text-sm';
                  fallback.textContent = '🎯';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Interest name */}
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-medium text-sm transition-colors duration-200
            ${isSelected ? "text-primary font-semibold" : "text-gray-700"}
          `}>
            {interest.name}
          </h3>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className={`
        absolute inset-0 rounded-xl transition-opacity duration-200 pointer-events-none
        ${isSelected
          ? "bg-primary/5 opacity-100"
          : "bg-gray-50/50 opacity-0 group-hover:opacity-100"
        }
      `} />
    </div>
  );
}