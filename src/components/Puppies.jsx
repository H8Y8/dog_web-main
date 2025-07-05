const Puppies = () => {
  return (
    <section id="puppies" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">新生幼犬</h2>
          <p className="mt-4 text-lg text-gray-600">可愛的新生小狗等待新家</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 幼犬資訊將在這裡添加 */}
        </div>
      </div>
    </section>
  );
};

export default Puppies; 