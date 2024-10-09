"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Campaign } from "@/types";

export default function CampaignsPage() {
  const [sortedCampaigns, setSortedCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/api/campaigns");
        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }
        const fetchedCampaigns: Campaign[] = await response.json();
        // Sort campaigns by creation date in descending order (newest first)
        const sortedFetchedCampaigns = fetchedCampaigns.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSortedCampaigns(sortedFetchedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        // Handle error state here (e.g., set an error message state)
      }
    };

    fetchCampaigns();
  }, []);
  // Render the campaigns page
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and create campaign button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#E8B54B] flex items-center">
          Campaigns
        </h1>
        <button className="bg-[#E8B54B] text-[#383838] font-bold py-2 px-4 rounded hover:bg-[#C7973A] transition-colors duration-300 flex items-center">
          <FiPlus className="mr-2" /> Create Campaign
        </button>
      </div>
      {/* Grid of campaign cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCampaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/campaigns/${campaign.id}`}
            className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full"
          >
            {/* Campaign image */}
            <div className="relative w-full pb-[100%]">
              <Image
                src={campaign.imageUrl}
                alt={campaign.name}
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0"
              />
            </div>
            {/* Campaign details */}
            <div className="p-6 bg-[#1E1E1E] flex flex-col flex-grow">
              <h2 className="text-2xl font-semibold text-[#F1D08A] mb-2">
                {campaign.name}
              </h2>
              <p className="text-[#E0E0E0] mb-4 flex-grow">
                {campaign.description}
              </p>
              {/* Campaign status and dates */}
              <div className="mt-auto">
                <div className="flex justify-between text-sm text-[#FFFFFF] bg-[#2A2A2A] p-2 rounded-lg mb-2">
                  <span>Status: {campaign.status}</span>
                  <span>
                    Start: {new Date(campaign.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    End: {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                </div>
                {/* Campaign creation date */}
                <p className="text-[#C0C0C0] text-sm">
                  Created on:{" "}
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
