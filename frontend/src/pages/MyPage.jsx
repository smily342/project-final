import { HeaderThree } from "../components/HeaderThree";
import { PersonalBooks } from "../components/PersonalBooks";
import { Footer } from "../components/Footer";

export const MyPage = () => {
  return (
    <div className="page-wrapper">
      <HeaderThree />
      <div className="content-wrapper">
        <PersonalBooks />
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
