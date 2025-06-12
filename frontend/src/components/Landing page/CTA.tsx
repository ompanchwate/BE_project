import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Bridge the Communication Gap?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of healthcare providers and patients who are already
            experiencing seamless communication through HandyTalk.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              onClick={() => navigate("/signin")}
            >
              Start Free Trial
            </button>
            {/* <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all">
              Contact Sales
            </button> */}
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-lg font-semibold text-white mb-2">
                Quick Setup
              </div>
              <div className="text-blue-100">
                Get started in under 5 minutes
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-lg font-semibold text-white mb-2">
                24/7 Support
              </div>
              <div className="text-blue-100">Round-the-clock assistance</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-lg font-semibold text-white mb-2">
                HIPAA Compliant
              </div>
              <div className="text-blue-100">
                Secure and private communication
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
