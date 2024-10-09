"use client";

import React, { useState, useEffect } from "react";
import { FiEye, FiMousePointer, FiTrendingUp } from "react-icons/fi";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  // This is a placeholder for actual data. In a real application, you'd fetch this data from your backend.
  const kpis = {
    displayRate: 75.5,
    interactionRate: 45.2,
    conversionRate: 12.8,
  };
  // Mock data for the graph (last 7 days)
  const graphData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Views",
        data: [180, 210, 195, 230, 205, 190, 220],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Interactions",
        data: [95, 120, 105, 135, 110, 100, 125],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Conversions",
        data: [22, 28, 25, 32, 27, 24, 30],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#FFFFFF", // White text for better contrast
          font: {
            size: 14 // Increased font size for legend labels
          }
        },
      },
      title: {
        display: true,
        text: "Views, Interactions, and Conversions",
        color: "#FFFFFF", // White text for better contrast
        font: {
          size: 18 // Increased font size for title
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
        ticks: {
          color: "#FFFFFF", // White text for better contrast
          font: {
            size: 12 // Increased font size for x-axis labels
          }
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
        ticks: {
          color: "#FFFFFF", // White text for better contrast
          font: {
            size: 12 // Increased font size for y-axis labels
          }
        },
      },
    },
  };

  // Calculate total metrics
  const totalViews = graphData.datasets[0].data.reduce((a, b) => a + b, 0);
  const totalInteractions = graphData.datasets[1].data.reduce(
    (a, b) => a + b,
    0
  );
  const totalConversions = graphData.datasets[2].data.reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Views"
          value={totalViews}
          icon={<FiEye className="w-6 h-6" />}
          description="Total number of users who viewed your Blinks"
        />
        <KPICard
          title="Total Interactions"
          value={totalInteractions}
          icon={<FiMousePointer className="w-6 h-6" />}
          description="Total number of users who interacted with your Blinks"
        />
        <KPICard
          title="Total Conversions"
          value={totalConversions}
          icon={<FiTrendingUp className="w-6 h-6" />}
          description="Total number of users who made successful transactions"
        />
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          Recent Activity
        </h2>
        {/* Add a table or list of recent activities here */}
        {totalViews === 0 &&
        totalInteractions === 0 &&
        totalConversions === 0 ? (
          <p className="text-muted-foreground">
            No recent activities to display.
          </p>
        ) : (
          <div
            className="bg-[#3A3A3A] rounded-xl p-6 shadow-lg"
            style={{ height: "520px" }}
          >
            <Bar options={options} data={graphData} />
          </div>
        )}
      </div>
    </div>
  );
};

const KPICard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}> = ({ title, value, icon, description }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // Animation duration in milliseconds
    const steps = 60; // Number of steps in the animation
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-[#3A3A3A] shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-[#F1D08A]/20 rounded-full mr-4">{icon}</div>
        <h2 className="text-xl font-semibold text-[#FFFFFF]">{title}</h2>
      </div>
      <p className="text-4xl font-bold text-[#F1D08A] mb-2">{count.toLocaleString()}</p>
      <p className="text-sm text-[#D0D0D0]">{description}</p>
    </div>
  );
};

export default DashboardPage;
