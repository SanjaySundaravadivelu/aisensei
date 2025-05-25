import React, { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { chatSession } from "@/scripts";
import { db } from "@/config/firebase.config";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { User } from "@/types";
import { Link } from "react-router-dom";
import "./thememin.css";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
const apiKey = import.meta.env.VITE_JOBS_API_KEY!;
import img1 from "/assets/img/img1.png";
import img2 from "/assets/img/img2.png";

interface Job {
  job_posted_at: ReactNode;
  employer_logo: string | undefined;
  job_employment_type: ReactNode;
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string;
  job_country: string;
  job_apply_link: string;
}

interface RoadmapNode {
  level1: string;
  description1: string;
  level2: string;
  description2: string;
  level3: string;
  description3: string;
}

interface JobInsights {
  skills: string[];
  roadmap: RoadmapNode;
  salary: string;
  resources: { title: string; link: string }[];
}

const JobSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [insights, setInsights] = useState<JobInsights | null>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const subOne = async (userId: string) => {
    if (!userId) return console.error("❌ No user ID provided");

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("❌ User not found");
      return;
    }

    const userData = userSnap.data();
    const currentRequests = userData?.requests ?? 0;

    if (currentRequests <= 0) {
      storeUserData();
      console.warn("⚠️ No requests remaining");
      return;
    }

    await updateDoc(userRef, {
      requests: currentRequests - 1,
      updateAt: new Date(), // You can use serverTimestamp() if you prefer
    });
  };

  const searchJobs = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        params: {
          query,
          page: "1",
          num_pages: "1",
        },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);
  };
  const cleanJsonResponse = (responseText: string) => {
    try {
      const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const fetchJobInsights = async () => {
    if (!query) return;
    const prompt = `Provide top 5 insights for the job role: "${query}". Include:
      - Key skills required only top 5
      - Career roadmap as a structured JSON in this format {level1:string,descrption1:string,level2:string,description2:string} in same level tree only three levels
      - Average salary in India only value
      - Useful learning resources (title + link) minimum 5
      Return the result in JSON format with fields "skills", "roadmap", "salary", and "resources".`;
    try {
      const aiResponse = await chatSession.sendMessage(prompt);
      const parsedInsights = cleanJsonResponse(
        aiResponse?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
      );
      setInsights(parsedInsights);
    } catch (error) {
      setInsights(null);
    }
  };

  const RoadmapTree: React.FC<{ roadmap: any }> = ({ roadmap }) => {
    return (
      <>
        <div>
          <div className="group relative flex gap-x-5">
            <div className="relative group-last:after:hidden after:absolute after:top-8 after:bottom-2 after:start-3 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
              <div className="relative z-10 size-6 flex justify-center items-center">
                <svg
                  className="shrink-0 size-6 text-gray-600 dark:text-neutral-400"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                    fill="#36C5F0"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                    fill="#2EB67D"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                    fill="#ECB22E"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                    fill="#E01E5A"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="grow pb-8 group-last:pb-0">
              <h3 className="mb-1 text-xs text-gray-600 dark:text-neutral-400">
                Level 1
              </h3>

              <p className="font-semibold text-sm text-gray-800 dark:text-neutral-200">
                {roadmap.level1}
              </p>

              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                {roadmap.description1}
              </p>
            </div>
          </div>

          <div className="group relative flex gap-x-5">
            <div className="relative group-last:after:hidden after:absolute after:top-8 after:bottom-2 after:start-3 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
              <div className="relative z-10 size-6 flex justify-center items-center">
                <svg
                  className="shrink-0 size-6 text-gray-600 dark:text-neutral-400"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                    fill="#36C5F0"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                    fill="#2EB67D"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                    fill="#ECB22E"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                    fill="#E01E5A"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="grow pb-8 group-last:pb-0">
              <h3 className="mb-1 text-xs text-gray-600 dark:text-neutral-400">
                Level 2
              </h3>

              <p className="font-semibold text-sm text-gray-800 dark:text-neutral-200">
                {roadmap.level2}
              </p>

              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                {roadmap.description2}
              </p>
            </div>
          </div>

          <div className="group relative flex gap-x-5">
            <div className="relative group-last:after:hidden after:absolute after:top-8 after:bottom-2 after:start-3 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
              <div className="relative z-10 size-6 flex justify-center items-center">
                <svg
                  className="shrink-0 size-6 text-gray-600 dark:text-neutral-400"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                    fill="#36C5F0"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                    fill="#2EB67D"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                    fill="#ECB22E"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                    fill="#E01E5A"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="grow pb-8 group-last:pb-0">
              <h3 className="mb-1 text-xs text-gray-600 dark:text-neutral-400">
                Level 3
              </h3>

              <p className="font-semibold text-sm text-gray-800 dark:text-neutral-200">
                {roadmap.level3}
              </p>

              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                {roadmap.description3}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };
  const [userData, setUserData] = useState<User | null>(null);
  const storeUserData = async () => {
    if (isSignedIn && user) {
      setLoading(true);
      try {
        const userSanp = await getDoc(doc(db, "users", user.id));
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
  useEffect(() => {
    storeUserData();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 m-10">
        <Loader className="min-w-4 min-h-4 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <>
      {(userData?.requests ?? 1) <= 0 ? (
        <>
          <div className=" h-screen justify-center">
            <center className="mt-24 m-auto">
              <svg
                className="emoji-404 "
                enable-background="new 0 0 226 249.135"
                height="249.135"
                id="Layer_1"
                overflow="visible"
                version="1.1"
                viewBox="0 0 226 249.135"
                width="226"
                xmlSpace="preserve"
              >
                <circle cx="113" cy="113" fill="#FFE585" r="109" />
                <line
                  enable-background="new    "
                  fill="none"
                  opacity="0.29"
                  stroke="#6E6E96"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="8"
                  x1="88.866"
                  x2="136.866"
                  y1="245.135"
                  y2="245.135"
                />
                <line
                  enable-background="new    "
                  fill="none"
                  opacity="0.17"
                  stroke="#6E6E96"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="8"
                  x1="154.732"
                  x2="168.732"
                  y1="245.135"
                  y2="245.135"
                />
                <line
                  enable-background="new    "
                  fill="none"
                  opacity="0.17"
                  stroke="#6E6E96"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="8"
                  x1="69.732"
                  x2="58.732"
                  y1="245.135"
                  y2="245.135"
                />
                <circle cx="68.732" cy="93" fill="#6E6E96" r="9" />
                <path
                  d="M115.568,5.947c-1.026,0-2.049,0.017-3.069,0.045  c54.425,1.551,98.069,46.155,98.069,100.955c0,55.781-45.219,101-101,101c-55.781,0-101-45.219-101-101  c0-8.786,1.124-17.309,3.232-25.436c-3.393,10.536-5.232,21.771-5.232,33.436c0,60.199,48.801,109,109,109s109-48.801,109-109  S175.768,5.947,115.568,5.947z"
                  enable-background="new    "
                  fill="#FF9900"
                  opacity="0.24"
                />
                <circle cx="156.398" cy="93" fill="#6E6E96" r="9" />
                <ellipse
                  cx="67.732"
                  cy="140.894"
                  enable-background="new    "
                  fill="#FF0000"
                  opacity="0.18"
                  rx="17.372"
                  ry="8.106"
                />
                <ellipse
                  cx="154.88"
                  cy="140.894"
                  enable-background="new    "
                  fill="#FF0000"
                  opacity="0.18"
                  rx="17.371"
                  ry="8.106"
                />
                <path
                  d="M13,118.5C13,61.338,59.338,15,116.5,15c55.922,0,101.477,44.353,103.427,99.797  c0.044-1.261,0.073-2.525,0.073-3.797C220,50.802,171.199,2,111,2S2,50.802,2,111c0,50.111,33.818,92.318,79.876,105.06  C41.743,201.814,13,163.518,13,118.5z"
                  fill="#FFEFB5"
                />
                <circle
                  cx="113"
                  cy="113"
                  fill="none"
                  r="109"
                  stroke="#6E6E96"
                  stroke-width="8"
                />
              </svg>
              <div className=" tracking-widest mt-4">
                <h2 className="text-2xl text-center  md:text-4xl">
                  <span className=" text-outline font-extrabold md:text-6xl">
                    Oops!
                  </span>
                  <br />
                  <br />
                  <br />
                  <span className="text-gray-500 font-extrabold">
                    Your Free Trial Has Ended
                  </span>
                </h2>
                <br /> <br />
                <p>
                  <span className=" text-xl">
                    But don’t worry — we’ve got exclusive offers crafted
                    especially for you! 🎁
                  </span>
                </p>
              </div>
            </center>
            <center className="mt-6">
              <Link to={"/pricing"} className="w-full">
                <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ">
                  👉 See Pricing Details
                </Button>
              </Link>
            </center>
          </div>
        </>
      ) : (
        <>
          <div className="container relative mb-20 mt-5 max-md:mb-25 ">
            <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
              <div className="lg:col-span-7 md:col-span-6 mt-14 md:mt-0">
                <div className="lg:me-8">
                  <h4 className="lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5 font-bold">
                    Find the{" "}
                    <span className="before:block before:absolute before:-inset-2 before:-skew-y-6 before:bg-emerald-600 relative inline-block">
                      <span className="relative text-white font-bold">
                        Best Job
                      </span>
                    </span>{" "}
                    <br /> offer for you.
                  </h4>
                  <p className="text-slate-400 text-lg max-w-xl mr-4">
                    Find Jobs, Employment &amp; Career Opportunities.
                  </p>
                  <div className="bg-white dark:bg-slate-900 border-0 shadow-sm rounded p-3 mt-4">
                    <form action="#">
                      <div className="registration-form text-dark text-start">
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-0 gap-6">
                          <div className="relative">
                            <input
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              type="text"
                              id="email-address-icon"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                          </div>

                          <button
                            className="py-1 rounded px-5 inline-block font-semibold tracking-wide border align-middle transition duration-500 ease-in-out text-base text-center bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white searchbtn submit-btn w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              subOne(userData?.id ?? "");
                              searchJobs();
                              fetchJobInsights();
                            }}
                            style={{ height: "60px" }}
                            disabled={loading}
                          >
                            {loading ? "Searching..." : "Search"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-400">
                      <span className="text-slate-900 dark:text-white">
                        Popular Searches :
                      </span>{" "}
                      Designer, Developer, Web, IOS, PHP Senior Engineer
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 md:col-span-6 mb-10">
                <div className="relative ">
                  <div className="relative flex justify-end">
                    <img
                      className="lg:w-[400px] w-[280px] rounded-xl shadow-sm shadow-gray-200 dark:shadow-gray-700"
                      alt=""
                      src={img1}
                    />
                  </div>
                  <div className="absolute md:-start-5 start-0 -bottom-16">
                    <img
                      className="lg:w-[280px] w-[200px] border-8 border-white dark:border-slate-900 rounded-xl"
                      alt=""
                      src={img2}
                    />
                    <div className="absolute flex justify-between items-center -top-6 md:-start-10 start-2 p-4 rounded-lg shadow-md dark:shadow-gray-800 bg-white dark:bg-slate-900 w-max">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 256 256"
                        className="text-[24px] text-amber-500"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M172,228a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,228ZM230.94,58.48A115.25,115.25,0,0,0,190.4,13.86a12,12,0,1,0-12.8,20.29,90.1,90.1,0,0,1,32,35.38A12,12,0,0,0,220.3,76a11.86,11.86,0,0,0,5.51-1.35A12,12,0,0,0,230.94,58.48ZM46.37,69.53a90.1,90.1,0,0,1,32-35.38A12,12,0,1,0,65.6,13.86,115.25,115.25,0,0,0,25.06,58.48a12,12,0,0,0,5.13,16.17A11.86,11.86,0,0,0,35.7,76,12,12,0,0,0,46.37,69.53Zm173.51,98.35A20,20,0,0,1,204,200H52a20,20,0,0,1-15.91-32.12c7.17-9.33,15.73-26.62,15.88-55.94A76,76,0,0,1,204,112C204.15,141.26,212.71,158.55,219.88,167.88ZM196.34,176c-8.16-13-16.19-33.57-16.34-63.94A52,52,0,1,0,76,112c-.15,30.42-8.18,51-16.34,64Z"></path>
                      </svg>
                      <p className="text-lg font-semibold mb-0 ms-2">
                        Job Alert Subscribe
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:order-2 order-1">
            {jobs.length == 0 ? (
              loading && <p>Loading ...</p>
            ) : (
              <div className="grid md:grid-cols-1 grid-cols-1 items-center gap-[30px]">
                {insights && (
                  <div className="grid grid-cols-12 gap-30 mt-8 p-6 border rounded-lg bg-gray-50 shadow-md">
                    <div className="mt-4 lg:col-span-8 col-span-12 flex">
                      <Card className="p-4 rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray pt-6  relative w-full break-words">
                        <h3 className="text-l font-semibold mb-5">
                          Required Skills
                        </h3>
                        <div className=" ">
                          {insights.skills.map((skill) => (
                            <div
                              key={skill}
                              className="flex justify-content-between align-items-center bg-gray-200 text-sm px-2 py-1 p-3  mb-2"
                            >
                              <h6 className="mb-0 p-3">
                                <div className="d-flex align-items-center mb-3">
                                  <svg
                                    className="w-3"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="code-branch"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                    data-fa-i2svg=""
                                  >
                                    <path
                                      fill="blue"
                                      d="M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.1-4.2 28.5-11 36.9-15.4 19.2-49.3 22.4-85.2 25.7-28.2 2.6-57.4 5.4-81.3 16.9v-144c32.5-10.2 56-40.5 56-76.3 0-44.2-35.8-80-80-80S0 35.8 0 80c0 35.8 23.5 66.1 56 76.3v199.3C23.5 365.9 0 396.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-34-21.2-63.1-51.2-74.6 3.1-5.2 7.8-9.8 14.9-13.4 16.2-8.2 40.4-10.4 66.1-12.8 42.2-3.9 90-8.4 118.2-43.4 14-17.4 21.1-39.8 21.6-67.9 31.6-10.8 54.4-40.7 54.4-75.9zM80 64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm0 384c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm224-320c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z"
                                    ></path>
                                  </svg>
                                  <h6 className="pl-3 "> {skill}</h6>
                                </div>
                              </h6>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    <div className="mt-4 lg:col-span-4 lg:ml-4 col-span-12 flex">
                      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
                        <strong className="text-gray-700">Resources:</strong>
                        <ul
                          className="mt-5 flex flex-col mt-2 "
                          style={{
                            height: "100%",
                            overflow: " scroll",
                          }}
                        >
                          {insights.resources.map((res) => (
                            <li
                              key={res.link}
                              className=" pt-3 mb-3 pb-1 cursor-pointer "
                            >
                              <div className=" ">
                                <div className="d-flex align-items-center mb-3">
                                  <svg
                                    className="w-3"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="map-marker-alt"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                    data-fa-i2svg=""
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
                                    ></path>
                                  </svg>
                                  <span className="fas fa-map-marker-alt text-primary"></span>{" "}
                                  <a
                                    className=""
                                    href={res.link}
                                    target="_blank"
                                  >
                                    <h5 className="text-semibold text-slate-600 text-small mb-0 ps-3">
                                      {res.title}
                                    </h5>
                                  </a>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 lg:ml-4 lg:col-span-12 col-span-12">
                      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
                        <strong className="text-gray-700">Roadmap:</strong>
                        {insights && insights.roadmap && (
                          <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-md">
                            <h3 className="text-lg font-semibold mb-4">
                              Career Roadmap
                            </h3>
                            <RoadmapTree roadmap={insights.roadmap} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 col-span-12">
                      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-auto dark:bg-neutral-900 dark:border-neutral-700">
                          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                                Job opportunities
                              </h2>
                            </div>
                          </div>
                          <table className="overflow-auto mt-4 min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead className="bg-gray-50 dark:bg-neutral-900">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2">
                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                                      Job Title
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2">
                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                                      Employer
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2">
                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                                      Type
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2">
                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                                      Posted on
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start"
                                >
                                  <div className="flex items-center gap-x-2">
                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                                      Location
                                    </span>
                                  </div>
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-end"
                                ></th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                              {jobs.map((job) => {
                                return (
                                  <tr className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                    <td className="size-px whitespace-nowrap">
                                      <button
                                        type="button"
                                        className="block"
                                        aria-haspopup="dialog"
                                        aria-expanded="false"
                                        aria-controls="hs-ai-invoice-modal"
                                        data-hs-overlay="#hs-ai-invoice-modal"
                                      >
                                        <span className="block px-6 py-2">
                                          <span className="font-sans text-sm text-teal-900 font-semibold italic dark:text-blue-500">
                                            {job.job_title}
                                          </span>
                                        </span>
                                      </button>
                                    </td>
                                    <td className="size-px whitespace-nowrap">
                                      <button
                                        type="button"
                                        className="block"
                                        aria-haspopup="dialog"
                                        aria-expanded="false"
                                        aria-controls="hs-ai-invoice-modal"
                                        data-hs-overlay="#hs-ai-invoice-modal"
                                      >
                                        <span className="block px-6 py-2">
                                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                                            {job.employer_name}
                                          </span>
                                        </span>
                                      </button>
                                    </td>
                                    <td className="size-px whitespace-nowrap">
                                      <button
                                        type="button"
                                        className="block"
                                        aria-haspopup="dialog"
                                        aria-expanded="false"
                                        aria-controls="hs-ai-invoice-modal"
                                        data-hs-overlay="#hs-ai-invoice-modal"
                                      >
                                        <span className="block px-6 py-2">
                                          <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                            <svg
                                              className="size-2.5"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                            </svg>
                                            {job.job_employment_type}
                                          </span>
                                        </span>
                                      </button>
                                    </td>
                                    <td className="size-px whitespace-nowrap">
                                      <button
                                        type="button"
                                        className="block"
                                        aria-haspopup="dialog"
                                        aria-expanded="false"
                                        aria-controls="hs-ai-invoice-modal"
                                        data-hs-overlay="#hs-ai-invoice-modal"
                                      >
                                        <span className="block px-6 py-2">
                                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                                            {job.job_posted_at}
                                          </span>
                                        </span>
                                      </button>
                                    </td>
                                    <td className="size-px whitespace-nowrap">
                                      <button
                                        type="button"
                                        className="block"
                                        aria-haspopup="dialog"
                                        aria-expanded="false"
                                        aria-controls="hs-ai-invoice-modal"
                                        data-hs-overlay="#hs-ai-invoice-modal"
                                      >
                                        <span className="block px-6 py-2">
                                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                                            {job.job_country}
                                          </span>
                                        </span>
                                      </button>
                                    </td>
                                    <td className="size-px whitespace-nowrap">
                                      <button
                                        type="button"
                                        className="block"
                                        aria-haspopup="dialog"
                                        aria-expanded="false"
                                        aria-controls="hs-ai-invoice-modal"
                                        data-hs-overlay="#hs-ai-invoice-modal"
                                        onClick={(e) => {
                                          e.preventDefault();
                                        }}
                                      >
                                        <span className="px-6 py-1.5">
                                          <span className="py-1 px-2 inline-flex justify-center items-center gap-2 rounded-lg border border-gray-200 font-medium bg-white text-gray-700 shadow-2xs align-middle hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                            <svg
                                              className="shrink-0 size-4"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                              <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                            </svg>
                                            <a
                                              href={job.job_apply_link}
                                              target="_blank"
                                            >
                                              Apply
                                            </a>
                                          </span>
                                        </span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default JobSearch;
