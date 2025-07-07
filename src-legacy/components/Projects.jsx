const Projects = () => {
  const projects = [
    {
      title: "專案一",
      description: "這是一個使用 React 和 Tailwind CSS 開發的專案",
      // image: "/images/project1.jpg",
      tags: ["React", "Tailwind CSS", "JavaScript"],
    },
    {
      title: "專案二",
      description: "一個響應式網站設計專案",
      // image: "/images/project2.jpg",
      tags: ["HTML", "CSS", "JavaScript"],
    },
    // 可以添加更多專案
  ];

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">作品集</h2>
          <p className="mt-4 text-lg text-gray-600">這些是我最近完成的一些專案</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                // src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects; 