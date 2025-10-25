"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface Props {
    name: string;
    image?: string;
    description?: string;
    link: string;
}

function HomeCard({ name, image, description, link }: Props) {
    const router = useRouter();

    return (
        <div
            className="border-2 w-[350px] h-52 rounded-xl cursor-pointer
        hover:-translate-y-1 transition-transform duration-300 ease-in-out"
            onClick={() => router.push(link)}
        >
            <div className="rounded-xl h-[9rem] ">
                <img
                    src={
                        image
                            ? image
                            : `/assets/icons/quiz.svg`
                    }
                    // width={300}
                    height={200}
                    alt={name}
                    className="h-full w-full rounded-t-xl"
                />
            </div>
            <div className="px-4">
              <h2 className="text-xl  font-bold">{name}</h2>
              <p className="text-gray-600 text-sm leading-none font-semibold">
                 {description}
              </p>
            </div>
        </div>
    );
}

export default HomeCard;
