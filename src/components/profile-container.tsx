import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { db } from "@/config/firebase.config";
import { User } from "@/types";
import { useAuth, useUser, UserButton } from "@clerk/clerk-react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const ProfileContainer = () => {
  const { isSignedIn, isLoaded } = useAuth();
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

  if (!isLoaded) {
    return (
      <div className="flex items-center">
        <Loader className="min-w-4 min-h-4 animate-spin text-emerald-500" />
      </div>
    );
  }

  const DotIcon = () => {
    return (
      <svg
        id="Money_Yours_24"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect width="24" height="24" stroke="none" fill="#000000" opacity="0" />

        <g transform="matrix(0.87 0 0 0.87 12 12)">
          <path
            style={{
              stroke: "none",
              strokeWidth: 1,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            transform=" translate(-13, -12.5)"
            d="M 19.625 1.0097656 C 19.496406 0.990875 19.362266 0.9965 19.228516 1.03125 L 3.9902344 5 L 11.927734 5 L 17.884766 3.4492188 C 18.137766 3.8212187 18.543188 4.0606094 18.992188 4.0996094 L 19.228516 5 L 21.294922 5 L 20.447266 1.7480469 C 20.343016 1.3475469 20.010781 1.0664375 19.625 1.0097656 z M 3 7 C 2.448 7 2 7.448 2 8 L 2 18 C 2 18.552 2.448 19 3 19 L 13.058594 19 C 13.021594 18.678 13 18.346 13 18 L 13 17 L 4.9121094 17 C 4.760998937919506 16.574085432688335 4.425914633580208 16.23900127529821 4.000000000000001 16.087891 L 4 9.9121094 C 4.425914719667199 9.760999039087588 4.760999039087588 9.4259147196672 4.9121094 9 L 19.087891 9 C 19.239001275298207 9.425914633580208 19.574085432688335 9.760998937919506 20 9.9121094 L 20 11.033203 L 20.3125 11.171875 L 22 11.921875 L 22 8 C 22 7.448 21.552 7 21 7 L 3 7 z M 12 10 C 10.343 10 9 11.343 9 13 C 9 14.657 10.343 16 12 16 C 12.353 16 12.686 15.928406 13 15.816406 L 13 15 L 13 13.699219 L 14.1875 13.171875 L 14.982422 12.818359 C 14.886422 11.248359 13.595 10 12 10 z M 7 12 C 6.448 12 6 12.447 6 13 C 6 13.553 6.448 14 7 14 C 7.552 14 8 13.553 8 13 C 8 12.447 7.552 12 7 12 z M 19.5 13 L 15 15 L 15 18 C 15 21.915 18.22 23.743 19.5 24 C 20.78 23.743 24 21.915 24 18 L 24 15 L 19.5 13 z"
            stroke-linecap="round"
          />
        </g>
      </svg>
    );
  };
  return (
    <div className="flex items-center gap-6">
      {isSignedIn && !loading ? (
        <UserButton afterSignOutUrl="/aisensei/">
          <UserButton.MenuItems>
            <UserButton.Link
              label={"Current Plan : " + userData?.subrcription + " -- 🚀"}
              labelIcon={<DotIcon />}
              href="/aisensei/pricing"
            />
          </UserButton.MenuItems>
        </UserButton>
      ) : (
        <Link to={"/signin"}>
          <Button size={"sm"}>Get Started</Button>
        </Link>
      )}
    </div>
  );
};
