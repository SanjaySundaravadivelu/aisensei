import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { ProfileContainer } from "./profile-container";
import { ToggleContainer } from "./toggle-container";

const Header = () => {
  const { userId } = useAuth();

  return (
    <header
      className={cn(
        "w-full duration-150 transition-all ease-in-out header-container"
      )}
    >
      <Container>
        <div className="flex items-center gap-4 w-full">
          {/* logo section */}
          <LogoContainer />

          {/* navigation section */}
          <nav className="hidden md:flex items-center gap-3">
            {userId && (
              <>
                {" "}
                <NavigationRoutes />
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-6">
            {/* profile section */}
            <ProfileContainer />

            {/* mobile toggle section */}
            {userId && (
              <>
                {" "}
                <ToggleContainer />
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
