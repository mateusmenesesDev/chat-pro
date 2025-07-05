export const EmptyState = () => {
  return (
    <div className="animate-fade-in flex h-full flex-col items-center justify-center p-4 sm:py-16">
      <div className="shadow-premium mb-4 flex h-16 w-16 items-center justify-center rounded-full sm:mb-6 sm:h-20 sm:w-20">
        <svg
          className="text-primary h-8 w-8 sm:h-10 sm:w-10"
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

      <h3 className="mb-2 text-lg font-semibold sm:text-xl">
        Start your conversation
      </h3>
      <p className="text-muted-foreground max-w-[250px] text-center text-sm sm:max-w-sm sm:text-base">
        This is the beginning of your conversation. Send a message to get
        started!
      </p>
    </div>
  );
};
