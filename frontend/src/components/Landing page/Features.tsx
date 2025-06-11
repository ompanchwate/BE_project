const Features = () => {
  const features = [
    {
      icon: "🤟",
      title: "Real-time Sign Language Recognition",
      description: "Advanced AI technology recognizes Indian Sign Language gestures with 99.9% accuracy in real-time.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🗣️",
      title: "Bidirectional Communication",
      description: "Seamless two-way communication between patients and healthcare providers through sign language and speech.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "📱",
      title: "Mobile & Web Platform",
      description: "Access our platform from any device - smartphone, tablet, or computer for maximum convenience.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🏥",
      title: "Healthcare Integration",
      description: "Seamlessly integrates with existing healthcare systems and electronic health records.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "📋",
      title: "Digital Prescriptions",
      description: "Doctors can provide visual prescriptions and treatment plans that are easy to understand.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "HIPAA-compliant platform ensuring all medical communications are secure and confidential.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionizing Healthcare Communication
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our cutting-edge platform bridges the communication gap between deaf patients and healthcare providers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
