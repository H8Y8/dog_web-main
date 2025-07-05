const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`pt-32 min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer; 