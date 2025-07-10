import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Portfolio = () => {
  const [viewAll, setViewAll] = useState(false);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const getMyProjects = async () => {
      const { data } = await axios.get(
        "https://codeawakening.onrender.com/api/v1/project/getall",
        { withCredentials: true }
      );
      setProjects(data.projects);
    };
    getMyProjects();
  }, []);
  return (
    <div className="container">
        <h1
          className="text-[2rem] sm:text-[2.75rem] 
          md:text-[3rem] lg:text-[3.8rem] leading-[56px] md:leading-[67px] lg:leading-[90px] 
          tracking-[15px] text-center"
        >
          MY WORK
        </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {viewAll
          ? projects &&
            projects.map((element) => {
              return (
                <Link to={`/project/${element._id}`} key={element._id}>
                  <img
                    src={element.projectBanner && element.projectBanner.url}
                    alt={element.title}
                  />
                </Link>
              );
            })
          : projects &&
            projects.slice(0, 9).map((element) => {
              return (
                <Link to={`/project/${element._id}`} key={element._id}>
                  <img
                    src={element.projectBanner && element.projectBanner.url}
                    alt={element.title}
                  />
                </Link>
              );
            })}
      </div>
      {projects && projects.length > 9 && (
        <div className="w-full text-center my-9">
          <Button className="w-52" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
