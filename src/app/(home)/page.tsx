// import Image from "next/image";
import Link from "next/link"
import HomeNavigator from "@/components/home-navigator";
import Navbar from "@/components/navbar";


export default function Home() {



  return (
      // <div>
      //     {/*<Navbar />*/}
      //   <h1 className="text-3xl font-bold mb-4">MCQ App</h1>
      //   <p className="mb-6">Take quizzes, track results, and manage questions (admin).</p>
      //
      //   <div className="flex items-center w-full gap-x-4">
      //       <HomeNavigator />
      //   </div>
      // </div>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full gap-6 mt-6">
          <div className="w-full md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
                  MCQ App
              </h1>
              <p className="mb-6 text-center md:text-left text-gray-600">
                  Take quizzes, track results, and manage questions (admin).
              </p>

              <div className="flex justify-center md:justify-start w-full gap-x-4">
                  <HomeNavigator />
              </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
              <img
                  src="/assets/images/quiz-illustration.svg"
                  alt="Quiz illustration"
                  className="w-3/4 md:w-full  rounded-2xl "
                  // className=" w-full md:w-2/3  rounded-2xl "
                  height="5000"
                  width="4000"
              />
          </div>
      </div>
  );
}
