interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {icon && (
        <div className="mb-4 text-gray-600 opacity-60" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-gray-500 text-center text-lg font-medium">{message}</p>
      <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
    </div>
  );
}
