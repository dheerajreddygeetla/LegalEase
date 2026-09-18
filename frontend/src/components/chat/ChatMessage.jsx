const ChatMessage = ({ message }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-brand-600 to-primary-600 text-white'
            : 'bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.sources?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium mb-2 opacity-70">Sources:</p>
            {message.sources.map((source, index) => (
              <p key={index} className="text-xs opacity-70">
                {source.title}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
