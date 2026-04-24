interface StepIndicatorProps {
  total: number;
  current: number;
}

export default function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i <= current
              ? 'w-6 sm:w-8 bg-brass-500'
              : 'w-3 sm:w-4 bg-stone-300'
          }`}
        />
      ))}
    </div>
  );
}
