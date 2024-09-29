"use client";

import Navbar from "@/components/global/navbar";
import { HeroParallax } from "@/components/global/connect-parallax";
import { ContainerScroll } from "@/components/global/container-scroll-animation";
import { LampComponent } from "@/components/global/lamp";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/constants";

export default function Home() {
  // Define the API fetching function without async/await
  const fetchApi = () => {
    fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crimeDataUrl:
          "https://firebasestorage.googleapis.com/v0/b/binsr-484d7.appspot.com/o/crime-data_crime-data_crimestat.csv?alt=media&token=21120ded-08ae-464c-a9ca-4f88b3ad491f",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        // Handle the fetched data as needed
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <Navbar />
      <section className="relative flex h-screen w-full flex-col items-center overflow-visible rounded-md bg-neutral-950 antialiased">
        <div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
        <div className="mt-[-100px] flex flex-col md:mt-[-50px]">
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center">
                {/* Removed onClick handler from the Get Demo button */}
                <Button
                  size={"lg"}
                  className="group mb-8 flex w-full items-center justify-center gap-4 rounded-full border-t-2 border-[#4D4D4D] bg-[#1F1F1F] p-8 text-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-neutral-500 sm:w-fit md:mb-0"
                >
                  <span className="bg-gradient-to-r from-neutral-500 to-neutral-600 bg-clip-text font-sans text-transparent group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black md:text-center">
                    Get Demo
                  </span>
                </Button>
                <h1 className="bg-gradient-to-b from-white to-neutral-600 bg-clip-text font-sans text-5xl font-bold text-transparent md:text-8xl">
                  Arizona State University Saviors
                </h1>
              </div>
            }
          />
        </div>
      </section>

      <section className="mt-[-100px] md:mt-[18rem]">
        <HeroParallax products={products} />
      </section>
      <section>
        <LampComponent />
      </section>
      
      {/* Input Field Section */}
      <div className="relative mt-10 flex items-center justify-center">
        {/* Grid Background */}
        <div className="absolute z-[-1] h-[800px] w-[800px] bg-[linear-gradient(to_right,#0f0f10_1px,transparent_1px),linear-gradient(to_bottom,#0f0f10_1px,transparent_1px)] bg-center bg-[size:1rem_1rem] blur-[1px]"></div>

        <div id="poda" className="relative flex items-center justify-center">
          {/* Glow */}
          <div className="absolute z-[-1] max-h-[130px] max-w-[654px] h-full w-full overflow-hidden rounded-[12px] blur-[30px] opacity-40 glow"></div>

          {/* Dark Border Backgrounds */}
          <div className="absolute z-[-1] max-h-[65px] max-w-[612px] h-full w-full overflow-hidden rounded-[12px] blur-[3px] darkBorderBg"></div>
          <div className="absolute z-[-1] max-h-[65px] max-w-[612px] h-full w-full overflow-hidden rounded-[12px] blur-[3px] darkBorderBg"></div>
          <div className="absolute z-[-1] max-h-[65px] max-w-[612px] h-full w-full overflow-hidden rounded-[12px] blur-[3px] darkBorderBg"></div>

          {/* White Layer */}
          <div className="absolute z-[-1] max-h-[63px] max-w-[607px] h-full w-full overflow-hidden rounded-[10px] blur-[2px] white"></div>

          {/* Border */}
          <div className="absolute z-[-1] max-h-[59px] max-w-[603px] h-full w-full overflow-hidden rounded-[11px] blur-[0.5px] border"></div>

          {/* Main Input Container */}
          <div id="main" className="relative">
            <input
              placeholder="Enter Pincode..."
              type="text"
              name="text"
              className="h-[56px] w-[601px] rounded-[10px] border-none bg-[#010201] px-[59px] text-[18px] text-white placeholder:text-[#c0b9c0] focus:outline-none"
            />

            {/* Input Mask */}
            <div
              id="input-mask"
              className="pointer-events-none absolute top-[18px] left-[70px] h-[20px] w-[200px] bg-[linear-gradient(90deg,transparent,black)]"
            ></div>

            {/* Pink Mask */}
            <div
              id="pink-mask"
              className="pointer-events-none absolute top-[10px] left-[5px] h-[20px] w-[30px] bg-[#cf30aa] blur-[20px] opacity-80 transition-all duration-2000"
            ></div>

            {/* Filter Border */}
            <div className="absolute top-[7px] right-[7px] h-[42px] w-[40px] overflow-hidden rounded-[10px] filterBorder"></div>

            {/* Filter Icon */}
            <div
              id="filter-icon"
              className="absolute top-[8px] right-[8px] z-[2] flex h-full w-full max-h-[40px] max-w-[38px] items-center justify-center overflow-hidden rounded-[10px] border border-transparent bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] isolation-auto"
              onClick={fetchApi} // Attach the onClick handler here
            >
              {/* SVG content */}
            </div>

            {/* Search Icon */}
            <div id="search-icon" className="absolute left-[20px] top-[15px]">
              {/* SVG content */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
