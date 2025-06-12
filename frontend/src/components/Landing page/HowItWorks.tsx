import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      step: "01",
      title: "Patient Signs In",
      description:
        "Differently-abled patients use Indian Sign Language Symptoms through our camera interface",
      icon: "👋",
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      title: "AI Translation",
      description:
        "Our advanced AI instantly translates Indian Sign Language Symptoms into text and speech",
      icon: "🤖",
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "03",
      title: "Doctor Responds",
      description:
        "Healthcare provider responds verbally or through text, which is converted to visual format",
      icon: "👩‍⚕️",
      color: "from-green-500 to-teal-500",
    },
    {
      step: "04",
      title: "Digital Prescription",
      description:
        "Doctor provides visual prescriptions and treatment plans for better understanding",
      icon: "📋",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How HandyTalk Works??
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, seamless, and secure communication in four easy steps
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div
                    className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-sm font-bold text-gray-700">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Experience the Technology
              </h3>
              <p className="text-gray-600 mb-6">
                Our platform uses cutting-edge deep learning algorithms trained
                specifically on Indian Sign Language to ensure accurate
                communication between patients and healthcare providers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    99.9% accuracy in sign language recognition
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Real-time translation under 2 seconds
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    24/7 availability for emergency situations
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <div className="text-xl font-semibold text-gray-700 mb-2">
                Ready to Transform Healthcare?
              </div>
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                onClick={() => navigate("/signin")}
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
