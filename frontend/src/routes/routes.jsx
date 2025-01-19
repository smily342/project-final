import { Route } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";
import LibraryPage from "../pages/LibraryPage";
import MyPage from "../pages/MyPage";
import SignUp from "../components/SignUp"; 

export const routes = (
  <>
    {/* Route for the Welcome Page */}
    <Route path="/" element={<WelcomePage />} />

    {/* Route for the Library Page */}
    <Route path="/library" element={<LibraryPage />} />

    {/* Route for My Page */}
    <Route path="/mypage" element={<MyPage />} />

    {/* Route for the Sign Up Page */}
    <Route path="/signup" element={<SignUp />} />
  </>

);
