const Maintenance = () => {
  return (
    <div className="bg-gray-200 font-sans leading-normal tracking-normal">
      <section className="bg-white py-20">
        <main className="flex-grow flex items-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-indigo-500 opacity-20 floating"></div>
            <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-purple-500 opacity-20 floating-slow"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-pink-500 opacity-20 floating-slower"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-indigo-300 opacity-20 floating"></div>
          </div>

          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Something{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Amazing
                  </span>{" "}
                  is Coming Soon
                </h1>
                <p className="text-lg md:text-xl text-indigo-500 mb-8 max-w-lg mx-auto md:mx-0">
                  We're working hard to bring you our new platform. Subscribe to
                  be the first to know when we launch and get exclusive early
                  access.
                </p>

                <div className="mt-10 flex justify-center md:justify-start space-x-6">
                  <a
                    href="#"
                    className="text-indigo-300 hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="text-indigo-300 hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="text-indigo-300 hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-facebook text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="text-indigo-300 hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
                  <img
                    src="https://cdn.pixabay.com/photo/2018/11/29/21/51/social-media-3846597_1280.png"
                    alt="Illustration"
                    className="relative z-10 mx-auto floating-slow"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">What to expect</h2>
            <p className="text-gray-600 mb-12">
              We're working on something exciting! Our AI-powered resume builder
              will help you craft a professional, standout resume with smart
              insights tailored to your career goals. Get ready to create a
              resume that gets noticed!
            </p>
          </div>
          <div className="flex flex-wrap -mx-4 mt-12">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="rounded-md bg-white shadow-md p-8">
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  01 AI-Powered Suggestions
                </div>
                <h3 className="text-2xl font-bold mb-4">Feature 1</h3>
                <p className="text-gray-600 mb-4">
                  Get personalized recommendations to enhance your resume.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="rounded-md bg-white shadow-md p-8">
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  02 Smart Formatting
                </div>
                <h3 className="text-2xl font-bold mb-4">Feature 2</h3>
                <p className="text-gray-600 mb-4">
                  Professionally designed templates to make your resume
                  ATS-friendly.
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="rounded-md bg-white shadow-md p-8">
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  03 Skill & Job Match
                </div>
                <h3 className="text-2xl font-bold mb-4">Feature 3</h3>
                <p className="text-gray-600 mb-4">
                  Highlight skills that match your target job roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Maintenance;
