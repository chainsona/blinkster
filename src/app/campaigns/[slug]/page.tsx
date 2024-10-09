"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FiEye,
  FiMousePointer,
  FiTrendingUp,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Campaign } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CampaignPage() {
  const params = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await fetch(`/api/campaigns/${params.slug}`);
      const data = await response.json();
      setCampaign(data);
    };

    fetchCampaign();
  }, [params.slug]);

  if (!campaign) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: campaign.dailyData?.map((day) => day.date) || [],
    datasets: [
      {
        label: "Views",
        data: campaign.dailyData?.map((day) => day.views),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Clicks",
        data: campaign.dailyData?.map((day) => day.clicks) || [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Conversions",
        data: campaign.dailyData?.map((day) => day.conversions),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Campaign Performance",
      },
    },
  };

  const totalViews =
    campaign.dailyData?.reduce((acc, day) => acc + day.views, 0) || 0;
  const totalClicks =
    campaign.dailyData?.reduce((acc, day) => acc + day.clicks, 0) || 0;
  const totalConversions =
    campaign.dailyData?.reduce((acc, day) => acc + day.conversions, 0) || 0;
  const conversionRate =
    totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const clickThroughRate =
    totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  const averageDailyViews =
    campaign.dailyData && campaign.dailyData.length > 0
      ? totalViews / campaign.dailyData.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#3A3A3A] rounded-xl p-6 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-6">
            <Image
              src={campaign.imageUrl}
              alt={campaign.name}
              width={200}
              height={200}
              className="rounded-xl object-cover w-full h-auto"
            />
          </div>
          <div className="w-full md:w-3/4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#E8B54B]">
              {campaign.name}
            </h1>
            <p className="text-[#D0D0D0] mb-4 text-sm">
              {campaign.description}
            </p>
            <div className="flex flex-col md:flex-row justify-between text-sm">
              <p className="flex items-center text-[#D0D0D0] mb-2 md:mb-0">
                <FiCalendar className="mr-1" /> Start:{" "}
                {new Date(campaign.startDate).toLocaleDateString()}
              </p>
              <p className="flex items-center text-[#D0D0D0] mb-2 md:mb-0">
                <FiCalendar className="mr-1" /> End:{" "}
                {new Date(campaign.endDate).toLocaleDateString()}
              </p>
              <p className="flex items-center text-[#D0D0D0]">
                <FiClock className="mr-1" /> Status: {campaign.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Views" value={totalViews} icon={<FiEye />} />
        <MetricCard
          title="Total Clicks"
          value={totalClicks}
          icon={<FiMousePointer />}
        />
        <MetricCard
          title="Total Conversions"
          value={totalConversions}
          icon={<FiTrendingUp />}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(2)}%`}
          icon={<FiTrendingUp />}
        />
      </div>

      <div className="bg-[#3A3A3A] rounded-xl p-6 shadow-lg mb-8">
        <Bar options={chartOptions} data={chartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#3A3A3A] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[#E8B54B]">
            Campaign Details
          </h2>
          <p className="flex items-center text-[#D0D0D0] mb-2">
            <FiCalendar className="mr-2" /> Start Date:{" "}
            {new Date(campaign.startDate).toLocaleDateString()}
          </p>
          <p className="flex items-center text-[#D0D0D0] mb-2">
            <FiCalendar className="mr-2" /> End Date:{" "}
            {new Date(campaign.endDate).toLocaleDateString()}
          </p>
          <p className="flex items-center text-[#D0D0D0] mb-2">
            <FiClock className="mr-2" /> Status: {campaign.status}
          </p>
        </div>
        <div className="bg-[#3A3A3A] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[#E8B54B]">
            Performance Summary
          </h2>
          <p className="text-[#D0D0D0] mb-2">
            Click-through Rate: {clickThroughRate.toFixed(2)}%
          </p>
          <p className="text-[#D0D0D0] mb-2">
            Conversion Rate: {conversionRate.toFixed(2)}%
          </p>
          <p className="text-[#D0D0D0]">
            Average Daily Views: {averageDailyViews.toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}

const MetricCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="bg-[#3A3A3A] rounded-xl p-6 shadow-lg">
    <div className="flex items-center mb-2">
      <div className="p-3 bg-[#F1D08A]/20 rounded-full mr-4">{icon}</div>
      <h2 className="text-xl font-semibold text-[#FFFFFF]">{title}</h2>
    </div>
    <p className="text-3xl font-bold text-[#F1D08A]">
      {typeof value === "number" ? value.toLocaleString() : value}
    </p>
  </div>
);
