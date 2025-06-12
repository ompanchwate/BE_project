import PriyaImg from "./images/1.jpg";
import AnilImg from "./images/2.jpg";
import RahulImg from "./images/3.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "ENT Specialist, AIIMS Delhi",
      content:
        "HandyTalk has revolutionized how I communicate with my deaf patients. The accuracy is incredible and it has made consultations so much more effective.",
      avatarUrl: PriyaImg, // Example hosted image
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      role: "Asthma Patient",
      content:
        "For the first time, I felt truly understood by my doctor. This technology is life-changing for the differently-abled community in India.",
      avatarUrl: RahulImg,
      rating: 5,
    },
    {
      name: "Dr. Anil Gupta",
      role: "Cardiologist, Max Hospital",
      content:
        "The bidirectional communication feature allows me to explain complex medical conditions clearly. My patients leave with better understanding.",
      avatarUrl: AnilImg,
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what doctors and patients are saying about SignHealth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                {/* <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div> */}
                <img
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
