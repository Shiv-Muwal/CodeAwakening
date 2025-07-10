import axios from "axios";
import React, { useEffect, useState } from "react";
import { TimelineDots } from "../common/Icon";

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  useEffect(() => {
    const getMyTimeline = async () => {
      const { data } = await axios.get(
        "https://codeawakening.onrender.com/api/v1/timeline/getall",
        { withCredentials: true }
      );
      setTimeline(data.timelines);
    };
    getMyTimeline();
  }, []);
  return (
    <div className="container">
    <h1 className="overflow-x-hidden text-center text-[2rem] sm:text-[1.75rem] md:text-[2.2rem] lg:text-[2.8rem] mb-4 font-extrabold">Timeline</h1>
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {timeline &&
          timeline.map((element) => {
            return (
              <li className="mb-10 ms-6" key={element._id}>
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <TimelineDots/>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {element.title}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {element.timeline.from} - {element.timeline.to ? element.timeline.to : "Present"}
                </time>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {element.description}
                </p>
              </li>
            );
          })}
      </ol>
    </div>
  );
};

export default Timeline;
