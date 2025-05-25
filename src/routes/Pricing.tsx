import { Loader } from "lucide-react";
import { db } from "@/config/firebase.config";
import { User } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Pricing = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const storeUserData = async () => {
      if (isSignedIn && user) {
        try {
          const userSanp = await getDoc(doc(db, "users", user.id));
          console.log("Profile User", userSanp.data());
          setUserData({
            ...userSanp.data(),
          } as User);
        } catch (error) {
          console.log("Error on Loading the user data : ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    storeUserData();
  }, [isSignedIn, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 m-10">
        <Loader className="min-w-4 min-h-4 animate-spin text-emerald-500" />
      </div>
    );
  }
  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black lg:text-5xl sm:text-5xl">
            Pricing &amp; Plans
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Unlock the power of AI for your career growth. From interview prep
            and job search to resume building – everything you need in one
            place.
          </p>
        </div>
      </div>

      <section className="my-16">
        <div className="p-4 lg:p-0">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-5 rounded-md bg-gray-100 p-8">
              <div className="flex items-center justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  className="mr-1.5 h-4 w-4 rotate-180 transform text-gray-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  ></path>
                </svg>{" "}
                <h2 className="text-sm font-semibold text-gray-700">
                  What's included with your Full Access Pass
                </h2>
              </div>{" "}
              <div className="space-y-5">
                <div className="flex items-start justify-start space-x-4">
                  <div
                    className="w-10 h-10 block flex flex-shrink-0 justify-center items-center rounded-lg"
                    style={{ backgroundColor: "rgb(247, 149, 51)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div className="flex flex-col">
                    <div className="flex justify-start items-center contents-center">
                      <h3 className="font-semibold m-0">
                        AI-Powered Interview Practice
                      </h3>{" "}
                    </div>{" "}
                    <p className="text-sm text-gray-700">
                      Simulate real interviews with AI-generated questions based
                      on your role. Speak your answers and receive instant
                      feedback.
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start justify-start space-x-4">
                  <div
                    className="w-10 h-10 block flex flex-shrink-0 justify-center items-center rounded-lg"
                    style={{ backgroundColor: "rgb(243, 112, 85)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div className="flex flex-col">
                    <div className="flex justify-start items-center contents-center">
                      <h3 className="font-semibold m-0">Job Role Insights</h3>{" "}
                    </div>{" "}
                    <p className="text-sm text-gray-700">
                      Search job roles and explore detailed roadmaps, required
                      skills, salary info, and live job openings.
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start justify-start space-x-4">
                  <div
                    className="w-10 h-10 block flex flex-shrink-0 justify-center items-center rounded-lg"
                    style={{ backgroundColor: "rgb(239, 78, 123)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div className="flex flex-col">
                    <div className="flex justify-start items-center contents-center">
                      <h3 className="font-semibold m-0">AI Resume Builder</h3>{" "}
                    </div>{" "}
                    <p className="text-sm text-gray-700">
                      Craft personalized resumes with AI suggestions tailored to
                      your desired roles.
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start justify-start space-x-4">
                  <div
                    className="w-10 h-10 block flex flex-shrink-0 justify-center items-center rounded-lg"
                    style={{ backgroundColor: "rgb(161, 102, 171" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div className="flex flex-col">
                    <div className="flex justify-start items-center contents-center">
                      <h3 className="font-semibold m-0">
                        Unlimited Role Searches
                      </h3>{" "}
                    </div>{" "}
                    <p className="text-sm text-gray-700">
                      Explore as many roles and opportunities as you like.
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start justify-start space-x-4">
                  <div
                    className="w-10 h-10 block flex flex-shrink-0 justify-center items-center rounded-lg"
                    style={{ backgroundColor: "rgb(80, 115, 184)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div className="flex flex-col">
                    <div className="flex justify-start items-center contents-center">
                      <h3 className="font-semibold m-0">Real-time Feedback</h3>{" "}
                    </div>{" "}
                    <p className="text-sm text-gray-700">
                      Get detailed insights to improve your responses and stand
                      out in interviews.
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start justify-start space-x-4">
                  <div
                    className="w-10 h-10 block flex flex-shrink-0 justify-center items-center rounded-lg"
                    style={{ backgroundColor: "rgb(16, 152, 173)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div className="flex flex-col">
                    <div className="flex justify-start items-center contents-center">
                      <h3 className="font-semibold m-0">Regular Updates</h3>{" "}
                    </div>{" "}
                    <p className="text-sm text-gray-700">
                      We're constantly adding new features and enhancements to
                      help you stay ahead.
                    </p>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="grid grid-cols-1 grid-rows-3 gap-4">
              <div className="relative rounded-xl border border-black bg-gray-900">
                <div className="p-6 md:px-8">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <p className="text-xl font-semibold text-white md:text-2xl">
                        Current
                      </p>{" "}
                    </div>{" "}
                    <div className="col-span-3 mt-5 xl:mt-0">
                      <p className="text-lg font-normal text-gray-200">
                        <span className="font-bold text-green-500">Basic</span>
                      </p>{" "}
                      <p className="text-xs text-gray-400">
                        remaining {String(userData?.requests)} requests
                      </p>{" "}
                      <div className="group relative mt-6 inline-flex items-center justify-center">
                        <div className="group-hover:shadow-cyan-500/50 absolute -inset-px rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-200 group-hover:shadow-lg"></div>{" "}
                        <a
                          href=""
                          className="pointer-events-none cursor-not-allowed relative inline-flex items-center justify-center rounded-full border border-transparent bg-black px-8 py-3 text-sm font-normal text-white hover:bg-gray-900 md:text-xs lg:text-base"
                          title=""
                          role="button"
                          onClick={(e) => e.preventDefault()}
                        >
                          {userData?.requests ?? 0 > 0 ? "Active" : "Ended"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="relative rounded-xl border border-black bg-gray-900">
                <p className="absolute top-0 left-5 -translate-y-1/2 transform rounded-md bg-yellow-500 py-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-white md:left-7">
                  Limited time deal!
                </p>{" "}
                <div className="p-6 md:px-8">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <p className="text-2xl font-semibold text-white md:text-3xl">
                        ₹5999
                      </p>{" "}
                      <p className="text-xs text-gray-400 space-x-1 mt-2">
                        <div className="text-red-500">₹6000</div>
                        <span className="text-green-500">Save 50%</span>
                      </p>{" "}
                      <p className="mt-1 whitespace-nowrap text-xs font-normal text-gray-400">
                        Renews every year,
                        <br />
                        cancel any time
                      </p>{" "}
                    </div>{" "}
                    <div className="col-span-3 mt-5 xl:mt-0">
                      <p className="text-lg font-normal text-gray-200">
                        <span className="font-bold text-yellow-500">
                          One year{" "}
                        </span>
                        full access
                      </p>{" "}
                      <p className="text-xs text-gray-400">
                        Unlimited downloads and access.
                      </p>{" "}
                      <div className="group relative mt-6 inline-flex items-center justify-center">
                        <div className="group-hover:shadow-cyan-500/50 absolute -inset-px rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-200 group-hover:shadow-lg"></div>{" "}
                        <button
                          title=""
                          role="button"
                          className="relative inline-flex items-center justify-center rounded-full border border-transparent bg-purple-500 px-8 py-3 text-sm font-normal text-white hover:bg-gray-900 md:text-xs lg:text-base"
                        >
                          <p>Get one year access!</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="relative rounded-xl border border-black bg-gray-900">
                <div className="p-6 md:px-8">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <p className="text-2xl font-semibold text-white md:text-3xl">
                        ₹3999
                      </p>{" "}
                      <p className="mt-1 whitespace-nowrap text-xs font-normal text-gray-400">
                        Renews every quarter,
                        <br />
                        cancel any time
                      </p>
                    </div>{" "}
                    <div className="col-span-3 mt-5 xl:mt-0">
                      <p className="text-lg font-normal text-gray-200">
                        <span className="font-bold text-purple-500">
                          Three months{" "}
                        </span>
                        full access
                      </p>{" "}
                      <p className="text-xs text-gray-400">
                        Unlimited downloads and access.
                      </p>{" "}
                      <div className="group relative mt-6 inline-flex items-center justify-center">
                        <div className="group-hover:shadow-cyan-500/50 absolute -inset-px rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-200 group-hover:shadow-lg"></div>{" "}
                        <a
                          href="/checkout/subscription/?price=price_1KnCPdIWuhrqLwPqm6Fm9JSN"
                          className="relative inline-flex items-center justify-center rounded-full border border-transparent bg-black px-8 py-3 text-sm font-normal text-white hover:bg-gray-900 md:text-xs lg:text-base"
                          title=""
                          role="button"
                        >
                          {" "}
                          Get three months access{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Pricing;
//4dcd4edc27mshc1ca25d7f792f00p1483d4jsna7af78dd5069
