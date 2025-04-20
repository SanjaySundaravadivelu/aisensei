import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";

import {
  collection,
  getDoc,
  onSnapshot,
  query,
  where,
  doc,
} from "firebase/firestore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "SOmething went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
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

    storeUserData();
  }, []);
  if (loading && !isLoaded) {
    return (
      <div className="flex items-center">
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
          <div className="flex w-full items-center justify-between">
            {/* headings */}
            <Headings
              title="Dashboard"
              description="Create and start you AI Mock interview"
            />
            <Link to={"/generate/create"}>
              <Button size={"sm"}>
                <Plus /> Add New
              </Button>
            </Link>
          </div>

          <Separator className="my-8" />
          {/* content section */}

          <div className="md:grid md:grid-cols-3 gap-3 py-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 md:h-32 rounded-md" />
              ))
            ) : interviews.length > 0 ? (
              interviews.map((interview) => (
                <InterviewPin key={interview.id} interview={interview} />
              ))
            ) : (
              <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
                <img
                  src={`${import.meta.env.BASE_URL}/assets/svg/not-found.svg`}
                  className="w-44 h-44 object-contain"
                  alt=""
                />

                <h2 className="text-lg font-semibold text-muted-foreground">
                  No Data Found
                </h2>

                <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
                  There is no available data to show. Please add some new mock
                  interviews
                </p>

                <Link to={"/generate/create"} className="mt-4">
                  <Button size={"sm"}>
                    <Plus className="min-w-5 min-h-5 mr-1" />
                    Add New
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
