// components/reading/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="min-h-full bg-secondary/20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}