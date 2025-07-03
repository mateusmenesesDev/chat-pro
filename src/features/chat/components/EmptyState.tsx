export const EmptyState = () => {
  return (
    <div className="animate-fade-in flex h-full flex-col items-center justify-center py-16">
      <div className="shadow-premium mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <svg
          className="text-primary-foreground h-10 w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>

      <h3 className="mb-2 text-xl font-semibold">Start your conversation</h3>
      <p className="text-muted-foreground max-w-sm text-center">
        This is the beginning of your conversation with{" "}
        <span className="font-medium">the ChatPro</span>. Send a message to get
        started!
      </p>
    </div>
  );
};
